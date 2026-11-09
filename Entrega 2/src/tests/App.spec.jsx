// estas pruebas usan la aplicacion completa, para revisar que las partes funcionen juntas

import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import App from "../App";
import baseDatos from "../data/baseDatos";

function abrirEn(ruta) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>
  );
}

describe("App (rutas y estado compartido)", () => {
  beforeEach(() => baseDatos.reiniciar());

  const rutasTienda = [
    ["/", "Compra por categoría"],
    ["/productos", "Productos"],
    ["/productos/1", "Notebook Gamer HP Victus 15"],
    ["/categorias", "Categorías"],
    ["/ofertas", "Ofertas"],
    ["/nosotros", "Una tienda pensada por y para estudiantes"],
    ["/blog", "Blog"],
    ["/blog/1", "Cómo elegir un notebook para la carrera"],
    ["/contacto", "¿Tienes alguna duda?"],
    ["/login", "Iniciar sesión"],
    ["/registro", "Crear cuenta"],
    ["/carrito", "Tu carrito está vacío"],
    ["/no-existe", "No encontramos lo que buscabas"],
  ];

  rutasTienda.forEach(([ruta, titulo]) => {
    it(`la ruta ${ruta} muestra su pagina`, () => {
      abrirEn(ruta);
      expect(screen.getByRole("heading", { name: titulo })).toBeTruthy();
    });
  });

  it("agregar un producto actualiza el contador y muestra un aviso", () => {
    abrirEn("/productos");
    fireEvent.click(screen.getAllByRole("button", { name: "Agregar" })[0]);
    expect(screen.getByTestId("contador-carrito").textContent).toBe("1");
    expect(screen.getByRole("status").textContent).toContain("Notebook Gamer HP Victus 15");
    expect(baseDatos.obtenerCarrito().length).toBe(1);
  });

  it("el carrito guardado se recupera al abrir la pagina", () => {
    baseDatos.guardarCarrito([{ id: 1, nombre: "Algo", precio: 100, cantidad: 4, stock: 9, imagen: "" }]);
    abrirEn("/");
    expect(screen.getByTestId("contador-carrito").textContent).toBe("4");
  });

  it("en el carrito se puede cambiar la cantidad, quitar y vaciar", () => {
    spyOn(window, "confirm").and.returnValue(true);
    baseDatos.guardarCarrito([
      { id: 1, nombre: "Uno", precio: 100, cantidad: 1, stock: 9, imagen: "" },
      { id: 2, nombre: "Dos", precio: 100, cantidad: 1, stock: 9, imagen: "" },
    ]);
    abrirEn("/carrito");

    const grupo = screen.getByRole("group", { name: "Cantidad de Uno" });
    fireEvent.click(within(grupo).getByRole("button", { name: "Agregar una unidad" }));
    expect(screen.getByTestId("contador-carrito").textContent).toBe("3");

    fireEvent.click(screen.getByRole("button", { name: "Eliminar Dos" }));
    expect(screen.getByTestId("contador-carrito").textContent).toBe("2");

    fireEvent.click(screen.getByRole("button", { name: "Vaciar carrito" }));
    expect(screen.getByText("Tu carrito está vacío")).toBeTruthy();
  });

  it("el flujo de compra completo termina en compra exitosa y deja el carrito vacio", () => {
    baseDatos.guardarSesion(baseDatos.obtenerUsuario(2));
    baseDatos.guardarCarrito([{ id: 1, nombre: "Uno", categoria: "Laptops", precio: 100, cantidad: 2, stock: 9, imagen: "" }]);
    abrirEn("/checkout");
    fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }));
    expect(screen.getByText("Tu compra fue exitosa")).toBeTruthy();
    expect(screen.getByTestId("contador-carrito").textContent).toBe("0");
    expect(baseDatos.obtenerProducto(1).stock).toBe(6);
  });

  it("iniciar sesion como admin abre el panel y cerrar sesion vuelve a la tienda", () => {
    abrirEn("/login");
    fireEvent.change(screen.getByLabelText("Correo"), { target: { value: "admin@duoc.cl" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "admin123" } });
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /Cerrar sesión/ }));
    expect(screen.getByText("Compra por categoría")).toBeTruthy();
    expect(baseDatos.obtenerSesion()).toBeNull();
  });

  it("sin sesion el panel admin redirige al login", () => {
    abrirEn("/admin/productos");
    expect(screen.getByRole("heading", { name: "Iniciar sesión" })).toBeTruthy();
  });

  it("un usuario normal no puede abrir el panel admin", () => {
    baseDatos.guardarSesion(baseDatos.obtenerUsuario(2));
    abrirEn("/admin");
    expect(screen.queryByRole("heading", { name: "Dashboard" })).toBeNull();
    expect(screen.getByText("Compra por categoría")).toBeTruthy();
  });

  it("el administrador puede abrir cada seccion del panel", () => {
    baseDatos.guardarSesion(baseDatos.obtenerUsuario(1));
    abrirEn("/admin");
    [
      ["Órdenes", "Órdenes y boletas"],
      ["Productos", "Productos"],
      ["Categorías", "Categorías"],
      ["Usuarios", "Usuarios"],
      ["Reportes", "Reportes de ventas"],
      ["Perfil", "Mi perfil"],
    ].forEach(([enlace, titulo]) => {
      const menu = screen.getByRole("navigation", { name: "Menú de administración" });
      fireEvent.click(within(menu).getByRole("link", { name: enlace }));
      expect(screen.getByRole("heading", { name: titulo })).toBeTruthy();
    });
  });

  it("guardar el perfil cambia el nombre que aparece en el menu", () => {
    baseDatos.guardarSesion(baseDatos.obtenerUsuario(1));
    abrirEn("/admin/perfil");
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Nuevo Nombre" } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    expect(screen.getByText("Nuevo Nombre")).toBeTruthy();
  });
});
