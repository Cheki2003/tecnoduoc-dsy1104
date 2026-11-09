import { useState } from "react";
import { useNavigate } from "react-router-dom";

// buscador de la barra de navegacion, manda al catalogo con el texto en la url
function Buscador({ onBuscar }) {
  const [texto, setTexto] = useState("");
  const navigate = useNavigate();

  function enviar(evento) {
    evento.preventDefault();
    navigate(`/productos?buscar=${encodeURIComponent(texto.trim())}`);
    setTexto("");
    if (onBuscar) onBuscar();
  }

  return (
    <form className="buscador" role="search" onSubmit={enviar}>
      <i className="bi bi-search"></i>
      <input
        type="search"
        className="form-control"
        placeholder="Buscar"
        aria-label="Buscar productos"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
    </form>
  );
}

export default Buscador;
