import { useState } from "react";

import { hayErrores, validarUsuario } from "../utils/validaciones";
import Boton from "./Boton";
import CampoFormulario from "./CampoFormulario";
import CampoSelect from "./CampoSelect";
import SelectorRegion from "./SelectorRegion";

// lo usan el registro, el mantenedor de usuarios y el perfil.
// onGuardar puede devolver errores extra, por ejemplo si el correo ya existe
function FormularioUsuario({ inicial = null, mostrarRol = false, textoBoton = "Guardar", onGuardar, onCancelar }) {
  const editando = inicial !== null;
  const [datos, setDatos] = useState({
    nombre: editando ? inicial.nombre : "",
    apellidos: editando ? inicial.apellidos : "",
    correo: editando ? inicial.correo : "",
    clave: "",
    confirmar: "",
    rol: editando ? inicial.rol : "usuario",
    calle: editando ? inicial.calle : "",
    depto: editando ? inicial.depto : "",
    region: editando ? inicial.region : "",
    comuna: editando ? inicial.comuna : "",
  });
  const [errores, setErrores] = useState({});

  function cambiar(evento) {
    const { name, value } = evento.target;
    // se usa la forma con funcion porque SelectorRegion cambia dos campos seguidos
    setDatos((anteriores) => ({ ...anteriores, [name]: value }));
  }

  function enviar(evento) {
    evento.preventDefault();
    const encontrados = validarUsuario(datos, { pedirClave: !editando });
    setErrores(encontrados);
    if (hayErrores(encontrados)) return;

    const { confirmar, ...usuario } = datos;
    usuario.correo = usuario.correo.trim();
    // si esta editando y dejo la clave vacia, se mantiene la que tenia
    if (usuario.clave === "") delete usuario.clave;

    const erroresExtra = onGuardar(usuario);
    if (erroresExtra) setErrores(erroresExtra);
  }

  return (
    <form onSubmit={enviar} noValidate>
      <div className="row">
        <div className="col-md-6">
          <CampoFormulario etiqueta="Nombre" nombre="nombre" valor={datos.nombre} onChange={cambiar} error={errores.nombre} />
        </div>
        <div className="col-md-6">
          <CampoFormulario etiqueta="Apellidos" nombre="apellidos" valor={datos.apellidos} onChange={cambiar} error={errores.apellidos} />
        </div>
      </div>

      <CampoFormulario etiqueta="Correo" nombre="correo" tipo="email" valor={datos.correo} onChange={cambiar} error={errores.correo} placeholder="nombre@duoc.cl" />

      <div className="row">
        <div className="col-md-6">
          <CampoFormulario
            etiqueta="Contraseña"
            nombre="clave"
            tipo="password"
            valor={datos.clave}
            onChange={cambiar}
            error={errores.clave}
            ayuda={editando ? "Déjala en blanco si no la quieres cambiar." : "Mínimo 6 caracteres."}
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario etiqueta="Confirmar contraseña" nombre="confirmar" tipo="password" valor={datos.confirmar} onChange={cambiar} error={errores.confirmar} />
        </div>
      </div>

      {mostrarRol && (
        <CampoSelect etiqueta="Rol" nombre="rol" valor={datos.rol} onChange={cambiar} opciones={["usuario", "admin"]} textoInicial="Selecciona un rol" />
      )}

      <p className="subtitulo-formulario">Dirección de entrega (opcional)</p>
      <div className="row">
        <div className="col-md-8">
          <CampoFormulario etiqueta="Calle y número" nombre="calle" valor={datos.calle} onChange={cambiar} />
        </div>
        <div className="col-md-4">
          <CampoFormulario etiqueta="Depto" nombre="depto" valor={datos.depto} onChange={cambiar} />
        </div>
      </div>
      <SelectorRegion region={datos.region} comuna={datos.comuna} onChange={cambiar} />

      <div className="d-flex gap-2 mt-2">
        <Boton etiqueta={textoBoton} tipo="submit" variante="oscuro" />
        {onCancelar && <Boton etiqueta="Cancelar" variante="outline-secondary" onClick={onCancelar} />}
      </div>
    </form>
  );
}

export default FormularioUsuario;
