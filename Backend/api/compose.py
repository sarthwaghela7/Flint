from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from backend.email_.smtp_client import send_email
from backend.config import get_settings

router = APIRouter(tags=["compose"])
settings = get_settings()


class SendPayload(BaseModel):
    from_: str = Field(alias="from")
    to: str
    subject: str
    body: str
    cc: str | None = None

    model_config = {"populate_by_name": True}


class ReplyPayload(SendPayload):
    in_reply_to: str | None = None


@router.post("/emails/send")
async def send(payload: SendPayload):
    await _guarded_send(payload.from_, payload.to, payload.subject, payload.body, payload.cc)
    return {"status": "sent"}


@router.post("/emails/reply")
async def reply(payload: ReplyPayload):
    await _guarded_send(payload.from_, payload.to, payload.subject, payload.body, payload.cc, payload.in_reply_to)
    return {"status": "sent"}


@router.post("/emails/forward")
async def forward(payload: SendPayload):
    await _guarded_send(payload.from_, payload.to, payload.subject, payload.body, payload.cc)
    return {"status": "sent"}


async def _guarded_send(from_addr, to_addr, subject, body, cc=None, in_reply_to=None):
    if from_addr not in settings.from_addresses:
        raise HTTPException(status_code=400, detail=f"'{from_addr}' is not an allowed From address")
    await send_email(from_addr, to_addr, subject, body, cc=cc, in_reply_to=in_reply_to)
