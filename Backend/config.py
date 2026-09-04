from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    imap_host: str = "imap.secureserver.net"
    imap_port: int = 993
    smtp_host: str = "smtpout.secureserver.net"
    smtp_port: int = 465

    mail_username: str
    mail_password: str
    mail_from_addresses: str = "core@teamflint.in"

    database_url: str = "postgresql+psycopg2://flint:flint@localhost:5432/flint_mail"

    # Comma-separated list of allowed web origins (Nest app, landing site, ...)
    frontend_origins: str = "http://localhost:5173,http://localhost:5174"
    session_secret: str = "change-me"
    # Inbox that receives the landing-site contact form enquiries
    contact_recipient: str = "teamflint.info@gmail.com"

    class Config:
        env_file = ".env"

    @property
    def from_addresses(self) -> list[str]:
        return [a.strip() for a in self.mail_from_addresses.split(",") if a.strip()]

    @property
    def allowed_origins(self) -> list[str]:
        return [o.strip() for o in self.frontend_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
