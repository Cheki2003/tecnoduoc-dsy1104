// barra de bootstrap para los reportes. valor es el porcentaje de 0 a 100
function BarraProgreso({ etiqueta, texto, valor }) {
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between small mb-1">
        <span>{etiqueta}</span>
        <strong>{texto}</strong>
      </div>
      <div className="progress" role="progressbar" aria-label={etiqueta} aria-valuenow={valor} aria-valuemin="0" aria-valuemax="100">
        <div className="progress-bar barra-marca" style={{ width: `${valor}%` }}></div>
      </div>
    </div>
  );
}

export default BarraProgreso;
