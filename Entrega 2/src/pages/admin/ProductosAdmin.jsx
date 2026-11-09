import { useState } from "react";
import { Link } from "react-router-dom";

import Boton from "../../components/Boton";
import EncabezadoAdmin from "../../components/EncabezadoAdmin";
import Imagen from "../../components/Imagen";
import baseDatos from "../../data/baseDatos";
import { filtrarProductos } from "../../utils/filtros";
import { formatearPrecio } from "../../utils/formato";

function ProductosAdmin({ onAviso }) {
  // la lista queda en el estado para que la tabla se actualice al eliminar
  const [productos, setProductos] = useState(baseDatos.obtenerProductos());
  const [texto, setTexto] = useState("");

  function eliminar(producto) {
    if (!window.confirm(`¿Eliminar ${producto.nombre}?`)) return;
    baseDatos.eliminarProducto(producto.id);
    setProductos(baseDatos.obtenerProductos());
    onAviso("Producto eliminado.");
  }

  const visibles = filtrarProductos(productos, { texto });

  return (
    <>
      <EncabezadoAdmin titulo="Productos" descripcion={`${productos.length} productos en el catálogo.`}>
        <Link to="/admin/productos/criticos" className="btn btn-outline-secondary">Stock crítico</Link>
        <Link to="/admin/productos/reportes" className="btn btn-outline-secondary">Reportes</Link>
        <Link to="/admin/productos/nuevo" className="btn btn-oscuro"><i className="bi bi-plus-lg me-2"></i>Nuevo producto</Link>
      </EncabezadoAdmin>

      <label htmlFor="buscar-producto" className="visually-hidden">Buscar producto</label>
      <input
        id="buscar-producto"
        type="search"
        className="form-control mb-3"
        placeholder="Buscar producto"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />

      <div className="panel-admin table-responsive">
        <table className="table align-middle tabla-simple mb-0">
          <thead>
            <tr>
              <th>Producto</th>
              <th className="d-none d-md-table-cell">Categoría</th>
              <th className="text-end">Precio</th>
              <th className="text-center d-none d-md-table-cell">Oferta</th>
              <th className="text-center">Stock</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((producto) => (
              <tr key={producto.id}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <Imagen src={producto.imagen} alt="" className="foto-tabla" />
                    <span>{producto.nombre}</span>
                  </div>
                </td>
                <td className="d-none d-md-table-cell">{producto.categoria}</td>
                <td className="text-end">{formatearPrecio(producto.precio)}</td>
                <td className="text-center d-none d-md-table-cell">{producto.descuento > 0 ? `${producto.descuento}%` : "-"}</td>
                <td className="text-center">
                  <span className={`badge ${producto.stock <= 5 ? "text-bg-danger" : "text-bg-light"}`}>{producto.stock}</span>
                </td>
                <td className="text-end text-nowrap">
                  <Link to={`/admin/productos/${producto.id}/editar`} className="btn btn-sm btn-outline-secondary me-2">Editar</Link>
                  <Boton etiqueta="Eliminar" variante="outline-danger" className="btn-sm" onClick={() => eliminar(producto)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ProductosAdmin;
