import aiosmtplib
from email.message import EmailMessage
from backend.config import get_settings

settings = get_settings()


async def send_email(
    from_addr: str,
    to_addr: str,
    subject: str,
    body: str,
    cc: str | None = None,
    in_reply_to: str | None = None,
) -> None:
    if from_addr not in settings.from_addresses:
        raise ValueError(f"'{from_addr}' is not an allowed From address")

    message = EmailMessage()
    message["From"] = from_addr
    message["To"] = to_addr
    message["Subject"] = subject
    if cc:
        message["Cc"] = cc
    if in_reply_to:
        message["In-Reply-To"] = in_reply_to
        message["References"] = in_reply_to
    message.set_content(body)

    await aiosmtplib.send(
        message,
        hostname=settings.smtp_host,
        port=settings.smtp_port,
        username=settings.mail_username,
        password=settings.mail_password,
        use_tls=True,
    )
