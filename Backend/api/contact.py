from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from backend.config import get_settings
from backend.email_.smtp_client import send_email

router = APIRouter(tags=["contact"])
settings = get_settings()


class ContactPayload(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: str = Field(min_length=3, max_length=254)
    brief: str = Field(min_length=10, max_length=5000)


@router.post("/contact")
async def contact(payload: ContactPayload):
    """Landing-site contact form — delivered to the team inbox via SMTP."""
    if not settings.from_addresses:
        raise HTTPException(status_code=500, detail="No sender address configured")

    subject = f"Website enquiry — {payload.name}"
    body = (
        f"Name: {payload.name}\n"
        f"Email: {payload.email}\n"
        "\n"
        f"{payload.brief}\n"
    )
    try:
        await send_email(settings.from_addresses[0], settings.contact_recipient, subject, body)
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Could not deliver the enquiry") from exc
    return {"status": "sent"}
