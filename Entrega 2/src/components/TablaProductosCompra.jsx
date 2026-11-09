import { formatearPrecio } from "../utils/formato";
import Imagen from "./Imagen";

// tabla con los productos de una compra, se usa en el checkout y en la boleta
function TablaProductosCompra({ items, compacta = false }) {
  return (
    <div className="table-responsive">
      <table className="table align-middle tabla-simple">
        <thead>
          <tr>
            <th>Producto</th>
            {!compacta && <th className="text-end">Precio</th>}
            <th className="text-center">{compacta ? "Cant." : "Cantidad"}</th>
            <th className="text-end">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <Imagen src={item.imagen} alt="" className="foto-tabla" />
                  <span>{item.nombre}</span>
                </div>
              </td>
              {!compacta && <td className="text-end">{formatearPrecio(item.precio)}</td>}
              <td className="text-center">{item.cantidad}</td>
              <td className="text-end fw-bold">{formatearPrecio(item.precio * item.cantidad)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaProductosCompra;
