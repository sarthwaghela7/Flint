import base64
from email.mime.application import MIMEApplication


def build_mime_attachment(filename: str, content: bytes) -> MIMEApplication:
    part = MIMEApplication(content)
    part.add_header("Content-Disposition", "attachment", filename=filename)
    return part


def encode_attachment_for_response(filename: str, content_type: str, payload: bytes) -> dict:
    return {
        "filename": filename,
        "content_type": content_type,
        "data_url": f"data:{content_type};base64,{base64.b64encode(payload).decode()}",
    }
