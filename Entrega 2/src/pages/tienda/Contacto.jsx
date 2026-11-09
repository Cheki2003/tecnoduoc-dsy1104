import { useState } from "react";

import Boton from "../../components/Boton";
import CampoFormulario from "../../components/CampoFormulario";
import baseDatos from "../../data/baseDatos";
import { hayErrores, validarContacto } from "../../utils/validaciones";

const FORMULARIO_VACIO = { nombre: "", correo: "", mensaje: "" };

function Contacto() {
  const [datos, setDatos] = useState(FORMULARIO_VACIO);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  function cambiar(evento) {
    setDatos({ ...datos, [evento.target.name]: evento.target.value });
    setEnviado(false);
  }

  function enviar(evento) {
    evento.preventDefault();
    const encontrados = validarContacto(datos);
    setErrores(encontrados);
    if (hayErrores(encontrados)) return;

    baseDatos.crearMensaje(datos);
    setDatos(FORMULARIO_VACIO);
    setEnviado(true);
  }

  return (
    <div className="container seccion">
      <div className="row g-4 g-lg-5">
        <div className="col-lg-5">
          <p className="etiqueta-seccion etiqueta-oscura">Contacto</p>
          <h1 className="titulo-grande">¿Tienes alguna duda?</h1>
          <p className="detalle-texto">Escríbenos y te ayudamos a elegir o a resolver cualquier problema con tu compra.</p>
          <ul className="list-unstyled lista-contacto">
            <li><i className="bi bi-geo-alt"></i>Duoc UC, sede San Joaquín</li>
            <li><i className="bi bi-envelope"></i>soporte@tecnoduoc.cl</li>
            <li><i className="bi bi-telephone"></i>+56 9 1234 5678</li>
            <li><i className="bi bi-clock"></i>Lunes a viernes, de 9:00 a 18:00</li>
          </ul>
        </div>
        <div className="col-lg-7">
          <div className="panel-formulario">
            {enviado && (
              <div className="alert alert-success" role="alert">Recibimos tu mensaje, te vamos a responder pronto.</div>
            )}
            <form onSubmit={enviar} noValidate>
              <CampoFormulario etiqueta="Nombre" nombre="nombre" valor={datos.nombre} onChange={cambiar} error={errores.nombre} />
              <CampoFormulario etiqueta="Correo" nombre="correo" tipo="email" valor={datos.correo} onChange={cambiar} error={errores.correo} />
              <CampoFormulario etiqueta="Mensaje" nombre="mensaje" tipo="textarea" valor={datos.mensaje} onChange={cambiar} error={errores.mensaje} />
              <Boton etiqueta="Enviar mensaje" icono="send" tipo="submit" variante="oscuro" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacto;
