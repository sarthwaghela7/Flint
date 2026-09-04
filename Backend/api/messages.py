from fastapi import APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.email_.imap_client import fetch_message, set_flag
from backend.db.session import get_db
from backend.db.models import MessageMeta

router = APIRouter(tags=["messages"])


class FlagUpdate(BaseModel):
    read: bool | None = None
    starred: bool | None = None


@router.get("/emails/{message_id}")
def get_email(message_id: str, folder: str = Query("inbox")):
    email = fetch_message(folder, message_id)
    if not email:
        raise HTTPException(status_code=404, detail="Message not found")
    return email


@router.post("/emails/{message_id}/read")
def mark_read(message_id: str, payload: FlagUpdate, folder: str = Query("inbox"), db: Session = Depends(get_db)):
    read = payload.read if payload.read is not None else True
    set_flag(folder, message_id, "\\Seen", read)
    _upsert_meta(db, message_id, folder, read=read)
    return {"id": message_id, "read": read}


@router.post("/emails/{message_id}/star")
def mark_star(message_id: str, payload: FlagUpdate, folder: str = Query("inbox"), db: Session = Depends(get_db)):
    starred = payload.starred if payload.starred is not None else True
    set_flag(folder, message_id, "\\Flagged", starred)
    _upsert_meta(db, message_id, folder, starred=starred)
    return {"id": message_id, "starred": starred}


def _upsert_meta(db: Session, message_id: str, folder: str, **fields) -> None:
    meta = db.query(MessageMeta).filter_by(message_id=message_id).first()
    if not meta:
        meta = MessageMeta(message_id=message_id, folder=folder)
        db.add(meta)
    for key, value in fields.items():
        setattr(meta, key, value)
    db.commit()
