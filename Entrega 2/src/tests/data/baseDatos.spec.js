import baseDatos from "../../data/baseDatos";
import { ordenEjemplo, productoEjemplo } from "../ayuda";

describe("baseDatos (crud sobre localStorage)", () => {
  beforeEach(() => baseDatos.reiniciar());

  describe("productos", () => {
    it("carga los productos iniciales la primera vez y los guarda", () => {
      expect(baseDatos.obtenerProductos().length).toBe(12);
      expect(localStorage.getItem("tecnoduoc_productos")).not.toBeNull();
    });

    it("crear le asigna el siguiente id", () => {
      const nuevo = baseDatos.crearProducto(productoEjemplo);
      expect(nuevo.id).toBe(13);
      expect(baseDatos.obtenerProducto(13).nombre).toBe("Teclado de prueba");
    });

    it("leer un producto acepta el id como texto y devuelve null si no existe", () => {
      expect(baseDatos.obtenerProducto("1").id).toBe(1);
      expect(baseDatos.obtenerProducto(999)).toBeNull();
    });

    it("actualizar cambia los datos pero no el id", () => {
      const editado = baseDatos.actualizarProducto(1, { precio: 5, id: 77 });
      expect(editado.precio).toBe(5);
      expect(editado.id).toBe(1);
    });

    it("eliminar saca el producto de la lista", () => {
      baseDatos.eliminarProducto(1);
      expect(baseDatos.obtenerProducto(1)).toBeNull();
      expect(baseDatos.obtenerProductos().length).toBe(11);
    });

    it("los cambios siguen ahi al volver a leer", () => {
      baseDatos.actualizarProducto(2, { nombre: "Cambiado" });
      expect(JSON.parse(localStorage.getItem("tecnoduoc_productos"))[1].nombre).toBe("Cambiado");
    });

    it("las consultas filtran ofertas, destacados, categoria y stock critico", () => {
      expect(baseDatos.obtenerOfertas().every((p) => p.descuento > 0)).toBeTrue();
      expect(baseDatos.obtenerDestacados().every((p) => p.destacado)).toBeTrue();
      expect(baseDatos.obtenerProductosPorCategoria("Audio").length).toBe(4);
      expect(baseDatos.obtenerProductosCriticos().every((p) => p.stock <= 5)).toBeTrue();
    });

    it("descontarStock resta lo vendido y nunca baja de cero", () => {
      baseDatos.descontarStock([{ id: 1, cantidad: 3 }, { id: 2, cantidad: 100 }]);
      expect(baseDatos.obtenerProducto(1).stock).toBe(5);
      expect(baseDatos.obtenerProducto(2).stock).toBe(0);
    });
  });

  describe("categorias", () => {
    it("crear y leer", () => {
      const nueva = baseDatos.crearCategoria({ nombre: "Cámaras", descripcion: "Webcams" });
      expect(baseDatos.obtenerCategoria(nueva.id).nombre).toBe("Cámaras");
    });

    it("al renombrar tambien se actualizan sus productos", () => {
      baseDatos.actualizarCategoria(4, { nombre: "Sonido" });
      expect(baseDatos.obtenerProductosPorCategoria("Audio").length).toBe(0);
      expect(baseDatos.obtenerProductosPorCategoria("Sonido").length).toBe(4);
    });

    it("si el nombre no cambia los productos quedan igual", () => {
      baseDatos.actualizarCategoria(4, { descripcion: "Otra descripción" });
      expect(baseDatos.obtenerProductosPorCategoria("Audio").length).toBe(4);
      expect(baseDatos.obtenerCategoria(4).descripcion).toBe("Otra descripción");
    });

    it("no se puede eliminar si tiene productos", () => {
      expect(baseDatos.eliminarCategoria(1)).toBeFalse();
      expect(baseDatos.obtenerCategoria(1)).not.toBeNull();
    });

    it("se puede eliminar si esta vacia, y falla si no existe", () => {
      const vacia = baseDatos.crearCategoria({ nombre: "Vacía", descripcion: "x" });
      expect(baseDatos.eliminarCategoria(vacia.id)).toBeTrue();
      expect(baseDatos.eliminarCategoria(999)).toBeFalse();
    });
  });

  describe("usuarios y sesion", () => {
    it("crear deja el rol usuario por defecto", () => {
      expect(baseDatos.crearUsuario({ nombre: "Ana", correo: "ana@duoc.cl", clave: "123456" }).rol).toBe("usuario");
    });

    it("actualizar y eliminar", () => {
      expect(baseDatos.actualizarUsuario(2, { nombre: "Otro" }).nombre).toBe("Otro");
      baseDatos.eliminarUsuario(2);
      expect(baseDatos.obtenerUsuario(2)).toBeNull();
    });

    it("buscar por correo no distingue mayusculas", () => {
      expect(baseDatos.buscarUsuarioPorCorreo("ADMIN@duoc.cl ").id).toBe(1);
      expect(baseDatos.buscarUsuarioPorCorreo("nadie@duoc.cl")).toBeNull();
    });

    it("validarCredenciales revisa correo y clave", () => {
      expect(baseDatos.validarCredenciales("admin@duoc.cl", "admin123").rol).toBe("admin");
      expect(baseDatos.validarCredenciales("admin@duoc.cl", "mala")).toBeNull();
    });

    it("la sesion no guarda la clave", () => {
      baseDatos.guardarSesion(baseDatos.obtenerUsuario(1));
      expect(baseDatos.obtenerSesion().correo).toBe("admin@duoc.cl");
      expect(baseDatos.obtenerSesion().clave).toBeUndefined();
    });

    it("borrarSesion deja la sesion vacia", () => {
      baseDatos.guardarSesion(baseDatos.obtenerUsuario(1));
      baseDatos.borrarSesion();
      expect(baseDatos.obtenerSesion()).toBeNull();
    });
  });

  describe("ordenes, carrito, mensajes y blog", () => {
    it("crear orden le pone numero correlativo y fecha", () => {
      const orden = baseDatos.crearOrden(ordenEjemplo);
      expect(orden.id).toBe(20260004);
      expect(orden.fecha).toBeDefined();
    });

    it("sin ordenes la primera parte en 20260001", () => {
      spyOn(baseDatos, "obtenerOrdenes").and.returnValue([]);
      expect(baseDatos.crearOrden(ordenEjemplo).id).toBe(20260001);
    });

    it("las ordenes se pueden leer por id y por correo", () => {
      expect(baseDatos.obtenerOrden(20260001).total).toBe(83966);
      expect(baseDatos.obtenerOrdenesPorCorreo("estudiante@duoc.cl").length).toBe(1);
    });

    it("actualizarEstadoOrden cambia el estado", () => {
      baseDatos.actualizarEstadoOrden(20260003, "pagada");
      expect(baseDatos.obtenerOrden(20260003).estado).toBe("pagada");
    });

    it("el carrito parte vacio y se guarda", () => {
      expect(baseDatos.obtenerCarrito()).toEqual([]);
      baseDatos.guardarCarrito([{ id: 1, cantidad: 2 }]);
      expect(baseDatos.obtenerCarrito().length).toBe(1);
    });

    it("guarda los mensajes de contacto", () => {
      baseDatos.crearMensaje({ nombre: "Ana", correo: "ana@duoc.cl", mensaje: "hola" });
      expect(baseDatos.obtenerMensajes()[0].id).toBe(1);
    });

    it("el blog permite leer una entrada", () => {
      expect(baseDatos.obtenerEntradasBlog().length).toBe(3);
      expect(baseDatos.obtenerEntradaBlog(1).titulo).toContain("notebook");
      expect(baseDatos.obtenerEntradaBlog(99)).toBeNull();
    });

    it("usa localStorage para guardar (mock con spy)", () => {
      const espia = spyOn(Storage.prototype, "setItem").and.callThrough();
      baseDatos.guardarCarrito([]);
      expect(espia).toHaveBeenCalledWith("tecnoduoc_carrito", "[]");
    });
  });
});
