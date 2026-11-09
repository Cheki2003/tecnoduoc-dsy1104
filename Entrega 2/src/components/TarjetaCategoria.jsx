import { Link } from "react-router-dom";

import Imagen from "./Imagen";

function TarjetaCategoria({ categoria, activa = false }) {
  return (
    <Link to={`/categorias/${categoria.id}`} className={`tarjeta-categoria-foto ${activa ? "activa" : ""}`}>
      <Imagen src={categoria.imagen} alt="" />
      <span className="tarjeta-categoria-texto">
        <strong>{categoria.nombre}</strong>
        <small>{categoria.descripcion}</small>
      </span>
    </Link>
  );
}

export default TarjetaCategoria;
