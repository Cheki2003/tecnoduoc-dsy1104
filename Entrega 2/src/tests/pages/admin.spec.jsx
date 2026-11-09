import { fireEvent, screen } from "@testing-library/react";

import baseDatos from "../../data/baseDatos";
import LayoutAdmin from "../../components/LayoutAdmin";
import CategoriasAdmin from "../../pages/admin/CategoriasAdmin";
import Dashboard from "../../pages/admin/Dashboard";
import EditarCategoria from "../../pages/admin/EditarCategoria";
import EditarProducto from "../../pages/admin/EditarProducto";
import EditarUsuario from "../../pages/admin/EditarUsuario";
import HistorialUsuario from "../../pages/admin/HistorialUsuario";
import MostrarOrden from "../../pages/admin/MostrarOrden";
import Ordenes from "../../pages/admin/Ordenes";
import Perfil from "../../pages/admin/Perfil";
import ProductosAdmin from "../../pages/admin/ProductosAdmin";
import ProductosCriticos from "../../pages/admin/ProductosCriticos";
import Reportes from "../../pages/admin/Reportes";
import ReportesProductos from "../../pages/admin/ReportesProductos";
import UsuariosAdmin from "../../pages/admin/UsuariosAdmin";
import { renderConRouter, renderEnRuta } from "../ayuda";

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
}

describe("paginas del administrador", () => {
  beforeEach(() => baseDatos.reiniciar());

  describe("LayoutAdmin y Dashboard", () => {
    it("el menu lateral tiene todas las secciones y muestra al usuario", () => {
      renderConRouter(<LayoutAdmin usuario={{ nombre: "Admin" }} onCerrarSesion={() => {}} />);
      expect(screen.getAllByRole("link", { name: /Dashboard|Órdenes|Productos|Categorías|Usuarios|Reportes|Perfil/ }).length).toBe(7);
      expect(screen.getByText("Admin")).toBeTruthy();
    });

    it("cerrar sesion llama al padre y el boton abre el menu", () => {
      const alSalir = jasmine.createSpy("onCerrarSesion");
      renderConRouter(<LayoutAdmin usuario={{ nombre: "Admin" }} onCerrarSesion={alSalir} />);
      fireEvent.click(screen.getByRole("button", { name: /Cerrar sesión/ }));
      expect(alSalir).toHaveBeenCalled();

      const menu = screen.getByRole("button", { name: "Abrir menú de administración" });
      fireEvent.click(menu);
      expect(menu.getAttribute("aria-expanded")).toBe("true");
    });

    it("el dashboard cuenta productos y usuarios desde la base de datos", () => {
      renderConRouter(<Dashboard />);
      expect(screen.getByText("12")).toBeTruthy();
      expect(screen.getByText("Cuentas registradas").previousSibling.textContent).toBe("2");
    });
  });

  describe("Ordenes", () => {
    it("lista todas las ordenes y se pueden filtrar por estado", () => {
      renderConRouter(<Ordenes />);
      expect(screen.getAllByRole("row").length).toBe(4);
      escribir("Filtrar por estado", "rechazada");
      expect(screen.getAllByRole("row").length).toBe(2);
    });

    it("si no hay ordenes con ese estado lo avisa", () => {
      baseDatos.actualizarEstadoOrden(20260003, "pagada");
      renderConRouter(<Ordenes />);
      escribir("Filtrar por estado", "rechazada");
      expect(screen.getByText("No hay órdenes para mostrar.")).toBeTruthy();
    });

    it("muestra la boleta de la orden y permite imprimirla", () => {
      const imprimir = spyOn(window, "print");
      renderEnRuta(<MostrarOrden />, "/ordenes/:id", "/ordenes/20260001");
      expect(screen.getByText("Boleta #20260001")).toBeTruthy();
      expect(screen.getByText("Total pagado")).toBeTruthy();
      fireEvent.click(screen.getByRole("button", { name: "Imprimir" }));
      expect(imprimir).toHaveBeenCalled();
    });

    it("una orden rechazada no dice total pagado, y una inexistente avisa", () => {
      const { unmount } = renderEnRuta(<MostrarOrden />, "/ordenes/:id", "/ordenes/20260003");
      expect(screen.getByText("Total de la orden")).toBeTruthy();
      unmount();
      renderEnRuta(<MostrarOrden />, "/ordenes/:id", "/ordenes/1");
      expect(screen.getByText("No encontramos esta orden.")).toBeTruthy();
    });
  });

  describe("Productos", () => {
    it("muestra una fila por producto y el buscador filtra", () => {
      renderConRouter(<ProductosAdmin onAviso={() => {}} />);
      expect(screen.getAllByRole("row").length).toBe(13);
      escribir("Buscar producto", "macbook");
      expect(screen.getAllByRole("row").length).toBe(2);
    });

    it("eliminar con confirmacion actualiza la tabla y avisa", () => {
      spyOn(window, "confirm").and.returnValue(true);
      const alAvisar = jasmine.createSpy("onAviso");
      renderConRouter(<ProductosAdmin onAviso={alAvisar} />);
      fireEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
      expect(screen.getAllByRole("row").length).toBe(12);
      expect(baseDatos.obtenerProducto(1)).toBeNull();
      expect(alAvisar).toHaveBeenCalledWith("Producto eliminado.");
    });

    it("si no se confirma no elimina nada", () => {
      spyOn(window, "confirm").and.returnValue(false);
      const eliminar = spyOn(baseDatos, "eliminarProducto");
      renderConRouter(<ProductosAdmin onAviso={() => {}} />);
      fireEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
      expect(eliminar).not.toHaveBeenCalled();
    });

    it("crear un producto lo guarda y vuelve a la lista", () => {
      const alAvisar = jasmine.createSpy("onAviso");
      renderEnRuta(<EditarProducto onAviso={alAvisar} />, "/admin/productos/nuevo", "/admin/productos/nuevo");
      expect(screen.getByRole("heading", { name: "Nuevo producto" })).toBeTruthy();
      escribir("Nombre", "Webcam");
      escribir("Categoría", "Audio");
      escribir("Precio (CLP)", "1000");
      escribir("Stock", "1");
      escribir("Descripción", "Prueba");
      fireEvent.click(screen.getByRole("button", { name: "Guardar producto" }));
      expect(baseDatos.obtenerProductos().length).toBe(13);
      expect(alAvisar).toHaveBeenCalledWith("Producto creado.");
      expect(screen.getByTestId("ruta-actual").textContent).toBe("/admin/productos");
    });

    it("editar parte con los datos y los actualiza", () => {
      renderEnRuta(<EditarProducto onAviso={() => {}} />, "/admin/productos/:id/editar", "/admin/productos/1/editar");
      expect(screen.getByLabelText("Nombre").value).toBe("Notebook Gamer HP Victus 15");
      escribir("Stock", "99");
      fireEvent.click(screen.getByRole("button", { name: "Guardar producto" }));
      expect(baseDatos.obtenerProducto(1).stock).toBe(99);
    });

    it("avisa si el producto a editar no existe y cancelar vuelve a la lista", () => {
      const { unmount } = renderEnRuta(<EditarProducto onAviso={() => {}} />, "/admin/productos/:id/editar", "/admin/productos/999/editar");
      expect(screen.getByText("No encontramos este producto.")).toBeTruthy();
      unmount();
      renderEnRuta(<EditarProducto onAviso={() => {}} />, "/admin/productos/:id/editar", "/admin/productos/1/editar");
      fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
      expect(screen.getByTestId("ruta-actual").textContent).toBe("/admin/productos");
    });

    it("el listado critico solo trae productos con poco stock", () => {
      renderConRouter(<ProductosCriticos />);
      expect(screen.getAllByRole("row").length).toBe(baseDatos.obtenerProductosCriticos().length + 1);
    });

    it("si no hay productos criticos lo avisa", () => {
      spyOn(baseDatos, "obtenerProductosCriticos").and.returnValue([]);
      renderConRouter(<ProductosCriticos />);
      expect(screen.getByText("Todos los productos tienen stock suficiente.")).toBeTruthy();
    });

    it("el reporte de productos muestra stock y mas vendidos", () => {
      renderConRouter(<ReportesProductos />);
      expect(screen.getByText("Valor del inventario")).toBeTruthy();
      expect(screen.getAllByRole("progressbar").length).toBe(4);
      expect(screen.getAllByRole("listitem").length).toBeGreaterThan(0);
    });

    it("el reporte avisa si todavia no hay ventas", () => {
      spyOn(baseDatos, "obtenerOrdenes").and.returnValue([]);
      renderConRouter(<ReportesProductos />);
      expect(screen.getByText("Todavía no hay ventas.")).toBeTruthy();
    });
  });

  describe("Categorias", () => {
    it("no elimina una categoria con productos y lo avisa", () => {
      spyOn(window, "confirm").and.returnValue(true);
      const alAvisar = jasmine.createSpy("onAviso");
      renderConRouter(<CategoriasAdmin onAviso={alAvisar} />);
      fireEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
      expect(alAvisar).toHaveBeenCalledWith("No se puede eliminar porque todavía tiene productos.");
      expect(screen.getAllByRole("row").length).toBe(5);
    });

    it("elimina una categoria vacia", () => {
      spyOn(window, "confirm").and.returnValue(true);
      baseDatos.crearCategoria({ nombre: "Vacía", descripcion: "x" });
      const alAvisar = jasmine.createSpy("onAviso");
      renderConRouter(<CategoriasAdmin onAviso={alAvisar} />);
      fireEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[4]);
      expect(alAvisar).toHaveBeenCalledWith("Categoría eliminada.");
      expect(screen.getAllByRole("row").length).toBe(5);
    });

    it("sin confirmar no hace nada", () => {
      spyOn(window, "confirm").and.returnValue(false);
      const alAvisar = jasmine.createSpy("onAviso");
      renderConRouter(<CategoriasAdmin onAviso={alAvisar} />);
      fireEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
      expect(alAvisar).not.toHaveBeenCalled();
    });

    it("crea una categoria nueva", () => {
      renderEnRuta(<EditarCategoria onAviso={() => {}} />, "/nueva", "/nueva");
      escribir("Nombre", "Cámaras");
      escribir("Descripción", "Webcams");
      fireEvent.click(screen.getByRole("button", { name: "Guardar categoría" }));
      expect(baseDatos.obtenerCategorias().length).toBe(5);
    });

    it("cancelar vuelve a la lista de categorias", () => {
      renderEnRuta(<EditarCategoria onAviso={() => {}} />, "/nueva", "/nueva");
      fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
      expect(screen.getByTestId("ruta-actual").textContent).toBe("/admin/categorias");
    });

    it("edita una categoria existente, y avisa si no existe", () => {
      const { unmount } = renderEnRuta(<EditarCategoria onAviso={() => {}} />, "/:id/editar", "/1/editar");
      escribir("Nombre", "Notebooks");
      fireEvent.click(screen.getByRole("button", { name: "Guardar categoría" }));
      expect(baseDatos.obtenerCategoria(1).nombre).toBe("Notebooks");
      unmount();
      renderEnRuta(<EditarCategoria onAviso={() => {}} />, "/:id/editar", "/99/editar");
      expect(screen.getByText("No encontramos esta categoría.")).toBeTruthy();
    });
  });

  describe("Usuarios", () => {
    it("el administrador no puede eliminarse a si mismo", () => {
      renderConRouter(<UsuariosAdmin usuarioActivo={{ id: 1 }} onAviso={() => {}} />);
      const botones = screen.getAllByRole("button", { name: "Eliminar" });
      expect(botones[0].disabled).toBeTrue();
      expect(botones[1].disabled).toBeFalse();
    });

    it("elimina otro usuario al confirmar", () => {
      const confirmar = spyOn(window, "confirm").and.returnValue(false);
      renderConRouter(<UsuariosAdmin usuarioActivo={{ id: 1 }} onAviso={() => {}} />);
      fireEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[1]);
      expect(baseDatos.obtenerUsuario(2)).not.toBeNull();

      confirmar.and.returnValue(true);
      fireEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[1]);
      expect(baseDatos.obtenerUsuario(2)).toBeNull();
      expect(screen.getAllByRole("row").length).toBe(2);
    });

    it("crea un usuario con el rol elegido", () => {
      renderEnRuta(<EditarUsuario onAviso={() => {}} />, "/nuevo", "/nuevo");
      escribir("Nombre", "Ana");
      escribir("Apellidos", "Pérez");
      escribir("Correo", "ana@duoc.cl");
      escribir("Contraseña", "123456");
      escribir("Confirmar contraseña", "123456");
      escribir("Rol", "admin");
      fireEvent.click(screen.getByRole("button", { name: "Guardar usuario" }));
      expect(baseDatos.buscarUsuarioPorCorreo("ana@duoc.cl").rol).toBe("admin");
    });

    it("cancelar vuelve a la lista de usuarios", () => {
      renderEnRuta(<EditarUsuario onAviso={() => {}} />, "/nuevo", "/nuevo");
      fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
      expect(screen.getByTestId("ruta-actual").textContent).toBe("/admin/usuarios");
    });

    it("no deja repetir el correo de otro usuario", () => {
      renderEnRuta(<EditarUsuario onAviso={() => {}} />, "/:id/editar", "/2/editar");
      escribir("Correo", "admin@duoc.cl");
      fireEvent.click(screen.getByRole("button", { name: "Guardar usuario" }));
      expect(screen.getByText("Este correo ya está registrado.")).toBeTruthy();
    });

    it("editar sin cambiar la clave la mantiene", () => {
      renderEnRuta(<EditarUsuario onAviso={() => {}} />, "/:id/editar", "/2/editar");
      escribir("Nombre", "Cambiado");
      fireEvent.click(screen.getByRole("button", { name: "Guardar usuario" }));
      expect(baseDatos.obtenerUsuario(2).nombre).toBe("Cambiado");
      expect(baseDatos.obtenerUsuario(2).clave).toBe("user123");
    });

    it("avisa si el usuario a editar no existe", () => {
      renderEnRuta(<EditarUsuario onAviso={() => {}} />, "/:id/editar", "/99/editar");
      expect(screen.getByText("No encontramos este usuario.")).toBeTruthy();
    });

    it("el historial muestra solo las compras de ese usuario", () => {
      renderEnRuta(<HistorialUsuario />, "/:id/historial", "/2/historial");
      expect(screen.getAllByRole("row").length).toBe(2);
      expect(screen.getByText("#20260001")).toBeTruthy();
    });

    it("el historial avisa si el usuario no existe", () => {
      renderEnRuta(<HistorialUsuario />, "/:id/historial", "/99/historial");
      expect(screen.getByText("No encontramos este usuario.")).toBeTruthy();
    });

    it("el perfil guarda los cambios y actualiza la sesion", () => {
      const alActualizar = jasmine.createSpy("onActualizar");
      const alAvisar = jasmine.createSpy("onAviso");
      renderConRouter(<Perfil usuario={{ id: 1 }} onActualizar={alActualizar} onAviso={alAvisar} />);
      escribir("Nombre", "Nuevo");
      fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
      expect(alActualizar.calls.mostRecent().args[0].nombre).toBe("Nuevo");
      expect(alAvisar).toHaveBeenCalled();
    });

    it("el perfil no deja usar el correo de otra cuenta", () => {
      renderConRouter(<Perfil usuario={{ id: 1 }} onActualizar={() => {}} onAviso={() => {}} />);
      escribir("Correo", "estudiante@duoc.cl");
      fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
      expect(screen.getByText("Este correo ya está registrado.")).toBeTruthy();
    });
  });

  describe("Reportes", () => {
    it("muestra el total vendido y una barra por categoria", () => {
      renderConRouter(<Reportes />);
      expect(screen.getByText("$682.948")).toBeTruthy();
      expect(screen.getAllByRole("progressbar").length).toBe(2);
    });

    it("sin ventas lo avisa", () => {
      spyOn(baseDatos, "obtenerOrdenes").and.returnValue([]);
      renderConRouter(<Reportes />);
      expect(screen.getByText("Todavía no hay ventas.")).toBeTruthy();
    });
  });
});
