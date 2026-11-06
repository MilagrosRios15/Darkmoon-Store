"""Punto de entrada de la API de DarkMoon Store."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import models  # noqa: F401  (registra las tablas antes de crearlas)
from database import Base, SessionLocal, engine
from routers import orders, products
from seed import seed_products


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Se ejecuta al iniciar el servidor: crea las tablas y carga los datos."""
    Base.metadata.create_all(bind=engine)  # crea las tablas si no existen
    with SessionLocal() as db:
        seed_products(db)                  # carga los productos si está vacía
    yield


app = FastAPI(
    title="DarkMoon Store API",
    description="API de la tienda de Halloween DarkMoon Store (proyecto académico).",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS: solo se permite el frontend de Vite en desarrollo (puerto 5173).
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """Errores de Pydantic con un mensaje general en español y el detalle."""
    errors = [
        {
            "campo": " > ".join(str(part) for part in error["loc"] if part != "body"),
            "mensaje": error["msg"],
        }
        for error in exc.errors()
    ]
    return JSONResponse(
        status_code=422,
        content={"detail": "Los datos enviados no son válidos.", "errors": errors},
    )


app.include_router(products.router)
app.include_router(orders.router)


@app.get("/", tags=["Inicio"], summary="Estado de la API")
def root() -> dict[str, str]:
    """Permite comprobar rápido que la API está funcionando."""
    return {"mensaje": "API de DarkMoon Store funcionando. Documentación en /docs."}