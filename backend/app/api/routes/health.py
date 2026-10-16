from datetime import datetime, timezone
from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "sajidtech-fastapi-backend",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
