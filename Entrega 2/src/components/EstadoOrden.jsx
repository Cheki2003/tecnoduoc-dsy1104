function EstadoOrden({ estado }) {
  const pagada = estado === "pagada";
  return (
    <span className={`badge ${pagada ? "text-bg-success" : "text-bg-danger"}`}>
      {pagada ? "Pagada" : "Rechazada"}
    </span>
  );
}

export default EstadoOrden;
