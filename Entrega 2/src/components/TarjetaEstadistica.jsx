function TarjetaEstadistica({ titulo, valor, detalle, icono, color = "azul" }) {
  return (
    <div className={`tarjeta-estadistica color-${color}`}>
      <div>
        <p className="estadistica-titulo">{titulo}</p>
        <p className="estadistica-valor">{valor}</p>
        {detalle && <p className="estadistica-detalle">{detalle}</p>}
      </div>
      <i className={`bi bi-${icono}`}></i>
    </div>
  );
}

export default TarjetaEstadistica;
