from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

class InquiryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=128)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=32)
    company: Optional[str] = Field(None, max_length=128)
    title: str = Field(..., min_length=3, max_length=255)
    service_category: str = Field(..., min_length=2, max_length=128)
    problem_description: str = Field(..., min_length=10)
    target_users: Optional[str] = Field(None, max_length=255)
    desired_solution: Optional[str] = None
    requested_features: Optional[str] = None
    existing_url: Optional[str] = Field(None, max_length=512)
    budget_range: Optional[str] = Field("Not decided yet", max_length=64)
    timeline: Optional[str] = Field("Flexible", max_length=64)
    preferred_contact: str = Field("email", max_length=32)
    additional_details: Optional[str] = None
    consent: bool = Field(...)
    honeypot: Optional[str] = None

class InquiryUpdate(BaseModel):
    status: Optional[str] = None
    internal_notes: Optional[str] = None
    follow_up_date: Optional[str] = None

class InquiryResponse(BaseModel):
    id: str
    ref_id: str
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    title: str
    service_category: str
    problem_description: str
    target_users: Optional[str] = None
    desired_solution: Optional[str] = None
    requested_features: Optional[str] = None
    existing_url: Optional[str] = None
    budget_range: Optional[str] = None
    timeline: Optional[str] = None
    preferred_contact: str
    additional_details: Optional[str] = None
    status: str
    internal_notes: Optional[str] = None
    follow_up_date: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class InquirySubmitSuccess(BaseModel):
    success: bool
    ref_id: str
    message: str

class InquiryPagination(BaseModel):
    items: List[InquiryResponse]
    total: int
    page: int
    totalPages: int

class AdminStatsResponse(BaseModel):
    total: int
    newCount: int
    contactedCount: int
    inProgressCount: int
    completedCount: int
