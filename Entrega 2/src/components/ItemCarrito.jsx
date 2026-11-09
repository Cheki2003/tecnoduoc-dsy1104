import { formatearPrecio } from "../utils/formato";
import Imagen from "./Imagen";

function ItemCarrito({ item, onCambiarCantidad, onQuitar }) {
  return (
    <div className="item-carrito">
      <Imagen src={item.imagen} alt={item.nombre} className="item-foto" />

      <div className="item-info">
        <p className="tarjeta-categoria mb-1">{item.categoria}</p>
        <p className="item-nombre">{item.nombre}</p>
        <p className="item-precio">{formatearPrecio(item.precio)} c/u</p>
      </div>

      <div className="selector-cantidad" role="group" aria-label={`Cantidad de ${item.nombre}`}>
        <button type="button" aria-label="Quitar una unidad" onClick={() => onCambiarCantidad(item.id, -1)}>
          <i className="bi bi-dash"></i>
        </button>
        <span>{item.cantidad}</span>
        <button
          type="button"
          aria-label="Agregar una unidad"
          disabled={item.cantidad >= item.stock}
          onClick={() => onCambiarCantidad(item.id, 1)}
        >
          <i className="bi bi-plus"></i>
        </button>
      </div>

      <p className="item-subtotal">{formatearPrecio(item.precio * item.cantidad)}</p>

      <button type="button" className="item-quitar" aria-label={`Eliminar ${item.nombre}`} onClick={() => onQuitar(item.id)}>
        <i className="bi bi-trash3"></i>
      </button>
    </div>
  );
}

export default ItemCarrito;
