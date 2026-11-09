// input con su etiqueta y su mensaje de error. si tipo es "textarea" dibuja un area de texto
function CampoFormulario({ etiqueta, nombre, valor, onChange, error, tipo = "text", placeholder = "", ayuda = "", deshabilitado = false }) {
  const claseError = error ? "is-invalid" : "";
  const idCampo = `campo-${nombre}`;

  return (
    <div className="mb-3">
      <label htmlFor={idCampo} className="form-label">{etiqueta}</label>
      {tipo === "textarea" ? (
        <textarea
          id={idCampo}
          name={nombre}
          rows="3"
          className={`form-control ${claseError}`}
          placeholder={placeholder}
          value={valor}
          onChange={onChange}
          disabled={deshabilitado}
        ></textarea>
      ) : (
        <input
          id={idCampo}
          name={nombre}
          type={tipo}
          className={`form-control ${claseError}`}
          placeholder={placeholder}
          value={valor}
          onChange={onChange}
          disabled={deshabilitado}
        />
      )}
      {ayuda && !error && <div className="form-text">{ayuda}</div>}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}

export default CampoFormulario;
