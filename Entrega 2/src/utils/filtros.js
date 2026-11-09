import { precioFinal } from "./carrito";

export function filtrarProductos(lista, { texto = "", categoria = "Todas", soloOfertas = false } = {}) {
  const buscado = texto.trim().toLowerCase();

  return lista.filter((producto) => {
    if (categoria !== "Todas" && producto.categoria !== categoria) return false;
    if (soloOfertas && !producto.descuento) return false;
    if (buscado === "") return true;

    return (
      producto.nombre.toLowerCase().includes(buscado) ||
      producto.descripcion.toLowerCase().includes(buscado) ||
      producto.categoria.toLowerCase().includes(buscado)
    );
  });
}

export function ordenarProductos(lista, orden) {
  const copia = [...lista];
  if (orden === "precio-menor") {
    copia.sort((a, b) => precioFinal(a) - precioFinal(b));
  } else if (orden === "precio-mayor") {
    copia.sort((a, b) => precioFinal(b) - precioFinal(a));
  } else if (orden === "nombre") {
    copia.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }
  return copia;
}
