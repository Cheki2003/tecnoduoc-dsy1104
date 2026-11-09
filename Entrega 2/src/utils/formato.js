export function formatearPrecio(valor) {
  return "$" + Number(valor).toLocaleString("es-CL");
}

export function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
