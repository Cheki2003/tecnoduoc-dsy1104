// funciones del carrito. no guardan nada, solo reciben una lista y devuelven otra nueva,
// por eso son faciles de probar

export const COSTO_DESPACHO = 3990;

export const CUPONES = {
  DUOC10: 10,
  DUOC20: 20,
};

export function precioFinal(producto) {
  if (!producto.descuento) return producto.precio;
  return Math.round(producto.precio * (1 - producto.descuento / 100));
}

export function agregarItem(carrito, producto, cantidad = 1) {
  const existente = carrito.find((item) => item.id === producto.id);

  if (existente) {
    // no dejamos pedir mas de lo que hay en stock
    const nuevaCantidad = Math.min(existente.cantidad + cantidad, producto.stock);
    return carrito.map((item) =>
      item.id === producto.id ? { ...item, cantidad: nuevaCantidad } : item
    );
  }

  return [
    ...carrito,
    {
      id: producto.id,
      nombre: producto.nombre,
      categoria: producto.categoria,
      imagen: producto.imagen,
      precio: precioFinal(producto),
      stock: producto.stock,
      cantidad: Math.min(cantidad, producto.stock),
    },
  ];
}

export function cambiarCantidadItem(carrito, id, cambio) {
  return carrito
    .map((item) => {
      if (item.id !== id) return item;
      return { ...item, cantidad: Math.min(item.cantidad + cambio, item.stock) };
    })
    .filter((item) => item.cantidad > 0);
}

export function quitarItem(carrito, id) {
  return carrito.filter((item) => item.id !== id);
}

export function contarUnidades(carrito) {
  return carrito.reduce((total, item) => total + item.cantidad, 0);
}

export function calcularSubtotal(carrito) {
  return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

export function buscarCupon(codigo) {
  const limpio = codigo.trim().toUpperCase();
  if (CUPONES[limpio]) {
    return { codigo: limpio, porcentaje: CUPONES[limpio] };
  }
  return null;
}

// los precios de la tienda ya incluyen iva, por eso aqui no se suma aparte
export function calcularTotales(carrito, cupon = null, costoEnvio = 0) {
  const subtotal = calcularSubtotal(carrito);
  const descuento = cupon ? Math.round((subtotal * cupon.porcentaje) / 100) : 0;
  return {
    subtotal,
    descuento,
    costoEnvio,
    total: subtotal - descuento + costoEnvio,
  };
}
