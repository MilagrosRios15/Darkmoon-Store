"""Endpoints de productos: /api/products."""

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from models import Product
from schemas import CATEGORIES, ProductCreate, ProductOut

router = APIRouter(prefix="/api/products", tags=["Productos"])


@router.get("", response_model=list[ProductOut], summary="Listar productos")
def list_products(
    category: str | None = Query(
        default=None,
        description="Filtra por categoría: disfraces, decoracion, accesorios o maquillaje.",
    ),
    db: Session = Depends(get_db),
):
    """Devuelve los productos guardados en SQLite, opcionalmente filtrados."""
    query = select(Product).order_by(Product.id)

    if category is not None:
        normalized = category.strip().lower()
        if normalized not in CATEGORIES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"La categoría «{category}» no existe. "
                f"Categorías válidas: {', '.join(CATEGORIES)}.",
            )
        # El filtro se hace en la consulta a la base (en el backend).
        query = query.where(Product.category == normalized)

    return db.scalars(query).all()


@router.get("/{product_id}", response_model=ProductOut, summary="Ver un producto")
def get_product(
    product_id: int = Path(gt=0, description="Id del producto."),
    db: Session = Depends(get_db),
):
    """Devuelve el detalle de un producto o un error 404 si no existe."""
    product = db.get(Product, product_id)
    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No encontramos el producto con id {product_id}.",
        )
    return product


@router.post(
    "",
    response_model=ProductOut,
    status_code=status.HTTP_201_CREATED,
    summary="Crear un producto",
)
def create_product(product_in: ProductCreate, db: Session = Depends(get_db)):
    """Crea un producto. Pydantic valida nombre, categoría, precio y stock."""
    product = Product(**product_in.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product