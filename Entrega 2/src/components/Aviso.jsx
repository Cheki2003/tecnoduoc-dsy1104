import { useEffect } from "react";

// mensaje chico que aparece abajo y se cierra solo despues de unos segundos
function Aviso({ mensaje, onCerrar, duracion = 3000 }) {
  useEffect(() => {
    if (!mensaje) return;
    const temporizador = setTimeout(onCerrar, duracion);
    return () => clearTimeout(temporizador);
  }, [mensaje]);

  if (!mensaje) return null;

  return (
    <div className="aviso no-imprimir" role="status">
      <i className="bi bi-check-circle-fill"></i>
      <span>{mensaje}</span>
      <button type="button" className="btn-close btn-close-white" aria-label="Cerrar aviso" onClick={onCerrar}></button>
    </div>
  );
}

export default Aviso;
