#!/bin/bash

/opt/mssql/bin/sqlservr &

echo "Waiting for SQL Server..."
until /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "SELECT 1" &>/dev/null
do
    sleep 2
done

BACKUP_URL="https://huggingface.co/datasets/${REPO_ID}/resolve/main/PharmaCoreDb.bak"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer ${HF_TOKEN}" "$BACKUP_URL")

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "Found remote backup, downloading..."
    curl -L -H "Authorization: Bearer ${HF_TOKEN}" -o /var/opt/mssql/data/PharmaCoreDb.bak "$BACKUP_URL"
    
    echo "Restoring database..."
    /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "
    RESTORE DATABASE PharmaCoreDb 
    FROM DISK = '/var/opt/mssql/data/PharmaCoreDb.bak' 
    WITH MOVE 'PharmaCoreDb' TO '/var/opt/mssql/data/PharmaCoreDb.mdf', 
    MOVE 'PharmaCoreDb_log' TO '/var/opt/mssql/data/PharmaCoreDb_log.ldf', 
    REPLACE;"
else
    echo "No remote backup found or dataset unavailable (Status: $HTTP_STATUS). Skipping restore."
fi

cd /app/backend && dotnet PharmaCore.API.dll --urls "http://localhost:8080" &

caddy run --config /app/Caddyfile --adapter caddyfile &

while true
do
    sleep 300
    echo "Creating scheduled backup..."
    /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "BACKUP DATABASE PharmaCoreDb TO DISK = '/var/opt/mssql/data/PharmaCoreDb.bak' WITH FORMAT, INIT;"
    
    if [ -f "/var/opt/mssql/data/PharmaCoreDb.bak" ]; then
        echo "Uploading backup to Hugging Face..."
        curl -X PUT \
             -H "Authorization: Bearer ${HF_TOKEN}" \
             --data-binary @/var/opt/mssql/data/PharmaCoreDb.bak \
             "https://huggingface.co/api/datasets/${REPO_ID}/upload/main/PharmaCoreDb.bak"
    fi
done
