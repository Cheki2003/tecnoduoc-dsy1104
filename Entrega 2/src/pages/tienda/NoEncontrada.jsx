import { Link } from "react-router-dom";

function NoEncontrada({ mensaje = "La página que buscas no existe." }) {
  return (
    <div className="container seccion">
      <div className="estado-vacio">
        <i className="bi bi-compass"></i>
        <h1 className="titulo-formulario">No encontramos lo que buscabas</h1>
        <p>{mensaje}</p>
        <Link to="/" className="btn btn-oscuro">Volver al inicio</Link>
      </div>
    </div>
  );
}

export default NoEncontrada;
