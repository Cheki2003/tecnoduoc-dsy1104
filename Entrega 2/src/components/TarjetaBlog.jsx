import { Link } from "react-router-dom";

import { formatearFecha } from "../utils/formato";
import Imagen from "./Imagen";

function TarjetaBlog({ entrada }) {
  return (
    <article className="tarjeta-blog">
      <Link to={`/blog/${entrada.id}`}>
        <Imagen src={entrada.imagen} alt="" />
      </Link>
      <p className="tarjeta-fecha">{formatearFecha(`${entrada.fecha}T12:00:00`)}</p>
      <h3><Link to={`/blog/${entrada.id}`}>{entrada.titulo}</Link></h3>
      <p>{entrada.resumen}</p>
    </article>
  );
}

export default TarjetaBlog;
