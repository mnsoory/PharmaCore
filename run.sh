#!/bin/bash
set -e

/opt/mssql/bin/sqlservr &
MSSQL_PID=$!

echo "Waiting for SQL Server to be ready..."
for i in $(seq 1 30); do
    if /opt/mssql-tools18/bin/sqlcmd -C -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "SELECT 1" &>/dev/null; then
        echo "SQL Server is ready."
        break
    fi
    echo "  attempt $i/30..."
    sleep 3
done

upload_to_hf() {
    if [ -z "$HF_TOKEN" ]; then
        echo "WARNING: HF_TOKEN is not set. Skipping upload."
        return 1
    fi
    if [ ! -f "/app/backend/PharmaCoreDb.bak" ]; then
        echo "WARNING: Backup file not found. Skipping upload."
        return 1
    fi
    python3 -c "
from huggingface_hub import HfApi
import os
api = HfApi(token=os.environ['HF_TOKEN'])
api.upload_file(
    path_or_fileobj='/app/backend/PharmaCoreDb.bak',
    path_in_repo='PharmaCoreDb.bak',
    repo_id=os.environ['REPO_ID'],
    repo_type='dataset'
)
print('Upload complete.')
"
}

if [ "$MIGRATE_ONLY" = "true" ]; then
    /opt/mssql-tools18/bin/sqlcmd -C -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "
        EXEC sp_configure 'show advanced options', 1; RECONFIGURE;
        EXEC sp_configure 'clr enabled', 0; RECONFIGURE;"

    cd /app/backend
    MIGRATE_ONLY=true dotnet PharmaCore.API.dll

    /opt/mssql-tools18/bin/sqlcmd -C -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "
        BACKUP DATABASE PharmaCoreDb
        TO DISK = '/app/backend/PharmaCoreDb.bak'
        WITH FORMAT, INIT;"

    upload_to_hf

    kill $MSSQL_PID
    exit 0
fi

BACKUP_URL="https://huggingface.co/datasets/${REPO_ID}/resolve/main/PharmaCoreDb.bak"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer ${HF_TOKEN}" "$BACKUP_URL")

if [ "$HTTP_STATUS" -eq 200 ]; then
    curl -L -H "Authorization: Bearer ${HF_TOKEN}" \
        -o /app/backend/PharmaCoreDb.bak "$BACKUP_URL"

    /opt/mssql-tools18/bin/sqlcmd -C -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "
        RESTORE DATABASE PharmaCoreDb
        FROM DISK = '/app/backend/PharmaCoreDb.bak'
        WITH MOVE 'PharmaCoreDb'     TO '/var/opt/mssql/data/PharmaCoreDb.mdf',
             MOVE 'PharmaCoreDb_log' TO '/var/opt/mssql/data/PharmaCoreDb_log.ldf',
        REPLACE;"
else
    echo "No remote backup found. Starting with empty database."
fi

/opt/mssql-tools18/bin/sqlcmd -C -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "
    EXEC sp_configure 'show advanced options', 1; RECONFIGURE;
    EXEC sp_configure 'clr enabled', 0; RECONFIGURE;" || true

cd /app/backend && dotnet PharmaCore.API.dll --urls "http://localhost:8080" &

caddy run --config /app/Caddyfile --adapter caddyfile &

while true; do
    sleep 300

    /opt/mssql-tools18/bin/sqlcmd -C -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "
        BACKUP DATABASE PharmaCoreDb
        TO DISK = '/app/backend/PharmaCoreDb.bak'
        WITH FORMAT, INIT;" || true

    upload_to_hf || true
done
