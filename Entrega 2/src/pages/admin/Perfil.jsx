import EncabezadoAdmin from "../../components/EncabezadoAdmin";
import FormularioUsuario from "../../components/FormularioUsuario";
import baseDatos from "../../data/baseDatos";

function Perfil({ usuario, onActualizar, onAviso }) {
  const datosCompletos = baseDatos.obtenerUsuario(usuario.id);

  function guardar(datos) {
    const conEseCorreo = baseDatos.buscarUsuarioPorCorreo(datos.correo);
    if (conEseCorreo && conEseCorreo.id !== usuario.id) {
      return { correo: "Este correo ya está registrado." };
    }
    onActualizar(baseDatos.actualizarUsuario(usuario.id, datos));
    onAviso("Tus datos se actualizaron.");
  }

  return (
    <>
      <EncabezadoAdmin titulo="Mi perfil" descripcion="Actualiza tus datos personales y tu contraseña." />
      <div className="panel-admin p-3 p-md-4">
        <FormularioUsuario inicial={datosCompletos} textoBoton="Guardar cambios" onGuardar={guardar} />
      </div>
    </>
  );
}

export default Perfil;
