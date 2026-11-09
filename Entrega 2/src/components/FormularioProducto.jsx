import { useState } from "react";

import { hayErrores, validarProducto } from "../utils/validaciones";
import Boton from "./Boton";
import CampoFormulario from "./CampoFormulario";
import CampoSelect from "./CampoSelect";

// sirve para crear y para editar: si llega "inicial" parte con esos datos
function FormularioProducto({ inicial = null, categorias, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState({
    nombre: inicial ? inicial.nombre : "",
    categoria: inicial ? inicial.categoria : "",
    precio: inicial ? inicial.precio : "",
    descuento: inicial ? inicial.descuento : 0,
    stock: inicial ? inicial.stock : "",
    imagen: inicial ? inicial.imagen : "",
    descripcion: inicial ? inicial.descripcion : "",
    caracteristicas: inicial && inicial.caracteristicas ? inicial.caracteristicas.join("\n") : "",
    destacado: inicial ? inicial.destacado : false,
  });
  const [errores, setErrores] = useState({});

  function cambiar(evento) {
    const { name, value, type, checked } = evento.target;
    setDatos({ ...datos, [name]: type === "checkbox" ? checked : value });
  }

  function enviar(evento) {
    evento.preventDefault();
    const encontrados = validarProducto(datos);
    setErrores(encontrados);
    if (hayErrores(encontrados)) return;

    onGuardar({
      ...datos,
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
      precio: Number(datos.precio),
      descuento: Number(datos.descuento || 0),
      stock: Number(datos.stock),
      // cada linea del texto es una caracteristica
      caracteristicas: datos.caracteristicas.split("\n").map((linea) => linea.trim()).filter((linea) => linea !== ""),
    });
  }

  return (
    <form onSubmit={enviar} noValidate>
      <div className="row">
        <div className="col-md-8">
          <CampoFormulario etiqueta="Nombre" nombre="nombre" valor={datos.nombre} onChange={cambiar} error={errores.nombre} />
        </div>
        <div className="col-md-4">
          <CampoSelect
            etiqueta="Categoría"
            nombre="categoria"
            valor={datos.categoria}
            onChange={cambiar}
            opciones={categorias.map((c) => c.nombre)}
            error={errores.categoria}
          />
        </div>
        <div className="col-sm-4">
          <CampoFormulario etiqueta="Precio (CLP)" nombre="precio" tipo="number" valor={datos.precio} onChange={cambiar} error={errores.precio} />
        </div>
        <div className="col-sm-4">
          <CampoFormulario etiqueta="Descuento (%)" nombre="descuento" tipo="number" valor={datos.descuento} onChange={cambiar} error={errores.descuento} />
        </div>
        <div className="col-sm-4">
          <CampoFormulario etiqueta="Stock" nombre="stock" tipo="number" valor={datos.stock} onChange={cambiar} error={errores.stock} />
        </div>
      </div>

      <CampoFormulario
        etiqueta="URL de la imagen (opcional)"
        nombre="imagen"
        tipo="url"
        placeholder="https://..."
        valor={datos.imagen}
        onChange={cambiar}
      />
      <CampoFormulario etiqueta="Descripción" nombre="descripcion" tipo="textarea" valor={datos.descripcion} onChange={cambiar} error={errores.descripcion} />
      <CampoFormulario
        etiqueta="Características (opcional)"
        nombre="caracteristicas"
        tipo="textarea"
        ayuda="Escribe una por línea."
        valor={datos.caracteristicas}
        onChange={cambiar}
      />

      <div className="form-check mb-4">
        <input className="form-check-input" type="checkbox" id="campo-destacado" name="destacado" checked={datos.destacado} onChange={cambiar} />
        <label className="form-check-label" htmlFor="campo-destacado">Mostrar en productos destacados</label>
      </div>

      <div className="d-flex gap-2">
        <Boton etiqueta="Guardar producto" icono="check-lg" tipo="submit" variante="oscuro" />
        <Boton etiqueta="Cancelar" variante="outline-secondary" onClick={onCancelar} />
      </div>
    </form>
  );
}

export default FormularioProducto;
