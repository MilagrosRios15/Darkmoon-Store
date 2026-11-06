"""Endpoints de pedidos: /api/orders."""

import json

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, update
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from database import get_db
from models import Order, Product
from schemas import OrderCreate, OrderOut

router = APIRouter(prefix="/api/orders", tags=["Pedidos"])


def order_to_out(order: Order) -> OrderOut:
    """Convierte un pedido de la base (con items_json) al esquema de salida."""
    return OrderOut(
        id=order.id,
        created_at=order.created_at,
        total=order.total,
        items=json.loads(order.items_json),
    )


@router.post(
    "",
    response_model=OrderOut,
    status_code=status.HTTP_201_CREATED,
    summary="Crear un pedido",
)
def create_order(order_in: OrderCreate, db: Session = Depends(get_db)):
    """Valida el pedido, verifica stock, calcula el total, descuenta y registra.

    Todo ocurre en una sola transacción: si algo falla, no se guarda nada.
    """
    # 1. Si el mismo producto viene repetido, se suman sus cantidades.
    quantities: dict[int, int] = {}
    for item in order_in.items:
        quantities[item.product_id] = quantities.get(item.product_id, 0) + item.quantity

    try:
        # 2. Buscar en la base los productos pedidos.
        products = db.scalars(
            select(Product).where(Product.id.in_(list(quantities)))
        ).all()
        by_id = {product.id: product for product in products}

        missing = [str(pid) for pid in quantities if pid not in by_id]
        if missing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No existe ningún producto con id: {', '.join(missing)}.",
            )

        # 3. Verificar el stock de TODOS antes de tocar nada.
        problems = [
            f"{by_id[pid].name} (pediste {qty}, quedan {by_id[pid].stock})"
            for pid, qty in quantities.items()
            if qty > by_id[pid].stock
        ]
        if problems:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="No hay stock suficiente de: " + "; ".join(problems) + ".",
            )

        # 4. Calcular el total con los precios ACTUALES de la base de datos
        #    (no se confía en precios enviados por el frontend).
        items_detail = []
        total = 0.0
        for pid, qty in quantities.items():
            product = by_id[pid]
            subtotal = product.price * qty
            total += subtotal
            items_detail.append(
                {
                    "product_id": pid,
                    "name": product.name,
                    "unit_price": product.price,
                    "quantity": qty,
                    "subtotal": subtotal,
                }
            )

        # 5. Descontar el stock. El UPDATE solo se aplica si todavía hay stock
        #    suficiente, así dos pedidos simultáneos no lo dejan negativo.
        for pid, qty in quantities.items():
            result = db.execute(
                update(Product)
                .where(Product.id == pid, Product.stock >= qty)
                .values(stock=Product.stock - qty)
            )
            if result.rowcount != 1:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"El stock de {by_id[pid].name} cambió mientras se "
                    "procesaba el pedido. Revisá las cantidades e intentá de nuevo.",
                )

        # 6. Registrar el pedido y confirmar la transacción.
        order = Order(
            total=round(total, 2),
            items_json=json.dumps(items_detail, ensure_ascii=False),
        )
        db.add(order)
        db.commit()
        db.refresh(order)

    except HTTPException:
        # Cualquier error deshace TODO: ni pedido parcial ni stock descontado.
        db.rollback()
        raise
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudo registrar el pedido. Intentá de nuevo.",
        ) from exc

    return order_to_out(order)


@router.get("", response_model=list[OrderOut], summary="Listar pedidos")
def list_orders(db: Session = Depends(get_db)):
    """Devuelve los pedidos registrados, del más nuevo al más viejo."""
    orders = db.scalars(select(Order).order_by(Order.id.desc())).all()
    return [order_to_out(order) for order in orders]