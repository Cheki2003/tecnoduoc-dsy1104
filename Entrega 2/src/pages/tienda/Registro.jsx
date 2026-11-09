import { Link, useNavigate } from "react-router-dom";

import FormularioUsuario from "../../components/FormularioUsuario";
import baseDatos from "../../data/baseDatos";

function Registro({ onLogin }) {
  const navigate = useNavigate();

  function guardar(datos) {
    if (baseDatos.buscarUsuarioPorCorreo(datos.correo)) {
      return { correo: "Este correo ya está registrado." };
    }

    // desde esta pagina siempre se crean cuentas normales
    const nuevo = baseDatos.crearUsuario({ ...datos, rol: "usuario" });
    onLogin(nuevo);
    navigate("/");
  }

  return (
    <div className="container seccion">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="panel-formulario">
            <h1 className="titulo-formulario">Crear cuenta</h1>
            <p className="text-muted">Si dejas tu dirección, después no la vas a tener que escribir al comprar.</p>
            <FormularioUsuario textoBoton="Crear cuenta" onGuardar={guardar} />
            <p className="mt-3 mb-0">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;
