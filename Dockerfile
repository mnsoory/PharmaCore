FROM node:22-alpine AS frontend-build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ .
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS backend-build
WORKDIR /src
COPY backend/PharmaCore.sln ./
COPY backend/PharmaCore.API/*.csproj PharmaCore.API/
COPY backend/PharmaCore.Application/*.csproj PharmaCore.Application/
COPY backend/PharmaCore.Core/*.csproj PharmaCore.Core/
COPY backend/PharmaCore.Infrastructure/*.csproj PharmaCore.Infrastructure/
RUN dotnet restore "PharmaCore.API/PharmaCore.API.csproj"
COPY backend/ .
WORKDIR /src/PharmaCore.API
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/mssql/server:2022-latest
USER root
RUN apt-get update && apt-get install -y curl debian-keyring debian-archive-keyring apt-transport-https wget && \
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list && \
    apt-get update && apt-get install -y caddy && \
    rm -rf /var/lib/apt/lists/*
RUN wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh && \
    chmod +x dotnet-install.sh && \
    ./dotnet-install.sh --runtime aspnetcore --version 9.0 --install-dir /usr/share/dotnet && \
    ln -s /usr/share/dotnet/dotnet /usr/bin/dotnet && \
    rm dotnet-install.sh

WORKDIR /app
RUN mkdir -p /var/opt/mssql && chown -R 1000:0 /var/opt/mssql && chmod -R g=u /var/opt/mssql

COPY --from=frontend-build /app/dist ./frontend
COPY --from=backend-build /app/publish ./backend
COPY Caddyfile ./Caddyfile
COPY run.sh ./run.sh
RUN chmod +x ./run.sh && chown -R 1000:0 /app

USER 1000
ENV ACCEPT_EULA=Y
ENV ConnectionStrings__DefaultConnection="Server=127.0.0.1;Database=PharmaCoreDb;User Id=sa;Password=${MSSQL_SA_PASSWORD};TrustServerCertificate=True;"

EXPOSE 7860
CMD ["./run.sh"]