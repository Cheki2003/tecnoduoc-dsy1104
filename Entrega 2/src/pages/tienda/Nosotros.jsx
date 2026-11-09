import { Link } from "react-router-dom";

import Imagen from "../../components/Imagen";

const VALORES = [
  { icono: "chat-dots", titulo: "Hablamos claro", texto: "Te contamos para qué sirve cada producto y para qué no, sin palabras raras." },
  { icono: "piggy-bank", titulo: "Precios justos", texto: "Sabemos lo que cuesta armarse un equipo siendo estudiante." },
  { icono: "tools", titulo: "Respaldo real", texto: "Todos los productos tienen 12 meses de garantía." },
];

function Nosotros() {
  return (
    <div className="container seccion">
      <div className="row g-4 g-lg-5 align-items-center mb-5">
        <div className="col-lg-6">
          <p className="etiqueta-seccion etiqueta-oscura">Quiénes somos</p>
          <h1 className="titulo-grande">Una tienda pensada por y para estudiantes</h1>
          <p className="detalle-texto">
            TecnoDUOC nació como proyecto de la asignatura Desarrollo Fullstack II. La idea era simple:
            construir la tienda que nos hubiera gustado encontrar cuando tuvimos que comprar nuestro
            primer computador para la carrera.
          </p>
          <p className="detalle-texto">
            Partimos con páginas en HTML y JavaScript, y en esta etapa migramos todo a React para
            sumar categorías, ofertas, un proceso de compra completo y un panel de administración.
          </p>
          <Link to="/productos" className="btn btn-oscuro btn-lg mt-2">Ver productos</Link>
        </div>
        <div className="col-lg-6">
          <Imagen
            src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=900&auto=format&fit=crop&q=75"
            alt="Notebook abierto sobre un escritorio"
            className="foto-redondeada"
          />
        </div>
      </div>

      <div className="row g-4">
        {VALORES.map((valor) => (
          <div className="col-md-4" key={valor.titulo}>
            <div className="tarjeta-valor">
              <i className={`bi bi-${valor.icono}`}></i>
              <h2>{valor.titulo}</h2>
              <p>{valor.texto}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Nosotros;
