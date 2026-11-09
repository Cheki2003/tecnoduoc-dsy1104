import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import baseDatos from "../../data/baseDatos";
import Blog from "../../pages/tienda/Blog";
import Carrito from "../../pages/tienda/Carrito";
import Categorias from "../../pages/tienda/Categorias";
import Checkout from "../../pages/tienda/Checkout";
import CompraExitosa from "../../pages/tienda/CompraExitosa";
import Contacto from "../../pages/tienda/Contacto";
import DetalleBlog from "../../pages/tienda/DetalleBlog";
import DetalleProducto from "../../pages/tienda/DetalleProducto";
import Inicio from "../../pages/tienda/Inicio";
import Login from "../../pages/tienda/Login";
import Nosotros from "../../pages/tienda/Nosotros";
import Ofertas from "../../pages/tienda/Ofertas";
import PagoError from "../../pages/tienda/PagoError";
import Productos from "../../pages/tienda/Productos";
import Registro from "../../pages/tienda/Registro";
import { itemEjemplo, ordenEjemplo, renderConRouter, renderEnRuta } from "../ayuda";

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
}

describe("paginas de la tienda", () => {
  beforeEach(() => baseDatos.reiniciar());

  describe("Inicio", () => {
    it("muestra el carrusel, las categorias y los destacados", () => {
      renderConRouter(<Inicio onAgregar={() => {}} />);
      expect(screen.getByLabelText("Promociones destacadas")).toBeTruthy();
      expect(screen.getByText("Compra por categoría")).toBeTruthy();
      expect(screen.getAllByRole("article").length).toBe(baseDatos.obtenerDestacados().length + 3);
    });
  });

  describe("Productos (filtros)", () => {
    it("parte mostrando todo el catalogo", () => {
      renderEnRuta(<Productos onAgregar={() => {}} />, "/productos", "/productos");
      expect(screen.getByText("12 productos")).toBeTruthy();
    });

    it("toma el texto de busqueda desde la url", () => {
      renderEnRuta(<Productos onAgregar={() => {}} />, "/productos", "/productos?buscar=teclado");
      expect(screen.getByLabelText("Buscar por nombre").value).toBe("teclado");
      expect(screen.getByText("2 productos")).toBeTruthy();
    });

    it("escribir en el buscador filtra la lista", () => {
      renderEnRuta(<Productos onAgregar={() => {}} />, "/productos", "/productos");
      escribir("Buscar por nombre", "macbook");
      expect(screen.getByText("1 producto")).toBeTruthy();
    });

    it("los botones de categoria filtran y se marcan como activos", () => {
      renderEnRuta(<Productos onAgregar={() => {}} />, "/productos", "/productos");
      const boton = screen.getByRole("button", { name: "Monitores" });
      fireEvent.click(boton);
      expect(boton.getAttribute("aria-pressed")).toBe("true");
      expect(screen.getByText("2 productos")).toBeTruthy();
    });

    it("el interruptor deja solo las ofertas", () => {
      renderEnRuta(<Productos onAgregar={() => {}} />, "/productos", "/productos");
      fireEvent.click(screen.getByLabelText("Solo productos en oferta"));
      expect(screen.getByText(`${baseDatos.obtenerOfertas().length} productos`)).toBeTruthy();
    });

    it("sin resultados muestra el mensaje y limpiar vuelve a mostrar todo", () => {
      renderEnRuta(<Productos onAgregar={() => {}} />, "/productos", "/productos?buscar=xyz");
      expect(screen.getByText("No encontramos productos con esos filtros.")).toBeTruthy();
      fireEvent.click(screen.getByRole("button", { name: "Limpiar filtros" }));
      expect(screen.getByText("12 productos")).toBeTruthy();
    });
  });

  describe("Productos (orden)", () => {
    it("el selector ordena por menor precio", () => {
      renderEnRuta(<Productos onAgregar={() => {}} />, "/productos", "/productos");
      escribir("Ordenar por", "precio-menor");
      expect(screen.getAllByRole("article")[0].textContent).toContain("Audífonos In-Ear");
    });

    it("borrar el texto del buscador vuelve a mostrar todo", () => {
      renderEnRuta(<Productos onAgregar={() => {}} />, "/productos", "/productos?buscar=macbook");
      escribir("Buscar por nombre", "");
      expect(screen.getByText("12 productos")).toBeTruthy();
    });
  });

  describe("DetalleProducto", () => {
    it("muestra el producto de la url y sus caracteristicas", () => {
      renderEnRuta(<DetalleProducto onAgregar={() => {}} />, "/productos/:id", "/productos/1");
      expect(screen.getByRole("heading", { name: "Notebook Gamer HP Victus 15" })).toBeTruthy();
      expect(screen.getByText("Intel Core i5")).toBeTruthy();
    });

    it("el selector cambia la cantidad y agregar la entrega al padre", () => {
      const alAgregar = jasmine.createSpy("onAgregar");
      renderEnRuta(<DetalleProducto onAgregar={alAgregar} />, "/productos/:id", "/productos/1");
      fireEvent.click(screen.getByRole("button", { name: "Agregar una unidad" }));
      expect(screen.getByTestId("cantidad").textContent).toBe("2");
      fireEvent.click(screen.getByRole("button", { name: "Agregar al carrito" }));
      expect(alAgregar.calls.mostRecent().args[1]).toBe(2);
    });

    it("el boton de restar baja la cantidad y no deja bajar de uno", () => {
      renderEnRuta(<DetalleProducto onAgregar={() => {}} />, "/productos/:id", "/productos/1");
      const restar = screen.getByRole("button", { name: "Quitar una unidad" });
      expect(restar.disabled).toBeTrue();
      fireEvent.click(screen.getByRole("button", { name: "Agregar una unidad" }));
      fireEvent.click(restar);
      expect(screen.getByTestId("cantidad").textContent).toBe("1");
      expect(restar.disabled).toBeTrue();
    });

    it("si no hay stock no aparece el boton de agregar", () => {
      baseDatos.actualizarProducto(1, { stock: 0 });
      renderEnRuta(<DetalleProducto onAgregar={() => {}} />, "/productos/:id", "/productos/1");
      expect(screen.getByText("Sin stock por ahora")).toBeTruthy();
      expect(screen.queryByRole("button", { name: "Agregar al carrito" })).toBeNull();
    });

    it("si el producto no existe avisa", () => {
      renderEnRuta(<DetalleProducto onAgregar={() => {}} />, "/productos/:id", "/productos/999");
      expect(screen.getByText("Este producto ya no está disponible.")).toBeTruthy();
    });
  });

  describe("Categorias y Ofertas", () => {
    it("sin id muestra la primera categoria", () => {
      renderEnRuta(<Categorias onAgregar={() => {}} />, "/categorias", "/categorias");
      expect(screen.getByRole("heading", { name: "Laptops" })).toBeTruthy();
      expect(screen.getAllByRole("article").length).toBe(3);
    });

    it("con id muestra solo los productos de esa categoria", () => {
      renderEnRuta(<Categorias onAgregar={() => {}} />, "/categorias/:id", "/categorias/4");
      expect(screen.getByRole("heading", { name: "Audio" })).toBeTruthy();
      expect(screen.getAllByRole("article").length).toBe(4);
    });

    it("avisa si la categoria no existe", () => {
      renderEnRuta(<Categorias onAgregar={() => {}} />, "/categorias/:id", "/categorias/99");
      expect(screen.getByText("Esa categoría no existe.")).toBeTruthy();
    });

    it("Ofertas solo muestra productos con descuento", () => {
      renderConRouter(<Ofertas onAgregar={() => {}} />);
      expect(screen.getAllByRole("article").length).toBe(baseDatos.obtenerOfertas().length);
    });
  });

  describe("Blog y Nosotros", () => {
    it("Blog lista todas las entradas", () => {
      renderConRouter(<Blog />);
      expect(screen.getAllByRole("article").length).toBe(3);
    });

    it("DetalleBlog muestra la entrada de la url o un aviso", () => {
      const { unmount } = renderEnRuta(<DetalleBlog />, "/blog/:id", "/blog/2");
      expect(screen.getByRole("heading", { name: /escritorio de estudio/ })).toBeTruthy();
      unmount();
      renderEnRuta(<DetalleBlog />, "/blog/:id", "/blog/99");
      expect(screen.getByText("No encontramos esta publicación.")).toBeTruthy();
    });

    it("Nosotros se dibuja con sus valores", () => {
      renderConRouter(<Nosotros />);
      expect(screen.getByText("Hablamos claro")).toBeTruthy();
    });
  });

  describe("Contacto", () => {
    it("el mensaje de exito solo aparece al enviar bien", () => {
      renderConRouter(<Contacto />);
      fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));
      expect(screen.queryByRole("alert")).toBeNull();
      expect(screen.getByText("Escribe tu mensaje.")).toBeTruthy();

      escribir("Nombre", "Ana");
      escribir("Correo", "ana@duoc.cl");
      escribir("Mensaje", "Quiero saber si tienen stock");
      fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

      expect(screen.getByRole("alert")).toBeTruthy();
      expect(screen.getByLabelText("Nombre").value).toBe("");
      expect(baseDatos.obtenerMensajes().length).toBe(1);
    });
  });

  describe("Login", () => {
    it("el formulario guarda lo que se escribe", () => {
      renderEnRuta(<Login onLogin={() => {}} />, "/login", "/login");
      escribir("Correo", "ana@duoc.cl");
      expect(screen.getByLabelText("Correo").value).toBe("ana@duoc.cl");
    });

    it("con campos vacios muestra errores y no consulta la base de datos", () => {
      const espia = spyOn(baseDatos, "validarCredenciales");
      renderEnRuta(<Login onLogin={() => {}} />, "/login", "/login");
      fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
      expect(screen.getByText("Ingresa tu correo.")).toBeTruthy();
      expect(espia).not.toHaveBeenCalled();
    });

    it("con credenciales malas muestra el error general", () => {
      spyOn(baseDatos, "validarCredenciales").and.returnValue(null);
      const alEntrar = jasmine.createSpy("onLogin");
      renderEnRuta(<Login onLogin={alEntrar} />, "/login", "/login");
      escribir("Correo", "ana@duoc.cl");
      escribir("Contraseña", "123456");
      fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
      expect(screen.getByRole("alert").textContent).toContain("no son correctos");
      expect(alEntrar).not.toHaveBeenCalled();
    });

    it("un usuario normal entra y va al inicio", () => {
      const usuario = { nombre: "Ana", rol: "usuario" };
      spyOn(baseDatos, "validarCredenciales").and.returnValue(usuario);
      const alEntrar = jasmine.createSpy("onLogin");
      renderEnRuta(<Login onLogin={alEntrar} />, "/login", "/login");
      escribir("Correo", "ana@duoc.cl");
      escribir("Contraseña", "123456");
      fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
      expect(alEntrar).toHaveBeenCalledOnceWith(usuario);
      expect(screen.getByTestId("ruta-actual").textContent).toBe("/");
    });

    it("el administrador entra y va al panel", () => {
      renderEnRuta(<Login onLogin={() => {}} />, "/login", "/login");
      escribir("Correo", "admin@duoc.cl");
      escribir("Contraseña", "admin123");
      fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
      expect(screen.getByTestId("ruta-actual").textContent).toBe("/admin");
    });
  });

  describe("Registro", () => {
    function llenar(correo) {
      escribir("Nombre", "Ana");
      escribir("Apellidos", "Pérez");
      escribir("Correo", correo);
      escribir("Contraseña", "123456");
      escribir("Confirmar contraseña", "123456");
      fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));
    }

    it("no deja usar un correo que ya existe", () => {
      renderEnRuta(<Registro onLogin={() => {}} />, "/registro", "/registro");
      llenar("admin@duoc.cl");
      expect(screen.getByText("Este correo ya está registrado.")).toBeTruthy();
    });

    it("crea la cuenta con rol usuario e inicia sesion", () => {
      const alEntrar = jasmine.createSpy("onLogin");
      renderEnRuta(<Registro onLogin={alEntrar} />, "/registro", "/registro");
      llenar("nueva@duoc.cl");
      expect(baseDatos.buscarUsuarioPorCorreo("nueva@duoc.cl").rol).toBe("usuario");
      expect(alEntrar).toHaveBeenCalled();
      expect(screen.getByTestId("ruta-actual").textContent).toBe("/");
    });
  });

  describe("Carrito", () => {
    function dibujar(props = {}) {
      const funciones = {
        onCambiarCantidad: jasmine.createSpy("onCambiarCantidad"),
        onQuitar: jasmine.createSpy("onQuitar"),
        onVaciar: jasmine.createSpy("onVaciar"),
        onCambiarCupon: jasmine.createSpy("onCambiarCupon"),
      };
      renderConRouter(<Carrito carrito={[itemEjemplo]} cupon={null} {...funciones} {...props} />);
      return funciones;
    }

    it("vacio muestra el mensaje y no el resumen", () => {
      dibujar({ carrito: [] });
      expect(screen.getByText("Tu carrito está vacío")).toBeTruthy();
      expect(screen.queryByText("Resumen")).toBeNull();
    });

    it("con productos muestra el total", () => {
      dibujar();
      expect(screen.getByTestId("total").textContent).toBe("$20.000");
    });

    it("con cupon descuenta del total", () => {
      dibujar({ cupon: { codigo: "DUOC10", porcentaje: 10 } });
      expect(screen.getByTestId("total").textContent).toBe("$18.000");
    });

    it("el cupon aplicado se puede quitar", () => {
      const { onCambiarCupon } = dibujar({ cupon: { codigo: "DUOC10", porcentaje: 10 } });
      fireEvent.click(screen.getByRole("button", { name: "Quitar" }));
      expect(onCambiarCupon).toHaveBeenCalledWith(null);
    });

    it("un cupon valido se entrega al padre", () => {
      const { onCambiarCupon } = dibujar();
      escribir("¿Tienes un cupón?", "duoc20");
      fireEvent.click(screen.getByRole("button", { name: "Aplicar" }));
      expect(onCambiarCupon).toHaveBeenCalledWith({ codigo: "DUOC20", porcentaje: 20 });
    });

    it("un cupon malo muestra el error", () => {
      const { onCambiarCupon } = dibujar();
      escribir("¿Tienes un cupón?", "GRATIS");
      fireEvent.click(screen.getByRole("button", { name: "Aplicar" }));
      expect(screen.getByText("Ese cupón no existe. Prueba con DUOC10.")).toBeTruthy();
      expect(onCambiarCupon).not.toHaveBeenCalled();
    });

    it("vaciar pide confirmacion (mock de window.confirm)", () => {
      const confirmar = spyOn(window, "confirm").and.returnValue(false);
      const { onVaciar } = dibujar();
      fireEvent.click(screen.getByRole("button", { name: "Vaciar carrito" }));
      expect(onVaciar).not.toHaveBeenCalled();

      confirmar.and.returnValue(true);
      fireEvent.click(screen.getByRole("button", { name: "Vaciar carrito" }));
      expect(onVaciar).toHaveBeenCalledTimes(1);
    });
  });

  describe("Checkout", () => {
    const usuario = {
      nombre: "Ana",
      apellidos: "Pérez",
      correo: "ana@duoc.cl",
      calle: "Calle 1",
      depto: "",
      region: "Región de Valparaíso",
      comuna: "Quilpué",
    };

    function dibujar(props = {}) {
      const onCompraExitosa = jasmine.createSpy("onCompraExitosa");
      renderEnRuta(
        <Checkout usuario={usuario} carrito={[itemEjemplo]} cupon={null} onCompraExitosa={onCompraExitosa} {...props} />,
        "/checkout",
        "/checkout"
      );
      return onCompraExitosa;
    }

    it("con sesion los datos se completan solos", () => {
      dibujar();
      expect(screen.getByLabelText("Correo").value).toBe("ana@duoc.cl");
      expect(screen.getByLabelText("Comuna").value).toBe("Quilpué");
    });

    it("sin sesion parte vacio, y al pagar pide los datos", () => {
      const crear = spyOn(baseDatos, "crearOrden");
      dibujar({ usuario: null });
      fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }));
      expect(screen.getByText("Ingresa tu nombre.")).toBeTruthy();
      expect(crear).not.toHaveBeenCalled();
    });

    it("el retiro en tienda esconde la direccion y no cobra envio", () => {
      dibujar();
      expect(screen.getByTestId("total").textContent).toBe("$23.990");
      fireEvent.click(screen.getByLabelText(/Retiro en tienda/));
      expect(screen.queryByLabelText("Calle y número")).toBeNull();
      expect(screen.getByTestId("total").textContent).toBe("$20.000");
    });

    it("un pago aprobado crea la orden, descuenta stock y vacia el carrito", () => {
      const crear = spyOn(baseDatos, "crearOrden").and.returnValue({ id: 7 });
      const descontar = spyOn(baseDatos, "descontarStock");
      const onCompraExitosa = dibujar();
      fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }));

      expect(crear.calls.mostRecent().args[0].estado).toBe("pagada");
      expect(descontar).toHaveBeenCalledWith([itemEjemplo]);
      expect(onCompraExitosa).toHaveBeenCalled();
      expect(screen.getByTestId("ruta-actual").textContent).toBe("/compra-exitosa/7");
    });

    it("un pago rechazado no descuenta stock y mantiene el carrito", () => {
      const crear = spyOn(baseDatos, "crearOrden").and.returnValue({ id: 8 });
      const descontar = spyOn(baseDatos, "descontarStock");
      const onCompraExitosa = dibujar();
      fireEvent.click(screen.getByLabelText(/Simular pago rechazado/));
      fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }));

      expect(crear.calls.mostRecent().args[0].estado).toBe("rechazada");
      expect(descontar).not.toHaveBeenCalled();
      expect(onCompraExitosa).not.toHaveBeenCalled();
      expect(screen.getByTestId("ruta-actual").textContent).toBe("/pago-error/8");
    });

    it("con el carrito vacio manda de vuelta al carrito", () => {
      dibujar({ carrito: [] });
      expect(screen.getByTestId("ruta-actual").textContent).toBe("/carrito");
    });

    it("al reintentar recupera los datos que ya habia escrito", () => {
      const datos = { nombre: "Luis", apellidos: "Mora", correo: "l@duoc.cl", calle: "", depto: "", region: "", comuna: "", indicaciones: "", entrega: "retiro" };
      render(
        <MemoryRouter initialEntries={[{ pathname: "/checkout", state: { datos } }]}>
          <Routes>
            <Route path="/checkout" element={<Checkout usuario={null} carrito={[itemEjemplo]} cupon={null} onCompraExitosa={() => {}} />} />
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByLabelText("Nombre").value).toBe("Luis");
      expect(screen.getByLabelText(/Retiro en tienda/).checked).toBeTrue();
    });
  });

  describe("Resultado de la compra", () => {
    it("CompraExitosa muestra el resumen y permite imprimir (mock de window.print)", () => {
      const orden = baseDatos.crearOrden(ordenEjemplo);
      const imprimir = spyOn(window, "print");
      renderEnRuta(<CompraExitosa onAviso={() => {}} />, "/compra-exitosa/:id", `/compra-exitosa/${orden.id}`);
      expect(screen.getByText("Tu compra fue exitosa")).toBeTruthy();
      expect(screen.getByText(/Tocar el timbre/)).toBeTruthy();
      fireEvent.click(screen.getByRole("button", { name: "Imprimir boleta" }));
      expect(imprimir).toHaveBeenCalled();
    });

    it("enviar la boleta muestra un aviso con el correo", () => {
      const orden = baseDatos.crearOrden(ordenEjemplo);
      const alAvisar = jasmine.createSpy("onAviso");
      renderEnRuta(<CompraExitosa onAviso={alAvisar} />, "/compra-exitosa/:id", `/compra-exitosa/${orden.id}`);
      fireEvent.click(screen.getByRole("button", { name: "Enviar boleta por correo" }));
      expect(alAvisar.calls.mostRecent().args[0]).toContain("ana@duoc.cl");
    });

    it("PagoError ofrece volver a pagar", () => {
      const orden = baseDatos.crearOrden({ ...ordenEjemplo, estado: "rechazada", entrega: "retiro" });
      renderEnRuta(<PagoError />, "/pago-error/:id", `/pago-error/${orden.id}`);
      expect(screen.getByText("No se pudo realizar el pago")).toBeTruthy();
      expect(screen.getByRole("link", { name: /Volver a realizar el pago/ }).getAttribute("href")).toBe("/checkout");
      expect(screen.getByText("Retiro en tienda")).toBeTruthy();
    });

    it("si la orden no existe ambas paginas avisan", () => {
      const { unmount } = renderEnRuta(<CompraExitosa onAviso={() => {}} />, "/compra-exitosa/:id", "/compra-exitosa/1");
      expect(screen.getByText("No encontramos esta compra.")).toBeTruthy();
      unmount();
      renderEnRuta(<PagoError />, "/pago-error/:id", "/pago-error/1");
      expect(screen.getByText("No encontramos esta compra.")).toBeTruthy();
    });
  });
});
