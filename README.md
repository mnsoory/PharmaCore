---
title: PharmaCore
emoji: 💊
colorFrom: blue
colorTo: purple
sdk: docker
app_file: run.sh
pinned: false
---

# 💊 PharmaCore

<div align="center">

[![Build Status](https://img.shields.io/badge/Build-Active-brightgreen)]()
[![Latest Commit](https://img.shields.io/badge/Last%20Updated-May%202026-blue)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-61.8%25-blue)]()
[![C#](https://img.shields.io/badge/C%23-36.5%25-239120)]()

**A comprehensive, production-ready pharmacy management system with JWT authentication, real-time inventory tracking, and role-based access control.**

[Features](#-key-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [API Docs](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Overview

**PharmaCore** is a full-stack pharmacy management platform designed to streamline pharmaceutical operations. It provides comprehensive tools for inventory management, supplier relationships, sales processing, stock tracking, and advanced reporting—all with enterprise-grade security and scalability.

Built with **ASP.NET Core 9.0** backend, **React 19** frontend, and **SQL Server** database, PharmaCore offers a modern, containerized architecture ready for immediate deployment.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React 19)                       │
│  • Vite Build Tool • TailwindCSS • HeroUI Components        │
│  • React Router v7 • TanStack Query • Zustand State Mgmt    │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST (8080)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│            Reverse Proxy (Caddy 2.0-alpine)                 │
│  • TLS/HTTPS • Security Headers • Rate Limiting             │
│  • Static File Serving • API Routing                        │
└────────────────┬──────────────────────┬────────────────────┘
                 │                      │
        ┌────────▼────────┐    ┌───────▼────────┐
        │   Backend API   │    │   Frontend App │
        │  (Port 8080)    │    │  (Port 80/443) │
        │  .NET Core 9.0  │    │  (via Nginx)   │
        └────────┬────────┘    └────────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │  Database (SQL Server 2022)│
    │  • Entity Framework Core 9 │
    │  • Auto-Migrations         │
    │  • Azure SQL Edge Support  │
    └────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | React | ^19.2.5 | UI Framework |
| | Vite | ^8.0.9 | Build Tool |
| | TailwindCSS | ^4.2.2 | Styling |
| | HeroUI | ^3.0.3 | Components |
| | Zustand | ^5.0.12 | State Management |
| | TanStack Query | ^5.100.5 | Data Fetching |
| | Axios | ^1.15.1 | HTTP Client |
| | React Router | ^7.14.1 | Routing |
| | TypeScript | ~6.0.2 | Language |
| **Backend** | ASP.NET Core | 9.0 | API Server |
| | Entity Framework Core | 9.0.14 | ORM |
| | JWT Bearer | 9.0.14 | Authentication |
| | BCrypt.Net-Next | 4.1.0 | Hashing |
| | AutoMapper | 16.1.1 | Mapping |
| | Swagger | 10.1.7 | Documentation |
| **Database** | SQL Server | 2022 | Database |
| **DevOps** | Docker | Latest | Containers |
| | Docker Compose | Latest | Orchestration |
| | Caddy | 2-alpine | Reverse Proxy |
| | GitHub Actions | - | CI/CD |

---

## 🎯 Key Features

### 📦 **Inventory Management**
- Real-time stock tracking with batch-level precision
- Low-stock & out-of-stock alerts
- Expiration date tracking
- Drug alternative suggestions

### 🤝 **Supplier Management**
- Purchase order creation & tracking
- Partial receipt handling
- Order status workflows

### 💳 **Sales & POS**
- Transaction processing
- Multi-drug sales
- Sales cancellation with stock reversal

### 🔐 **Security**
- JWT authentication with refresh tokens
- Role-based access control
- Rate limiting (100 req/min, 5 login attempts/30min)
- Security headers & CORS protection

### 📊 **Dashboard**
- Real-time metrics
- Low-stock alerts
- Sales trends & performance

### 🔄 **Data Recovery**
- Automatic backups
- Hugging Face integration
- Auto-migrations

---

## 🚀 Quick Start

### **Option 1: Docker Compose (Recommended)**

```bash
git clone https://github.com/mnsoory/PharmaCore.git
cd PharmaCore
cp .env.example .env
docker-compose up -d
```

Access at: http://localhost:7860

### **Option 2: Local Development**

**Backend:**
```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```

**Frontend:**
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

---

## ⚙️ Configuration

Create `.env` file:

```env
MSSQL_SA_PASSWORD=YourStrongPassword123!
JWT_SECRET=your-super-secret-key-at-least-32-chars-long
JWT_ISSUER=PharmaCore
JWT_AUDIENCE=PharmaCore
JWT_EXPIRY_MINUTES=60
HF_TOKEN=your_hugging_face_token  # Optional
```

---

## 📡 API Documentation

Access Swagger UI at: `/swagger`

### **Core Endpoints**

**Authentication** (`/api/users`)
- POST `/register` - Register user
- POST `/login` - Authenticate
- POST `/refresh` - Refresh token
- POST `/change-password` - Update password

**Inventory** (`/api/drugs`, `/api/stock-batches`)
- GET `/api/drugs` - List drugs
- GET `/api/stock-batches/low-stock` - Low stock alerts
- GET `/api/stock-batches/expiring-soon` - Expiration alerts

**Sales** (`/api/sales`)
- GET `/api/sales` - List transactions
- POST `/api/sales` - Process sale
- DELETE `/api/sales/{id}` - Cancel sale

**Purchase Orders** (`/api/purchase-orders`)
- GET `/api/purchase-orders` - List orders
- POST `/api/purchase-orders` - Create order
- PUT `/api/purchase-orders/{id}` - Update order

### **Rate Limiting**

| Policy | Limit | Window |
|--------|-------|--------|
| Global | 100 req | 1 min |
| Login | 5 attempts | 30 min |
| Password Change | 3 attempts | 15 min |

---

## 📁 Project Structure

```
PharmaCore/
├── backend/
│   ├── PharmaCore.API/              # REST API Layer
│   │   ├── Controllers/             # 11 API endpoints
│   │   ├── Filters/                 # Authorization filters
│   │   ├── Middlewares/             # Error handling
│   │   └── Program.cs               # Service setup
│   ├── PharmaCore.Application/      # Business logic
│   │   ├── Services/                # Domain services
│   │   └── Mappings/                # AutoMapper profiles
│   ├── PharmaCore.Core/             # Domain models
│   │   ├── Entities/                # Database models
│   │   ├── Interfaces/              # Contracts
│   │   └── Enums/                   # Types
│   └── PharmaCore.Infrastructure/   # Data access
│       ├── Data/                    # DbContext
│       ├── Repositories/            # Data layer
│       └── Migrations/              # Database schema
├── frontend/
│   ├── src/
│   │   ├── pages/                   # Route pages
│   │   ├── components/              # React components
│   │   ├── services/                # API calls
│   │   ├── api/                     # API clients
│   │   ├── store/                   # Zustand stores
│   │   ├── hooks/                   # Custom hooks
│   │   ├── types/                   # TypeScript types
│   │   ├── utils/                   # Utilities
│   │   └── App.tsx                  # Root component
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── docker-compose.yml
├── Dockerfile
├── backend.Dockerfile
├── frontend.Dockerfile
├── Caddyfile
├── run.sh
├── .env.example
└── README.md
```

---

## 🤝 Contributing

### **Workflow**

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit with conventional commits: `git commit -m "feat(scope): description"`
4. Push branch: `git push origin feature/your-feature`
5. Submit Pull Request

### **Commit Convention**

```
<type>(<scope>): <subject>

<body>
```

**Types**: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

**Examples:**
```
feat(auth): implement JWT refresh token rotation
fix(purchase-order): resolve stock data corruption
refactor(frontend): centralize API error handling
```

### **Recent Improvements**
- ✨ Centralized API error handling
- 🔒 Comprehensive endpoint authorization
- 📝 Swagger auto-documentation for 401/403
- 🐛 Fixed stock data corruption
- 🎨 Optimized UI layout & z-indexing

---


## 👨‍💻 Author

**Mohamed Almansoury** (@mnsoory)
- GitHub: [github.com/mnsoory](https://github.com/mnsoory)
- Email: mohamed.almansoury8@gmail.com

---


## ❓ Troubleshooting

### **Port Already in Use**
```bash
lsof -ti:7860 | xargs kill -9
```

### **Database Connection Failed**
```bash
docker-compose ps
docker-compose logs db
```

### **Frontend Build Issues**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

---

<div align="center">

**Made with ❤️ by Mohamed Almansoury**

⭐ Star this repo if you find it useful!

</div>
