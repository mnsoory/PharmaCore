#!/bin/bash

/opt/mssql/bin/sqlservr &

cd /app/backend && dotnet PharmaCore.API.dll --urls "http://localhost:8080" &

caddy run --config /app/Caddyfile --adapter caddyfile