from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    token: str
    token_type: str = "bearer"
    user: dict

class AdminMeResponse(BaseModel):
    id: str
    username: str
    role: str = "admin"
