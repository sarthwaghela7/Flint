from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import get_settings
from backend.db.session import init_db
from backend.api import inbox, messages, compose, folders, contact

settings = get_settings()

app = FastAPI(title="Flint Mail API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()


app.include_router(inbox.router, prefix="/api")
app.include_router(messages.router, prefix="/api")
app.include_router(compose.router, prefix="/api")
app.include_router(folders.router, prefix="/api")

# Landing-site contact form — reachable at /contact and /api/contact
app.include_router(contact.router)
app.include_router(contact.router, prefix="/api")


@app.get("/api/health")
def health():
    return {"status": "ok"}
