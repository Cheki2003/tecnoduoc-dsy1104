import {
  agregarItem,
  buscarCupon,
  calcularSubtotal,
  calcularTotales,
  cambiarCantidadItem,
  contarUnidades,
  precioFinal,
  quitarItem,
} from "../../utils/carrito";
import { itemEjemplo, productoEjemplo } from "../ayuda";

describe("funciones del carrito", () => {
  it("precioFinal aplica el descuento y redondea", () => {
    expect(precioFinal({ precio: 10000, descuento: 15 })).toBe(8500);
    expect(precioFinal({ precio: 29990, descuento: 25 })).toBe(22493);
  });

  it("precioFinal deja igual el precio si no hay descuento", () => {
    expect(precioFinal({ precio: 10000, descuento: 0 })).toBe(10000);
  });

  it("agregarItem agrega un producto nuevo con el precio ya rebajado", () => {
    const carrito = agregarItem([], { ...productoEjemplo, descuento: 10 });
    expect(carrito.length).toBe(1);
    expect(carrito[0].precio).toBe(9000);
    expect(carrito[0].cantidad).toBe(1);
  });

  it("agregarItem suma la cantidad si el producto ya estaba", () => {
    const carrito = agregarItem(agregarItem([], productoEjemplo), productoEjemplo, 2);
    expect(carrito.length).toBe(1);
    expect(carrito[0].cantidad).toBe(3);
  });

  it("agregarItem no cambia los otros productos del carrito", () => {
    const carrito = agregarItem([{ ...itemEjemplo, id: 51 }], productoEjemplo);
    expect(agregarItem(carrito, productoEjemplo)[0].cantidad).toBe(2);
  });

  it("agregarItem no deja pasar del stock disponible", () => {
    const carrito = agregarItem([], { ...productoEjemplo, stock: 2 }, 5);
    expect(carrito[0].cantidad).toBe(2);
    expect(agregarItem(carrito, { ...productoEjemplo, stock: 2 })[0].cantidad).toBe(2);
  });

  it("agregarItem no modifica la lista original", () => {
    const original = [];
    agregarItem(original, productoEjemplo);
    expect(original.length).toBe(0);
  });

  it("cambiarCantidadItem sube y baja la cantidad", () => {
    expect(cambiarCantidadItem([itemEjemplo], 50, 1)[0].cantidad).toBe(3);
    expect(cambiarCantidadItem([itemEjemplo], 50, -1)[0].cantidad).toBe(1);
  });

  it("cambiarCantidadItem no pasa del stock", () => {
    expect(cambiarCantidadItem([{ ...itemEjemplo, cantidad: 3 }], 50, 1)[0].cantidad).toBe(3);
  });

  it("cambiarCantidadItem quita el producto si llega a cero", () => {
    expect(cambiarCantidadItem([{ ...itemEjemplo, cantidad: 1 }], 50, -1)).toEqual([]);
  });

  it("cambiarCantidadItem no toca los otros productos", () => {
    const otro = { ...itemEjemplo, id: 51 };
    const resultado = cambiarCantidadItem([itemEjemplo, otro], 50, 1);
    expect(resultado[1].cantidad).toBe(2);
  });

  it("quitarItem saca solo el producto indicado", () => {
    const otro = { ...itemEjemplo, id: 51 };
    expect(quitarItem([itemEjemplo, otro], 50)).toEqual([otro]);
  });

  it("contarUnidades y calcularSubtotal suman bien", () => {
    const carrito = [itemEjemplo, { ...itemEjemplo, id: 51, precio: 5000, cantidad: 1 }];
    expect(contarUnidades(carrito)).toBe(3);
    expect(calcularSubtotal(carrito)).toBe(25000);
  });

  it("buscarCupon acepta minusculas y espacios", () => {
    expect(buscarCupon(" duoc10 ")).toEqual({ codigo: "DUOC10", porcentaje: 10 });
    expect(buscarCupon("DUOC20").porcentaje).toBe(20);
  });

  it("buscarCupon devuelve null si el cupon no existe", () => {
    expect(buscarCupon("GRATIS")).toBeNull();
  });

  it("calcularTotales descuenta el cupon y suma el envio", () => {
    const totales = calcularTotales([itemEjemplo], { codigo: "DUOC10", porcentaje: 10 }, 3990);
    expect(totales).toEqual({ subtotal: 20000, descuento: 2000, costoEnvio: 3990, total: 21990 });
  });

  it("calcularTotales funciona sin cupon y sin envio", () => {
    expect(calcularTotales([itemEjemplo]).total).toBe(20000);
  });
});
