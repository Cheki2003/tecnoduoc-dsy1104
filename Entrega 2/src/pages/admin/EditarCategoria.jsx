import { useNavigate, useParams } from "react-router-dom";

import EncabezadoAdmin from "../../components/EncabezadoAdmin";
import FormularioCategoria from "../../components/FormularioCategoria";
import baseDatos from "../../data/baseDatos";

function EditarCategoria({ onAviso }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const categoria = id ? baseDatos.obtenerCategoria(id) : null;

  if (id && !categoria) return <p className="estado-vacio-admin">No encontramos esta categoría.</p>;

  function guardar(datos) {
    if (id) {
      baseDatos.actualizarCategoria(id, datos);
      onAviso("Categoría actualizada.");
    } else {
      baseDatos.crearCategoria(datos);
      onAviso("Categoría creada.");
    }
    navigate("/admin/categorias");
  }

  return (
    <>
      <EncabezadoAdmin titulo={id ? "Editar categoría" : "Nueva categoría"} />
      <div className="panel-admin p-3 p-md-4">
        <FormularioCategoria inicial={categoria} onGuardar={guardar} onCancelar={() => navigate("/admin/categorias")} />
      </div>
    </>
  );
}

export default EditarCategoria;
