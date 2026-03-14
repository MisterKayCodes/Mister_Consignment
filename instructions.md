# 📜 Vantage Logistics: Build Instructions

Detailed steps to build the Vantage Logistics Courier System from scratch.

## 1. Backend Architecture (FastAPI)

### 📁 Structure
- `api/`: Routers and endpoints.
- `core/`: Business logic (ID generation, masking).
- `data/`: Database repository and Session management.
- `models/`: SQLAlchemy base models.
- `schemas/`: Pydantic validation models.
- `services/`: External integrations (PDF generation).

### 🛠️ Key Steps
1. **Initialize Environment**: Create `.env` and `config.py` with Pydantic Settings.
2. **Define Models**: `Shipment`, `ShipmentHistory`, and `CustomStatus` models in `models/base.py`.
3. **Repository Pattern**: Implement `ShipmentRepository` in `data/repository.py` for all DB operations.
4. **Separation of Concerns**: Ensure API routers never import SQLAlchemy directly; use the repository.
5. **PDF Generation**: Use `reportlab` in `services/documents.py` to create dynamic invoices.

---

## 2. Frontend Architecture (React + Vite)

### 📁 Structure
- `src/api/`: Axios instances and services.
- `src/components/ui/`: Reusable primitive components.
- `src/hooks/`: Business logic and state management.
- `src/pages/`: Feature-grouped views.
- `src/styles/`: Global CSS and theme configurations.

### Getting Started
1. Start the Backend: `uvicorn main:app --reload --host 0.0.0.0` (accessible at `http://localhost:8000`).
2. Start the Frontend: `cd frontend && npm run dev -- --host` (accessible at `http://localhost:5173`).

### 🛠️ Key Steps
1. **Setup Vite**: `npx create-vite@latest frontend --template react`.
2. **Install Styles**: Setup Tailwind CSS with a custom dark theme and glassmorphism utilities.
3. **Animation**: Install `framer-motion` for professional micro-interactions.
4. **Logic Isolation**: All data fetching and business logic should reside in custom hooks, kept under 150 lines.

---

## 3. Automation & Setup
1. **Initial Setup**: Run `setup.bat`. This creates a `venv` and installs all dependencies from `requirements.txt`.
2. **Start Backend**: Run `start_backend.bat`. This activates the `venv` and starts the Uvicorn server.
3. **Start Frontend**: Run `start_frontend.bat`. This navigates to the `frontend` folder and runs the dev server.

## 4. Architecture Enforcement
1. **Architecture Inspector**: A script that scans imports to prevent architectural "mutants."
2. **Tracking System**: A `docs/tracking.md` file that feeds into an automated git sync utility.
