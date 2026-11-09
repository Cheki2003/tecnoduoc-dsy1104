import { Link } from "react-router-dom";

import EncabezadoAdmin from "../../components/EncabezadoAdmin";
import baseDatos from "../../data/baseDatos";

function ProductosCriticos() {
  const criticos = baseDatos.obtenerProductosCriticos();

  return (
    <>
      <EncabezadoAdmin titulo="Stock crítico" descripcion="Productos con 5 unidades o menos.">
        <Link to="/admin/productos" className="btn btn-outline-secondary">Volver a productos</Link>
      </EncabezadoAdmin>

      {criticos.length === 0 ? (
        <p className="estado-vacio-admin">Todos los productos tienen stock suficiente.</p>
      ) : (
        <div className="panel-admin table-responsive">
          <table className="table align-middle tabla-simple mb-0">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th className="text-center">Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {criticos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.nombre}</td>
                  <td>{producto.categoria}</td>
                  <td className="text-center"><span className="badge text-bg-danger">{producto.stock}</span></td>
                  <td className="text-end">
                    <Link to={`/admin/productos/${producto.id}/editar`} className="btn btn-sm btn-outline-secondary">Reponer</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default ProductosCriticos;
