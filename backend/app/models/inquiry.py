import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from backend.app.db.session import Base

class ProjectInquiry(Base):
    __tablename__ = "project_inquiries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ref_id: Mapped[str] = mapped_column(String(32), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    email: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(32), nullable=True)
    company: Mapped[str] = mapped_column(String(128), nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    service_category: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    problem_description: Mapped[str] = mapped_column(Text, nullable=False)
    target_users: Mapped[str] = mapped_column(String(255), nullable=True)
    desired_solution: Mapped[str] = mapped_column(Text, nullable=True)
    requested_features: Mapped[str] = mapped_column(Text, nullable=True)
    existing_url: Mapped[str] = mapped_column(String(512), nullable=True)
    budget_range: Mapped[str] = mapped_column(String(64), nullable=True, default="Not decided yet")
    timeline: Mapped[str] = mapped_column(String(64), nullable=True, default="Flexible")
    preferred_contact: Mapped[str] = mapped_column(String(32), nullable=False, default="email")
    additional_details: Mapped[str] = mapped_column(Text, nullable=True)
    consent: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    
    # Administrative & Triage Fields (Protected)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="new", index=True)
    internal_notes: Mapped[str] = mapped_column(Text, nullable=True)
    follow_up_date: Mapped[str] = mapped_column(String(32), nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc),
        index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

class AdminUser(Base):
    __tablename__ = "admin_users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
