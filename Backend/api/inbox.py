from fastapi import APIRouter, Query
from backend.email_.imap_client import fetch_messages, search_messages

router = APIRouter(tags=["inbox"])


@router.get("/emails")
def list_emails(folder: str = Query("inbox"), page: int = Query(1, ge=1)):
    emails = fetch_messages(folder=folder, page=page)
    return {"emails": emails, "page": page, "folder": folder}


@router.get("/emails/search")
def search(q: str = Query(..., min_length=1)):
    return {"emails": search_messages(q)}
