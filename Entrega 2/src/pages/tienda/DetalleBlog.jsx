import { Link, useParams } from "react-router-dom";

import Imagen from "../../components/Imagen";
import baseDatos from "../../data/baseDatos";
import { formatearFecha } from "../../utils/formato";
import NoEncontrada from "./NoEncontrada";

function DetalleBlog() {
  const { id } = useParams();
  const entrada = baseDatos.obtenerEntradaBlog(id);

  if (!entrada) return <NoEncontrada mensaje="No encontramos esta publicación." />;

  return (
    <article className="container seccion articulo">
      <Link to="/blog" className="enlace-flecha mb-3 d-inline-block">
        <i className="bi bi-arrow-left"></i> Volver al blog
      </Link>
      <h1 className="titulo-grande">{entrada.titulo}</h1>
      <p className="tarjeta-fecha">{formatearFecha(`${entrada.fecha}T12:00:00`)} · {entrada.autor}</p>
      <Imagen src={entrada.imagen} alt="" className="foto-redondeada mb-4" />
      {entrada.parrafos.map((parrafo) => (
        <p key={parrafo} className="detalle-texto">{parrafo}</p>
      ))}
    </article>
  );
}

export default DetalleBlog;
