import { useNavigate, useParams } from "react-router-dom";

import EncabezadoAdmin from "../../components/EncabezadoAdmin";
import FormularioUsuario from "../../components/FormularioUsuario";
import baseDatos from "../../data/baseDatos";

function EditarUsuario({ onAviso }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const usuario = id ? baseDatos.obtenerUsuario(id) : null;

  if (id && !usuario) return <p className="estado-vacio-admin">No encontramos este usuario.</p>;

  function guardar(datos) {
    const conEseCorreo = baseDatos.buscarUsuarioPorCorreo(datos.correo);
    if (conEseCorreo && conEseCorreo.id !== Number(id)) {
      return { correo: "Este correo ya está registrado." };
    }

    if (id) {
      baseDatos.actualizarUsuario(id, datos);
      onAviso("Usuario actualizado.");
    } else {
      baseDatos.crearUsuario(datos);
      onAviso("Usuario creado.");
    }
    navigate("/admin/usuarios");
  }

  return (
    <>
      <EncabezadoAdmin titulo={id ? "Editar usuario" : "Nuevo usuario"} />
      <div className="panel-admin p-3 p-md-4">
        <FormularioUsuario
          inicial={usuario}
          mostrarRol
          textoBoton="Guardar usuario"
          onGuardar={guardar}
          onCancelar={() => navigate("/admin/usuarios")}
        />
      </div>
    </>
  );
}

export default EditarUsuario;
