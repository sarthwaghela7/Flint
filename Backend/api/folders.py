from fastapi import APIRouter
from backend.config import get_settings

router = APIRouter(tags=["folders"])
settings = get_settings()


@router.get("/folders")
def list_folders():
    return {
        "folders": ["inbox", "sent", "drafts", "starred"],
        "from_addresses": settings.from_addresses,
    }
