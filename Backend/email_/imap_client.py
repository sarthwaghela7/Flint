from contextlib import contextmanager
from imapclient import IMAPClient
from backend.config import get_settings
from backend.email_.parser import parse_message, make_preview

settings = get_settings()

FOLDER_MAP = {
    "inbox": "INBOX",
    "sent": "Sent",
    "drafts": "Drafts",
    "starred": "INBOX",  # starred is a metadata flag, not a real IMAP folder
}


@contextmanager
def imap_connection():
    client = IMAPClient(settings.imap_host, port=settings.imap_port, ssl=True)
    try:
        client.login(settings.mail_username, settings.mail_password)
        yield client
    finally:
        client.logout()


def list_folders() -> list[str]:
    with imap_connection() as client:
        return [name for _flags, _delim, name in client.list_folders()]


def fetch_messages(folder: str = "inbox", page: int = 1, page_size: int = 25) -> list[dict]:
    imap_folder = FOLDER_MAP.get(folder, "INBOX")
    with imap_connection() as client:
        client.select_folder(imap_folder, readonly=True)
        uids = sorted(client.search(["ALL"]), reverse=True)
        start = (page - 1) * page_size
        page_uids = uids[start : start + page_size]
        if not page_uids:
            return []

        response = client.fetch(page_uids, ["RFC822", "FLAGS"])
        messages = []
        for uid, data in response.items():
            parsed = parse_message(data[b"RFC822"])
            flags = data.get(b"FLAGS", ())
            messages.append(
                {
                    "id": str(uid),
                    "from": parsed["from"],
                    "subject": parsed["subject"],
                    "preview": make_preview(parsed["body_text"], parsed["body_html"]),
                    "date": parsed["date"],
                    "read": b"\\Seen" in flags,
                    "starred": b"\\Flagged" in flags,
                }
            )
        messages.sort(key=lambda m: m["date"] or "", reverse=True)
        return messages


def fetch_message(folder: str, uid: str) -> dict | None:
    imap_folder = FOLDER_MAP.get(folder, "INBOX")
    with imap_connection() as client:
        client.select_folder(imap_folder)
        response = client.fetch([int(uid)], ["RFC822", "FLAGS"])
        if int(uid) not in response:
            return None
        data = response[int(uid)]
        parsed = parse_message(data[b"RFC822"])
        flags = data.get(b"FLAGS", ())
        return {
            "id": uid,
            "from": parsed["from"],
            "to": parsed["to"],
            "cc": parsed["cc"],
            "subject": parsed["subject"],
            "date": parsed["date"],
            "bodyText": parsed["body_text"],
            "bodyHtml": parsed["body_html"],
            "read": b"\\Seen" in flags,
            "starred": b"\\Flagged" in flags,
            "attachments": [
                {"id": str(i), "filename": a["filename"], "content_type": a["content_type"]}
                for i, a in enumerate(parsed["attachments"])
            ],
        }


def set_flag(folder: str, uid: str, flag: str, value: bool) -> None:
    imap_folder = FOLDER_MAP.get(folder, "INBOX")
    with imap_connection() as client:
        client.select_folder(imap_folder)
        if value:
            client.add_flags([int(uid)], [flag])
        else:
            client.remove_flags([int(uid)], [flag])


def search_messages(query: str, page_size: int = 50) -> list[dict]:
    with imap_connection() as client:
        client.select_folder("INBOX", readonly=True)
        uids = client.search(["OR", "OR", ["SUBJECT", query], ["FROM", query], ["BODY", query]])
        uids = sorted(uids, reverse=True)[:page_size]
        if not uids:
            return []
        response = client.fetch(uids, ["RFC822", "FLAGS"])
        results = []
        for uid, data in response.items():
            parsed = parse_message(data[b"RFC822"])
            flags = data.get(b"FLAGS", ())
            results.append(
                {
                    "id": str(uid),
                    "from": parsed["from"],
                    "subject": parsed["subject"],
                    "preview": make_preview(parsed["body_text"], parsed["body_html"]),
                    "date": parsed["date"],
                    "read": b"\\Seen" in flags,
                    "starred": b"\\Flagged" in flags,
                }
            )
        results.sort(key=lambda m: m["date"] or "", reverse=True)
        return results
