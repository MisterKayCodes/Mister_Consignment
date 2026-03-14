from fastapi import FastAPI, Depends, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from data.repository import init_db, get_db, ShipmentRepository
from api.shipments import router as shipment_router
from api.support import router as support_router
from api.auth import router as auth_router
from api.admins import router as admins_router
from config import settings

app = FastAPI(title=settings.PROJECT_NAME)

# Initialize Database
init_db()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(admins_router, prefix="/api/admins", tags=["Admins"])
app.include_router(shipment_router, prefix="/api/shipments", tags=["Shipments"])
app.include_router(support_router, prefix="/api/support", tags=["Support"])

@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
