import {
  correoValido,
  hayErrores,
  validarCategoria,
  validarCheckout,
  validarContacto,
  validarLogin,
  validarProducto,
  validarUsuario,
} from "../../utils/validaciones";

describe("validaciones de formularios", () => {
  it("correoValido reconoce correos buenos y malos", () => {
    expect(correoValido("ana@duoc.cl")).toBeTrue();
    expect(correoValido("ana@duoc")).toBeFalse();
    expect(correoValido("ana duoc.cl")).toBeFalse();
  });

  it("hayErrores indica si el objeto tiene algo", () => {
    expect(hayErrores({})).toBeFalse();
    expect(hayErrores({ correo: "mal" })).toBeTrue();
  });

  it("validarLogin pide correo y clave", () => {
    const errores = validarLogin({ correo: "", clave: "" });
    expect(errores.correo).toBeDefined();
    expect(errores.clave).toBeDefined();
  });

  it("validarLogin revisa formato de correo y largo de clave", () => {
    const errores = validarLogin({ correo: "malo", clave: "123" });
    expect(errores.correo).toContain("formato");
    expect(errores.clave).toContain("6");
  });

  it("validarLogin no da errores con datos correctos", () => {
    expect(validarLogin({ correo: "ana@duoc.cl", clave: "123456" })).toEqual({});
  });

  it("validarUsuario detecta que las claves no coinciden", () => {
    const errores = validarUsuario({ nombre: "Ana", apellidos: "Pérez", correo: "ana@duoc.cl", clave: "123456", confirmar: "654321" });
    expect(errores.confirmar).toBeDefined();
  });

  it("validarUsuario pide los campos obligatorios", () => {
    const errores = validarUsuario({ nombre: "", apellidos: "", correo: "", clave: "" });
    expect(Object.keys(errores)).toEqual(jasmine.arrayContaining(["nombre", "apellidos", "correo", "clave"]));
  });

  it("validarUsuario revisa el formato del correo y el largo de la clave", () => {
    const errores = validarUsuario({ nombre: "Ana", apellidos: "P", correo: "malo", clave: "123", confirmar: "123" });
    expect(errores.correo).toContain("formato");
    expect(errores.clave).toContain("6");
  });

  it("validarUsuario deja la clave opcional al editar", () => {
    const datos = { nombre: "Ana", apellidos: "Pérez", correo: "ana@duoc.cl", clave: "", confirmar: "" };
    expect(validarUsuario(datos, { pedirClave: false })).toEqual({});
  });

  it("validarProducto rechaza precio, stock y descuento fuera de rango", () => {
    const errores = validarProducto({ nombre: "A", categoria: "B", descripcion: "C", precio: "0", stock: "-1", descuento: "95" });
    expect(errores.precio).toBeDefined();
    expect(errores.stock).toBeDefined();
    expect(errores.descuento).toBeDefined();
  });

  it("validarProducto no acepta stock con decimales", () => {
    const errores = validarProducto({ nombre: "A", categoria: "B", descripcion: "C", precio: "100", stock: "1.5" });
    expect(errores.stock).toBeDefined();
  });

  it("validarProducto pasa con datos correctos", () => {
    expect(validarProducto({ nombre: "A", categoria: "B", descripcion: "C", precio: "100", stock: "0", descuento: "" })).toEqual({});
  });

  it("validarCategoria pide nombre y descripcion", () => {
    expect(Object.keys(validarCategoria({ nombre: " ", descripcion: "" })).length).toBe(2);
  });

  it("validarCheckout pide la direccion cuando es despacho", () => {
    const errores = validarCheckout({ nombre: "Ana", apellidos: "P", correo: "ana@duoc.cl", entrega: "despacho", calle: "", region: "", comuna: "" });
    expect(Object.keys(errores)).toEqual(["calle", "region", "comuna"]);
  });

  it("validarCheckout revisa el formato del correo", () => {
    expect(validarCheckout({ nombre: "Ana", apellidos: "P", correo: "malo", entrega: "retiro" }).correo).toContain("formato");
  });

  it("validarCheckout no pide la direccion cuando es retiro", () => {
    expect(validarCheckout({ nombre: "Ana", apellidos: "P", correo: "ana@duoc.cl", entrega: "retiro" })).toEqual({});
  });

  it("validarContacto revisa el formato del correo", () => {
    expect(validarContacto({ nombre: "Ana", correo: "malo", mensaje: "un mensaje largo" }).correo).toContain("formato");
  });

  it("validarContacto pide un mensaje de largo minimo", () => {
    expect(validarContacto({ nombre: "Ana", correo: "ana@duoc.cl", mensaje: "hola" }).mensaje).toContain("10");
    expect(validarContacto({ nombre: "Ana", correo: "ana@duoc.cl", mensaje: "hola, tengo una duda" })).toEqual({});
  });
});
