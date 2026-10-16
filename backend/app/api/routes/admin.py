from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from backend.app.db.session import get_db
from backend.app.models.inquiry import ProjectInquiry
from backend.app.schemas.inquiry import (
    InquiryResponse,
    InquiryUpdate,
    InquiryPagination,
    AdminStatsResponse
)
from backend.app.api.routes.auth import get_current_admin

router = APIRouter(prefix="/admin", dependencies=[Depends(get_current_admin)])

@router.get("/stats", response_model=AdminStatsResponse)
async def get_stats(db: AsyncSession = Depends(get_db)):
    total = await db.scalar(select(func.count(ProjectInquiry.id))) or 0
    new_c = await db.scalar(select(func.count(ProjectInquiry.id)).where(ProjectInquiry.status == "new")) or 0
    contacted_c = await db.scalar(
        select(func.count(ProjectInquiry.id)).where(
            ProjectInquiry.status.in_(["contacted", "discussion_scheduled"])
        )
    ) or 0
    in_prog = await db.scalar(
        select(func.count(ProjectInquiry.id)).where(
            ProjectInquiry.status.in_(["in_progress", "proposal_sent"])
        )
    ) or 0
    completed = await db.scalar(
        select(func.count(ProjectInquiry.id)).where(ProjectInquiry.status == "completed")
    ) or 0

    return AdminStatsResponse(
        total=total,
        newCount=new_c,
        contactedCount=contacted_c,
        inProgressCount=in_prog,
        completedCount=completed
    )

@router.get("/ideas", response_model=InquiryPagination)
async def list_ideas(
    search: Optional[str] = None,
    status: Optional[str] = None,
    category: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(15, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(ProjectInquiry)

    if status and status != "all":
        stmt = stmt.where(ProjectInquiry.status == status)

    if category and category != "all":
        stmt = stmt.where(ProjectInquiry.service_category == category)

    if search and search.strip():
        term = f"%{search.strip().lower()}%"
        stmt = stmt.where(
            or_(
                func.lower(ProjectInquiry.name).like(term),
                func.lower(ProjectInquiry.email).like(term),
                func.lower(ProjectInquiry.title).like(term),
                func.lower(ProjectInquiry.ref_id).like(term),
                func.lower(ProjectInquiry.company).like(term)
            )
        )

    # Total count
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = await db.scalar(count_stmt) or 0

    # Paginate and order by created_at desc
    stmt = stmt.order_by(ProjectInquiry.created_at.desc()).offset((page - 1) * limit).limit(limit)
    res = await db.execute(stmt)
    items = res.scalars().all()

    totalPages = (total + limit - 1) // limit if total > 0 else 1

    return InquiryPagination(
        items=[InquiryResponse.model_validate(item) for item in items],
        total=total,
        page=page,
        totalPages=totalPages
    )

@router.get("/ideas/{idea_id}", response_model=InquiryResponse)
async def get_idea(idea_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(ProjectInquiry).where(
        or_(ProjectInquiry.id == idea_id, ProjectInquiry.ref_id == idea_id)
    )
    inquiry = await db.scalar(stmt)
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return InquiryResponse.model_validate(inquiry)

@router.patch("/ideas/{idea_id}", response_model=InquiryResponse)
async def update_idea(
    idea_id: str,
    payload: InquiryUpdate,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(ProjectInquiry).where(
        or_(ProjectInquiry.id == idea_id, ProjectInquiry.ref_id == idea_id)
    )
    inquiry = await db.scalar(stmt)
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")

    if payload.status is not None:
        inquiry.status = payload.status
    if payload.internal_notes is not None:
        inquiry.internal_notes = payload.internal_notes
    if payload.follow_up_date is not None:
        inquiry.follow_up_date = payload.follow_up_date

    await db.commit()
    await db.refresh(inquiry)
    return InquiryResponse.model_validate(inquiry)

@router.delete("/ideas/{idea_id}")
async def delete_idea(idea_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(ProjectInquiry).where(
        or_(ProjectInquiry.id == idea_id, ProjectInquiry.ref_id == idea_id)
    )
    inquiry = await db.scalar(stmt)
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")

    await db.delete(inquiry)
    await db.commit()
    return {"success": True, "message": "Inquiry permanently deleted"}
