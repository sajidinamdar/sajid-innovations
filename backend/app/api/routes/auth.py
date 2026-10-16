from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.app.schemas.auth import LoginRequest, TokenResponse, AdminMeResponse
from backend.app.core.config import settings
from backend.app.core.security import create_access_token, decode_access_token

router = APIRouter()
security = HTTPBearer()

def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token"
        )
    return payload["sub"]

@router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: LoginRequest):
    if credentials.username != settings.ADMIN_USERNAME or credentials.password != settings.ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administrator credentials"
        )

    token = create_access_token(subject=credentials.username)
    return TokenResponse(
        token=token,
        user={"username": credentials.username, "role": "admin"}
    )

@router.get("/auth/me", response_model=AdminMeResponse)
async def get_me(username: str = Depends(get_current_admin)):
    return AdminMeResponse(id="admin-01", username=username, role="admin")

@router.post("/auth/logout")
async def logout():
    return {"success": True, "message": "Logged out successfully"}
