import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Boton from "../../components/Boton";
import CampoFormulario from "../../components/CampoFormulario";
import baseDatos from "../../data/baseDatos";
import { hayErrores, validarLogin } from "../../utils/validaciones";

function Login({ onLogin }) {
  const [datos, setDatos] = useState({ correo: "", clave: "" });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const navigate = useNavigate();

  function cambiar(evento) {
    setDatos({ ...datos, [evento.target.name]: evento.target.value });
  }

  function enviar(evento) {
    evento.preventDefault();
    setErrorGeneral("");

    const encontrados = validarLogin(datos);
    setErrores(encontrados);
    if (hayErrores(encontrados)) return;

    const usuario = baseDatos.validarCredenciales(datos.correo, datos.clave);
    if (!usuario) {
      setErrorGeneral("El correo o la contraseña no son correctos.");
      return;
    }

    onLogin(usuario);
    navigate(usuario.rol === "admin" ? "/admin" : "/");
  }

  return (
    <div className="container seccion">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-5">
          <div className="panel-formulario">
            <h1 className="titulo-formulario">Iniciar sesión</h1>
            <p className="text-muted">Entra a tu cuenta para comprar más rápido.</p>

            {errorGeneral && <div className="alert alert-danger" role="alert">{errorGeneral}</div>}

            <form onSubmit={enviar} noValidate>
              <CampoFormulario etiqueta="Correo" nombre="correo" tipo="email" placeholder="nombre@duoc.cl" valor={datos.correo} onChange={cambiar} error={errores.correo} />
              <CampoFormulario etiqueta="Contraseña" nombre="clave" tipo="password" valor={datos.clave} onChange={cambiar} error={errores.clave} />
              <Boton etiqueta="Ingresar" tipo="submit" variante="oscuro" className="w-100 py-2" />
            </form>

            <p className="text-center mt-3 mb-0">
              ¿No tienes cuenta? <Link to="/registro">Crea una aquí</Link>
            </p>
          </div>

          <div className="nota-prueba">
            <strong>Cuentas de prueba</strong>
            <p className="mb-1">Administrador: admin@duoc.cl / admin123</p>
            <p className="mb-0">Usuario: estudiante@duoc.cl / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
