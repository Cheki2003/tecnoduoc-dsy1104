// boton generico: recibe el texto, el icono y lo que debe hacer al hacer clic
function Boton({ etiqueta, onClick, icono, variante = "primary", tipo = "button", deshabilitado = false, className = "" }) {
  return (
    <button type={tipo} className={`btn btn-${variante} ${className}`} onClick={onClick} disabled={deshabilitado}>
      {icono && <i className={`bi bi-${icono} me-2`}></i>}
      {etiqueta}
    </button>
  );
}

export default Boton;
