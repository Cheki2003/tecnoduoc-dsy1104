import { useState } from "react";
import { Link } from "react-router-dom";

import Boton from "../../components/Boton";
import EncabezadoAdmin from "../../components/EncabezadoAdmin";
import baseDatos from "../../data/baseDatos";

function CategoriasAdmin({ onAviso }) {
  const [categorias, setCategorias] = useState(baseDatos.obtenerCategorias());

  function eliminar(categoria) {
    if (!window.confirm(`¿Eliminar la categoría ${categoria.nombre}?`)) return;

    if (baseDatos.eliminarCategoria(categoria.id)) {
      setCategorias(baseDatos.obtenerCategorias());
      onAviso("Categoría eliminada.");
    } else {
      onAviso("No se puede eliminar porque todavía tiene productos.");
    }
  }

  return (
    <>
      <EncabezadoAdmin titulo="Categorías" descripcion="Así se ordenan los productos en la tienda.">
        <Link to="/admin/categorias/nueva" className="btn btn-oscuro"><i className="bi bi-plus-lg me-2"></i>Nueva categoría</Link>
      </EncabezadoAdmin>

      <div className="panel-admin table-responsive">
        <table className="table align-middle tabla-simple mb-0">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th className="text-center">Productos</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td className="fw-bold">{categoria.nombre}</td>
                <td>{categoria.descripcion}</td>
                <td className="text-center">{baseDatos.obtenerProductosPorCategoria(categoria.nombre).length}</td>
                <td className="text-end text-nowrap">
                  <Link to={`/admin/categorias/${categoria.id}/editar`} className="btn btn-sm btn-outline-secondary me-2">Editar</Link>
                  <Boton etiqueta="Eliminar" variante="outline-danger" className="btn-sm" onClick={() => eliminar(categoria)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default CategoriasAdmin;
