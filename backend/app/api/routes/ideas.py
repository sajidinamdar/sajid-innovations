import random
import string
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.db.session import get_db
from backend.app.models.inquiry import ProjectInquiry
from backend.app.schemas.inquiry import InquiryCreate, InquirySubmitSuccess
from backend.app.core.config import settings

router = APIRouter()

def send_email_alert(inquiry_data: dict):
    if not settings.EMAIL_ENABLED or not settings.SMTP_PASSWORD:
        return
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"🚀 New Project Inquiry: \"{inquiry_data['title']}\" from {inquiry_data['name']} ({inquiry_data['ref_id']})"
        msg["From"] = f"sajidtech Alerts <{settings.SMTP_USERNAME}>"
        msg["To"] = settings.ADMIN_NOTIFICATION_EMAIL

        html_body = f"""
        <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0f17; color: #f1f5f9; padding: 24px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #111827; border: 1px solid #1e293b; border-radius: 16px; padding: 24px;">
            <h2 style="color: #38bdf8; margin-top: 0;">🚀 New Customer Project Inquiry</h2>
            <p><strong>Reference ID:</strong> {inquiry_data['ref_id']}</p>
            <p><strong>Client Name:</strong> {inquiry_data['name']}</p>
            <p><strong>Email Address:</strong> <a href="mailto:{inquiry_data['email']}" style="color: #60a5fa;">{inquiry_data['email']}</a></p>
            <p><strong>Phone / WhatsApp:</strong> {inquiry_data.get('phone') or 'Not provided'}</p>
            <p><strong>Company:</strong> {inquiry_data.get('company') or 'Not provided'}</p>
            <p><strong>Service:</strong> {inquiry_data['service_category']}</p>
            <p><strong>Estimated Budget:</strong> {inquiry_data.get('budget_range') or 'Not decided yet'}</p>
            <p><strong>Timeline:</strong> {inquiry_data.get('timeline') or 'Flexible'}</p>
            <p><strong>Preferred Contact:</strong> {inquiry_data['preferred_contact']}</p>
            <div style="margin-top: 16px; padding: 14px; background: #0b0f17; border-radius: 8px; border: 1px solid #1e293b;">
              <strong style="color: #94a3b8; font-size: 12px; text-transform: uppercase;">Problem Description:</strong>
              <p style="margin: 8px 0 0; line-height: 1.6;">{inquiry_data['problem_description']}</p>
            </div>
          </div>
        </body>
        </html>
        """
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USERNAME, settings.ADMIN_NOTIFICATION_EMAIL, msg.as_string())
    except Exception as e:
        print(f"[FastAPI Email Error]: {e}")

def generate_ref_id() -> str:
    chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"
    random_part = "".join(random.choice(chars) for _ in range(6))
    return f"SI-2026-{random_part}"

@router.post("/ideas", response_model=InquirySubmitSuccess, status_code=status.HTTP_201_CREATED)
async def submit_idea(
    payload: InquiryCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    # 1. Anti-spam honeypot detection
    if payload.honeypot and payload.honeypot.strip():
        return InquirySubmitSuccess(
            success=True,
            ref_id="SI-2026-FILTERED",
            message="Your idea inquiry has been recorded."
        )
    
    # 2. Consent verification
    if not payload.consent:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Consent to be contacted is required."
        )

    # 3. Create database record
    ref_id = generate_ref_id()
    new_inquiry = ProjectInquiry(
        ref_id=ref_id,
        name=payload.name.strip(),
        email=payload.email.strip().lower(),
        phone=payload.phone.strip() if payload.phone else None,
        company=payload.company.strip() if payload.company else None,
        title=payload.title.strip(),
        service_category=payload.service_category.strip(),
        problem_description=payload.problem_description.strip(),
        target_users=payload.target_users.strip() if payload.target_users else None,
        desired_solution=payload.desired_solution.strip() if payload.desired_solution else None,
        requested_features=payload.requested_features.strip() if payload.requested_features else None,
        existing_url=payload.existing_url.strip() if payload.existing_url else None,
        budget_range=payload.budget_range or "Not decided yet",
        timeline=payload.timeline or "Flexible",
        preferred_contact=payload.preferred_contact,
        additional_details=payload.additional_details.strip() if payload.additional_details else None,
        consent=payload.consent,
        status="new"
    )

    db.add(new_inquiry)
    await db.commit()
    await db.refresh(new_inquiry)

    # 4. Trigger direct email notification to Sajid in background
    inquiry_data = {
        "ref_id": new_inquiry.ref_id,
        "name": new_inquiry.name,
        "email": new_inquiry.email,
        "phone": new_inquiry.phone,
        "company": new_inquiry.company,
        "title": new_inquiry.title,
        "service_category": new_inquiry.service_category,
        "problem_description": new_inquiry.problem_description,
        "budget_range": new_inquiry.budget_range,
        "timeline": new_inquiry.timeline,
        "preferred_contact": new_inquiry.preferred_contact
    }
    background_tasks.add_task(send_email_alert, inquiry_data)

    return InquirySubmitSuccess(
        success=True,
        ref_id=new_inquiry.ref_id,
        message="Thank you for sharing your idea. Your submission has been received. I'll review the details and contact you via your selected channel to discuss next steps."
    )
