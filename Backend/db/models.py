from sqlalchemy import Column, String, Boolean, DateTime, Integer
from sqlalchemy.orm import declarative_base
from datetime import datetime, timezone

Base = declarative_base()


class MessageMeta(Base):
    """Cache of mailbox metadata. Titan remains the source of truth for content."""

    __tablename__ = "message_meta"

    id = Column(Integer, primary_key=True, autoincrement=True)
    message_id = Column(String, unique=True, nullable=False, index=True)
    folder = Column(String, nullable=False, index=True)
    read = Column(Boolean, default=False, nullable=False)
    starred = Column(Boolean, default=False, nullable=False)
    thread_id = Column(String, nullable=True, index=True)
    last_synced = Column(DateTime, default=lambda: datetime.now(timezone.utc))
