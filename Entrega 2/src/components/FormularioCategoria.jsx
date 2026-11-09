import { useState } from "react";

import { hayErrores, validarCategoria } from "../utils/validaciones";
import Boton from "./Boton";
import CampoFormulario from "./CampoFormulario";

function FormularioCategoria({ inicial = null, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState({
    nombre: inicial ? inicial.nombre : "",
    descripcion: inicial ? inicial.descripcion : "",
    imagen: inicial ? inicial.imagen : "",
  });
  const [errores, setErrores] = useState({});

  function cambiar(evento) {
    setDatos({ ...datos, [evento.target.name]: evento.target.value });
  }

  function enviar(evento) {
    evento.preventDefault();
    const encontrados = validarCategoria(datos);
    setErrores(encontrados);
    if (!hayErrores(encontrados)) onGuardar({ ...datos, nombre: datos.nombre.trim() });
  }

  return (
    <form onSubmit={enviar} noValidate>
      <CampoFormulario etiqueta="Nombre" nombre="nombre" valor={datos.nombre} onChange={cambiar} error={errores.nombre} />
      <CampoFormulario etiqueta="Descripción" nombre="descripcion" tipo="textarea" valor={datos.descripcion} onChange={cambiar} error={errores.descripcion} />
      <CampoFormulario etiqueta="URL de la imagen (opcional)" nombre="imagen" tipo="url" valor={datos.imagen} onChange={cambiar} />

      <div className="d-flex gap-2">
        <Boton etiqueta="Guardar categoría" icono="check-lg" tipo="submit" variante="oscuro" />
        <Boton etiqueta="Cancelar" variante="outline-secondary" onClick={onCancelar} />
      </div>
    </form>
  );
}

export default FormularioCategoria;
