"""Esquemas Pydantic: validan los datos que entran y definen los que salen."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

# Categorías válidas de la tienda (equivalentes a bebidas/snacks/... del kiosco).
CATEGORIES = ("disfraces", "decoracion", "accesorios", "maquillaje")
Category = Literal["disfraces", "decoracion", "accesorios", "maquillaje"]


# ---------- Productos ----------

class ProductCreate(BaseModel):
    """Datos para crear un producto. Acá están las validaciones obligatorias."""

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "name": "Disfraz de Fantasma",
                    "category": "disfraces",
                    "price": 35000,
                    "stock": 5,
                    "description": "Túnica blanca con capucha.",
                }
            ]
        }
    )

    name: str = Field(min_length=1, max_length=120)  # no puede estar vacío
    category: Category                               # solo las 4 categorías
    price: float = Field(gt=0)                       # mayor que cero
    stock: int = Field(ge=0)                         # cero o más (no negativo)
    description: str | None = Field(default=None, max_length=500)  # opcional
    image: str | None = Field(default=None, max_length=200)        # opcional

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, value: str) -> str:
        """Rechaza nombres formados solo por espacios."""
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("El nombre no puede estar vacío.")
        return cleaned


class ProductOut(BaseModel):
    """Forma en que la API devuelve un producto."""

    # Permite construir este esquema directamente desde un modelo de SQLAlchemy.
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    category: str
    price: float
    stock: int
    description: str | None
    image: str | None


# ---------- Pedidos ----------

class OrderItemCreate(BaseModel):
    """Un renglón del pedido: qué producto y cuántas unidades."""

    product_id: int = Field(gt=0)  # id válido (mayor que cero)
    quantity: int = Field(gt=0)    # al menos 1 unidad


class OrderCreate(BaseModel):
    """Cuerpo de POST /api/orders. El frontend solo manda ids y cantidades."""

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "items": [
                        {"product_id": 1, "quantity": 2},
                        {"product_id": 10, "quantity": 1},
                    ]
                }
            ]
        }
    )

    items: list[OrderItemCreate] = Field(min_length=1)  # no se acepta vacío


class OrderItemOut(BaseModel):
    """Renglón del pedido ya calculado por el backend."""

    product_id: int
    name: str
    unit_price: float
    quantity: int
    subtotal: float


class OrderOut(BaseModel):
    """Forma en que la API devuelve un pedido registrado."""

    id: int
    created_at: datetime
    total: float
    items: list[OrderItemOut]