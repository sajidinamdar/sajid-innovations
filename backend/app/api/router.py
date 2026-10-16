from fastapi import APIRouter
from backend.app.api.routes import health, ideas, auth, admin

api_router = APIRouter(prefix="/api")

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(ideas.router, tags=["Ideas"])
api_router.include_router(auth.router, tags=["Authentication"])
api_router.include_router(admin.router, tags=["Admin"])
