# 📦 Vantage Logistics Courier Service

A premium, high-performance courier tracking system built with the "Mister Architecture". This system features a dynamic Admin Command Center for logistics management and a visual user tracking journey with real-time updates.

## 🚀 Vision
Built for serious logistics operations, "Mister Consignment" balances a weighted, professional aesthetic (White/Purple) with architectural purity. The system is designed to be unguessable, secure, and visually stunning.

## 🛠️ Tech Stack
- **Backend**: FastAPI (Python 3.10+)
- **Database**: SQLite (SQLAlchemy ORM)
- **Frontend**: React 19 + Vite + Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **PDF Docs**: ReportLab

## 📁 Project Structure
```text
Vantage_Logistics/
├── api/             # FastAPI Routers (Shipment endpoints)
├── core/            # Business Logic (ID generation, masking)
├── data/            # Persistence Layer (Repository, Models, DB)
├── models/          # SQLAlchemy Base Models
├── schemas/         # Pydantic Validation Schemas
├── services/        # Third-party integrations (PDF Invoice Gen)
├── frontend/        # React Application
├── scripts/         # Architecture & Git Sync Utilities
└── docs/            # Tracking & Project Documentation
```

## 🔋 Database Schema (SQLite)
The system uses a relational database (`consignment.db`) with three primary entities:
1. **Shipments**: Stores sender/receiver details, weight, dimensions, and current status.
2. **ShipmentHistory**: An atomic log of every status change, including location and remarks.
3. **CustomStatus**: (Extensible) Allows for custom-defined hub states.

## ⚙️ Quick Setup

### 1. Requirements
- Python 3.10+
- Node.js & npm

### 2. Automatic Setup (Windows)
We provide one-click automation scripts:
- **`setup.bat`**: Creates a virtual environment, installs all dependencies (`requirements.txt` and `npm install`), and initializes the database.
- **`start_backend.bat`**: Direct launch of the Uvicorn server.
- **`start_frontend.bat`**: Launches the Vite development server with network exposure.

### 3. Manual Startup
**Backend**:
```powershell
uvicorn main:app --reload --host 0.0.0.0
```
**Frontend**:
```powershell
cd frontend
npm run dev -- --host
```

## 🎨 Design Philosophy
- **Primary Color**: #FFFFFF (Purity & Clarity)
- **Assistant Color**: #7C3AED (Premium Purple for Action & Brand)
- **Navbar**: Floating "Senior Dev" minimalist bar.
- **Cards**: High-blur glassmorphism with dynamic purple shadows.

---
Built with 💜 by Antigravity for Kaycris.
