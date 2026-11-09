import { useNavigate, useParams } from "react-router-dom";

import EncabezadoAdmin from "../../components/EncabezadoAdmin";
import FormularioProducto from "../../components/FormularioProducto";
import baseDatos from "../../data/baseDatos";

// misma pagina para crear y editar: si la url trae id estamos editando
function EditarProducto({ onAviso }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const producto = id ? baseDatos.obtenerProducto(id) : null;

  if (id && !producto) return <p className="estado-vacio-admin">No encontramos este producto.</p>;

  function guardar(datos) {
    if (id) {
      baseDatos.actualizarProducto(id, datos);
      onAviso("Producto actualizado.");
    } else {
      baseDatos.crearProducto(datos);
      onAviso("Producto creado.");
    }
    navigate("/admin/productos");
  }

  return (
    <>
      <EncabezadoAdmin titulo={id ? "Editar producto" : "Nuevo producto"} />
      <div className="panel-admin p-3 p-md-4">
        <FormularioProducto
          inicial={producto}
          categorias={baseDatos.obtenerCategorias()}
          onGuardar={guardar}
          onCancelar={() => navigate("/admin/productos")}
        />
      </div>
    </>
  );
}

export default EditarProducto;
