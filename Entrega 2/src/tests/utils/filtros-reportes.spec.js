import { obtenerComunas } from "../../data/regiones";
import { filtrarProductos, ordenarProductos } from "../../utils/filtros";
import { formatearFecha, formatearPrecio } from "../../utils/formato";
import {
  calcularResumenVentas,
  calcularValorInventario,
  productosMasVendidos,
  stockPorCategoria,
  ventasPorCategoria,
} from "../../utils/reportes";

const lista = [
  { id: 1, nombre: "Mouse", categoria: "Periféricos", descripcion: "inalámbrico", precio: 20000, descuento: 0, stock: 2 },
  { id: 2, nombre: "Monitor", categoria: "Monitores", descripcion: "27 pulgadas", precio: 100000, descuento: 50, stock: 1 },
  { id: 3, nombre: "Audífonos", categoria: "Audio", descripcion: "con micrófono", precio: 60000, descuento: 0, stock: 4 },
];

const ordenes = [
  { estado: "pagada", total: 100, items: [{ nombre: "Mouse", categoria: "Periféricos", precio: 40, cantidad: 2 }] },
  { estado: "pagada", total: 300, items: [{ nombre: "Monitor", categoria: "Monitores", precio: 300, cantidad: 1 }, { nombre: "Mouse", precio: 10, cantidad: 2 }] },
  { estado: "rechazada", total: 900, items: [{ nombre: "Audífonos", categoria: "Audio", precio: 900, cantidad: 9 }] },
];

describe("filtros de productos", () => {
  it("sin filtros devuelve todo", () => {
    expect(filtrarProductos(lista).length).toBe(3);
  });

  it("filtra por texto sin importar mayusculas", () => {
    expect(filtrarProductos(lista, { texto: "MOUSE" }).map((p) => p.id)).toEqual([1]);
  });

  it("el texto tambien busca en descripcion y categoria", () => {
    expect(filtrarProductos(lista, { texto: "micrófono" }).map((p) => p.id)).toEqual([3]);
    expect(filtrarProductos(lista, { texto: "periféricos" }).map((p) => p.id)).toEqual([1]);
  });

  it("filtra por categoria y por ofertas", () => {
    expect(filtrarProductos(lista, { categoria: "Audio" }).map((p) => p.id)).toEqual([3]);
    expect(filtrarProductos(lista, { soloOfertas: true }).map((p) => p.id)).toEqual([2]);
  });

  it("ordena usando el precio con descuento", () => {
    expect(ordenarProductos(lista, "precio-menor").map((p) => p.id)).toEqual([1, 2, 3]);
    expect(ordenarProductos(lista, "precio-mayor").map((p) => p.id)).toEqual([3, 2, 1]);
  });

  it("ordena por nombre y no cambia la lista original", () => {
    expect(ordenarProductos(lista, "nombre")[0].nombre).toBe("Audífonos");
    expect(lista[0].id).toBe(1);
  });
});

describe("reportes y formato", () => {
  it("el resumen de ventas ignora las ordenes rechazadas", () => {
    expect(calcularResumenVentas(ordenes)).toEqual({ totalVendido: 400, cantidadPagadas: 2, cantidadRechazadas: 1, promedio: 200 });
  });

  it("el resumen no se cae si no hay ordenes", () => {
    expect(calcularResumenVentas([]).promedio).toBe(0);
  });

  it("ventasPorCategoria agrupa y ordena de mayor a menor", () => {
    const resultado = ventasPorCategoria(ordenes);
    expect(resultado[0]).toEqual({ categoria: "Monitores", total: 300 });
    expect(resultado.map((f) => f.categoria)).toContain("Sin categoría");
    expect(resultado.map((f) => f.categoria)).not.toContain("Audio");
  });

  it("productosMasVendidos suma las unidades y respeta el limite", () => {
    expect(productosMasVendidos(ordenes)[0]).toEqual({ nombre: "Mouse", cantidad: 4 });
    expect(productosMasVendidos(ordenes, 1).length).toBe(1);
  });

  it("calcula stock por categoria y valor del inventario", () => {
    expect(stockPorCategoria(lista)).toContain({ categoria: "Audio", stock: 4 });
    expect(calcularValorInventario(lista)).toBe(380000);
  });

  it("formatearPrecio usa el formato chileno", () => {
    expect(formatearPrecio(699990)).toBe("$699.990");
  });

  it("formatearFecha muestra el mes en español", () => {
    expect(formatearFecha("2026-10-12T12:00:00")).toContain("octubre");
  });

  it("obtenerComunas devuelve las de la region o una lista vacia", () => {
    expect(obtenerComunas("Región de Valparaíso")).toContain("Quilpué");
    expect(obtenerComunas("no existe")).toEqual([]);
  });
});
