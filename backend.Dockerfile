# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Optimize restore by caching project layers
COPY ["PharmaCore.sln", "./"]
COPY ["PharmaCore.API/*.csproj",           "PharmaCore.API/"]
COPY ["PharmaCore.Application/*.csproj",   "PharmaCore.Application/"]
COPY ["PharmaCore.Core/*.csproj",          "PharmaCore.Core/"]
COPY ["PharmaCore.Infrastructure/*.csproj","PharmaCore.Infrastructure/"]

RUN dotnet restore "PharmaCore.API/PharmaCore.API.csproj"

# Copy source and publish
COPY . .

WORKDIR /src/PharmaCore.API
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

EXPOSE 8080
ENTRYPOINT ["dotnet", "PharmaCore.API.dll"]