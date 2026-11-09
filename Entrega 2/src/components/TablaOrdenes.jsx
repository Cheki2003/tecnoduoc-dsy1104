import { Link } from "react-router-dom";

import { formatearFecha, formatearPrecio } from "../utils/formato";
import EstadoOrden from "./EstadoOrden";

function TablaOrdenes({ ordenes }) {
  if (ordenes.length === 0) {
    return <p className="estado-vacio-admin">No hay órdenes para mostrar.</p>;
  }

  return (
    <div className="panel-admin table-responsive">
      <table className="table align-middle tabla-simple mb-0">
        <thead>
          <tr>
            <th>N° orden</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th className="text-end">Total</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((orden) => (
            <tr key={orden.id}>
              <td className="fw-bold">#{orden.id}</td>
              <td>{formatearFecha(orden.fecha)}</td>
              <td>{orden.cliente.nombre} {orden.cliente.apellidos}</td>
              <td className="text-end">{formatearPrecio(orden.total)}</td>
              <td><EstadoOrden estado={orden.estado} /></td>
              <td className="text-end">
                <Link className="btn btn-sm btn-outline-secondary" to={`/admin/ordenes/${orden.id}`}>Ver boleta</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaOrdenes;
