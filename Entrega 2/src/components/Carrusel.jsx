import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Imagen from "./Imagen";

function Carrusel({ diapositivas, intervalo = 5000 }) {
  const [indice, setIndice] = useState(0);
  const total = diapositivas.length;

  // cada cierto tiempo pasa a la siguiente, y se reinicia si el usuario cambia a mano
  useEffect(() => {
    const temporizador = setInterval(() => {
      setIndice((actual) => (actual + 1) % total);
    }, intervalo);
    return () => clearInterval(temporizador);
  }, [indice, total, intervalo]);

  function anterior() {
    setIndice((indice - 1 + total) % total);
  }

  function siguiente() {
    setIndice((indice + 1) % total);
  }

  return (
    <section className="carrusel" aria-label="Promociones destacadas">
      {diapositivas.map((diapositiva, posicion) => (
        <div
          key={diapositiva.titulo}
          className={`carrusel-item ${posicion === indice ? "activo" : ""}`}
          aria-hidden={posicion !== indice}
        >
          <Imagen src={diapositiva.imagen} alt="" className="carrusel-imagen" />
          <div className="container carrusel-texto">
            <p className="etiqueta-seccion">{diapositiva.etiqueta}</p>
            <h2>{diapositiva.titulo}</h2>
            <p className="carrusel-bajada">{diapositiva.texto}</p>
            <Link
              to={diapositiva.enlace}
              className="btn btn-acento btn-lg"
              tabIndex={posicion === indice ? 0 : -1}
            >
              {diapositiva.textoBoton}
            </Link>
          </div>
        </div>
      ))}

      <div className="carrusel-controles">
        <button type="button" aria-label="Anterior" onClick={anterior}><i className="bi bi-arrow-left"></i></button>
        <span data-testid="carrusel-posicion">{indice + 1} / {total}</span>
        <button type="button" aria-label="Siguiente" onClick={siguiente}><i className="bi bi-arrow-right"></i></button>
      </div>
    </section>
  );
}

export default Carrusel;
