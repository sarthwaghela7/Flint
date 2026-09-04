import email
from email.message import Message
from email.header import decode_header, make_header
from email.utils import parsedate_to_datetime
from typing import Optional


def decode_mime_str(value: Optional[str]) -> str:
    if not value:
        return ""
    return str(make_header(decode_header(value)))


def parse_message(raw: bytes) -> dict:
    msg: Message = email.message_from_bytes(raw)

    body_text, body_html, attachments = "", "", []

    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            disposition = str(part.get("Content-Disposition") or "")

            if "attachment" in disposition or part.get_filename():
                filename = decode_mime_str(part.get_filename()) or "attachment"
                attachments.append(
                    {
                        "filename": filename,
                        "content_type": content_type,
                        "size": len(part.get_payload(decode=True) or b""),
                        "payload": part.get_payload(decode=True),
                    }
                )
            elif content_type == "text/plain" and not body_text:
                body_text = _decode_part(part)
            elif content_type == "text/html" and not body_html:
                body_html = _decode_part(part)
    else:
        if msg.get_content_type() == "text/html":
            body_html = _decode_part(msg)
        else:
            body_text = _decode_part(msg)

    date = None
    if msg.get("Date"):
        try:
            date = parsedate_to_datetime(msg.get("Date"))
        except (TypeError, ValueError):
            date = None

    return {
        "message_id": msg.get("Message-Id", "").strip("<>"),
        "from": decode_mime_str(msg.get("From")),
        "to": decode_mime_str(msg.get("To")),
        "cc": decode_mime_str(msg.get("Cc")),
        "subject": decode_mime_str(msg.get("Subject")),
        "date": date.isoformat() if date else None,
        "body_text": body_text,
        "body_html": body_html,
        "attachments": attachments,
    }


def _decode_part(part: Message) -> str:
    payload = part.get_payload(decode=True) or b""
    charset = part.get_content_charset() or "utf-8"
    try:
        return payload.decode(charset, errors="replace")
    except LookupError:
        return payload.decode("utf-8", errors="replace")


def make_preview(body_text: str, body_html: str, length: int = 140) -> str:
    text = body_text
    if not text and body_html:
        import re

        text = re.sub(r"<[^>]+>", " ", body_html)
    text = " ".join(text.split())
    return text[:length]
