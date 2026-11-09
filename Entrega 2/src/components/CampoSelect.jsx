function CampoSelect({ etiqueta, nombre, valor, onChange, opciones, error, textoInicial = "Selecciona", deshabilitado = false }) {
  const idCampo = `campo-${nombre}`;

  return (
    <div className="mb-3">
      <label htmlFor={idCampo} className="form-label">{etiqueta}</label>
      <select
        id={idCampo}
        name={nombre}
        className={`form-select ${error ? "is-invalid" : ""}`}
        value={valor}
        onChange={onChange}
        disabled={deshabilitado}
      >
        <option value="">{textoInicial}</option>
        {opciones.map((opcion) => (
          <option key={opcion} value={opcion}>{opcion}</option>
        ))}
      </select>
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}

export default CampoSelect;
