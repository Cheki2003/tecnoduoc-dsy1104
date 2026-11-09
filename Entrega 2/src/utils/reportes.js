// calculos para los reportes del administrador. solo cuentan las ordenes pagadas

export function calcularResumenVentas(ordenes) {
  const pagadas = ordenes.filter((orden) => orden.estado === "pagada");
  const totalVendido = pagadas.reduce((suma, orden) => suma + orden.total, 0);
  return {
    totalVendido,
    cantidadPagadas: pagadas.length,
    cantidadRechazadas: ordenes.length - pagadas.length,
    promedio: pagadas.length > 0 ? Math.round(totalVendido / pagadas.length) : 0,
  };
}

export function ventasPorCategoria(ordenes) {
  const totales = {};
  ordenes
    .filter((orden) => orden.estado === "pagada")
    .forEach((orden) => {
      orden.items.forEach((item) => {
        const categoria = item.categoria || "Sin categoría";
        totales[categoria] = (totales[categoria] || 0) + item.precio * item.cantidad;
      });
    });

  return Object.keys(totales)
    .map((categoria) => ({ categoria, total: totales[categoria] }))
    .sort((a, b) => b.total - a.total);
}

export function productosMasVendidos(ordenes, limite = 5) {
  const vendidos = {};
  ordenes
    .filter((orden) => orden.estado === "pagada")
    .forEach((orden) => {
      orden.items.forEach((item) => {
        vendidos[item.nombre] = (vendidos[item.nombre] || 0) + item.cantidad;
      });
    });

  return Object.keys(vendidos)
    .map((nombre) => ({ nombre, cantidad: vendidos[nombre] }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, limite);
}

export function stockPorCategoria(productos) {
  const totales = {};
  productos.forEach((producto) => {
    totales[producto.categoria] = (totales[producto.categoria] || 0) + producto.stock;
  });
  return Object.keys(totales).map((categoria) => ({ categoria, stock: totales[categoria] }));
}

export function calcularValorInventario(productos) {
  return productos.reduce((suma, producto) => suma + producto.precio * producto.stock, 0);
}
