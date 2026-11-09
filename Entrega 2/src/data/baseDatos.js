// este archivo hace de base de datos del proyecto.
// como todavia no hay backend, todo se guarda en el localStorage del navegador.
// los componentes nunca tocan localStorage directo, siempre pasan por aqui.

import {
  categoriasIniciales,
  entradasBlog,
  ordenesIniciales,
  productosIniciales,
  usuariosIniciales,
} from "./datosIniciales";

const CLAVES = {
  productos: "tecnoduoc_productos",
  categorias: "tecnoduoc_categorias",
  usuarios: "tecnoduoc_usuarios",
  ordenes: "tecnoduoc_ordenes",
  mensajes: "tecnoduoc_mensajes",
  sesion: "tecnoduoc_usuario_activo",
  carrito: "tecnoduoc_carrito",
};

// lee una lista, y si todavia no existe la crea con los datos iniciales
function leer(clave, inicial) {
  const guardado = localStorage.getItem(clave);
  if (guardado === null) {
    localStorage.setItem(clave, JSON.stringify(inicial));
    return inicial;
  }
  return JSON.parse(guardado);
}

function guardar(clave, datos) {
  localStorage.setItem(clave, JSON.stringify(datos));
}

// busca el id mas alto y le suma uno
function siguienteId(lista) {
  if (lista.length === 0) return 1;
  return Math.max(...lista.map((elemento) => elemento.id)) + 1;
}

const baseDatos = {
  // ---------- productos ----------
  obtenerProductos() {
    return leer(CLAVES.productos, productosIniciales);
  },

  obtenerProducto(id) {
    return baseDatos.obtenerProductos().find((p) => p.id === Number(id)) || null;
  },

  obtenerOfertas() {
    return baseDatos.obtenerProductos().filter((p) => p.descuento > 0);
  },

  obtenerDestacados() {
    return baseDatos.obtenerProductos().filter((p) => p.destacado);
  },

  obtenerProductosPorCategoria(nombreCategoria) {
    return baseDatos.obtenerProductos().filter((p) => p.categoria === nombreCategoria);
  },

  // productos a los que les queda poco stock
  obtenerProductosCriticos(limite = 5) {
    return baseDatos.obtenerProductos().filter((p) => p.stock <= limite);
  },

  crearProducto(datos) {
    const productos = baseDatos.obtenerProductos();
    const nuevo = { ...datos, id: siguienteId(productos) };
    guardar(CLAVES.productos, [...productos, nuevo]);
    return nuevo;
  },

  actualizarProducto(id, datos) {
    const productos = baseDatos.obtenerProductos().map((p) =>
      p.id === Number(id) ? { ...p, ...datos, id: p.id } : p
    );
    guardar(CLAVES.productos, productos);
    return baseDatos.obtenerProducto(id);
  },

  eliminarProducto(id) {
    const productos = baseDatos.obtenerProductos().filter((p) => p.id !== Number(id));
    guardar(CLAVES.productos, productos);
  },

  // cuando una compra sale bien, se descuenta lo vendido del stock
  descontarStock(items) {
    const productos = baseDatos.obtenerProductos().map((p) => {
      const vendido = items.find((item) => item.id === p.id);
      if (!vendido) return p;
      return { ...p, stock: Math.max(p.stock - vendido.cantidad, 0) };
    });
    guardar(CLAVES.productos, productos);
  },

  // ---------- categorias ----------
  obtenerCategorias() {
    return leer(CLAVES.categorias, categoriasIniciales);
  },

  obtenerCategoria(id) {
    return baseDatos.obtenerCategorias().find((c) => c.id === Number(id)) || null;
  },

  crearCategoria(datos) {
    const categorias = baseDatos.obtenerCategorias();
    const nueva = { ...datos, id: siguienteId(categorias) };
    guardar(CLAVES.categorias, [...categorias, nueva]);
    return nueva;
  },

  actualizarCategoria(id, datos) {
    const anterior = baseDatos.obtenerCategoria(id);
    const categorias = baseDatos.obtenerCategorias().map((c) =>
      c.id === Number(id) ? { ...c, ...datos, id: c.id } : c
    );
    guardar(CLAVES.categorias, categorias);

    // si cambio el nombre, los productos tambien tienen que cambiar
    if (anterior && datos.nombre && datos.nombre !== anterior.nombre) {
      const productos = baseDatos.obtenerProductos().map((p) =>
        p.categoria === anterior.nombre ? { ...p, categoria: datos.nombre } : p
      );
      guardar(CLAVES.productos, productos);
    }
    return baseDatos.obtenerCategoria(id);
  },

  // devuelve false si la categoria todavia tiene productos, asi no quedan huerfanos
  eliminarCategoria(id) {
    const categoria = baseDatos.obtenerCategoria(id);
    if (!categoria) return false;
    if (baseDatos.obtenerProductosPorCategoria(categoria.nombre).length > 0) return false;
    guardar(CLAVES.categorias, baseDatos.obtenerCategorias().filter((c) => c.id !== Number(id)));
    return true;
  },

  // ---------- usuarios ----------
  obtenerUsuarios() {
    return leer(CLAVES.usuarios, usuariosIniciales);
  },

  obtenerUsuario(id) {
    return baseDatos.obtenerUsuarios().find((u) => u.id === Number(id)) || null;
  },

  buscarUsuarioPorCorreo(correo) {
    const buscado = correo.trim().toLowerCase();
    return baseDatos.obtenerUsuarios().find((u) => u.correo.toLowerCase() === buscado) || null;
  },

  crearUsuario(datos) {
    const usuarios = baseDatos.obtenerUsuarios();
    const nuevo = { rol: "usuario", ...datos, id: siguienteId(usuarios) };
    guardar(CLAVES.usuarios, [...usuarios, nuevo]);
    return nuevo;
  },

  actualizarUsuario(id, datos) {
    const usuarios = baseDatos.obtenerUsuarios().map((u) =>
      u.id === Number(id) ? { ...u, ...datos, id: u.id } : u
    );
    guardar(CLAVES.usuarios, usuarios);
    return baseDatos.obtenerUsuario(id);
  },

  eliminarUsuario(id) {
    guardar(CLAVES.usuarios, baseDatos.obtenerUsuarios().filter((u) => u.id !== Number(id)));
  },

  // revisa correo y clave, y devuelve el usuario si estan bien
  validarCredenciales(correo, clave) {
    const usuario = baseDatos.buscarUsuarioPorCorreo(correo);
    if (usuario && usuario.clave === clave) return usuario;
    return null;
  },

  // ---------- ordenes ----------
  obtenerOrdenes() {
    return leer(CLAVES.ordenes, ordenesIniciales);
  },

  obtenerOrden(id) {
    return baseDatos.obtenerOrdenes().find((o) => o.id === Number(id)) || null;
  },

  obtenerOrdenesPorCorreo(correo) {
    return baseDatos.obtenerOrdenes().filter((o) => o.cliente.correo === correo);
  },

  crearOrden(datos) {
    const ordenes = baseDatos.obtenerOrdenes();
    const ultimoId = ordenes.length > 0 ? Math.max(...ordenes.map((o) => o.id)) : 20260000;
    const nueva = { ...datos, id: ultimoId + 1, fecha: new Date().toISOString() };
    guardar(CLAVES.ordenes, [...ordenes, nueva]);
    return nueva;
  },

  actualizarEstadoOrden(id, estado) {
    const ordenes = baseDatos.obtenerOrdenes().map((o) =>
      o.id === Number(id) ? { ...o, estado } : o
    );
    guardar(CLAVES.ordenes, ordenes);
  },

  // ---------- mensajes del formulario de contacto ----------
  obtenerMensajes() {
    return leer(CLAVES.mensajes, []);
  },

  crearMensaje(datos) {
    const mensajes = baseDatos.obtenerMensajes();
    const nuevo = { ...datos, id: siguienteId(mensajes), fecha: new Date().toISOString() };
    guardar(CLAVES.mensajes, [...mensajes, nuevo]);
    return nuevo;
  },

  // ---------- blog (solo lectura) ----------
  obtenerEntradasBlog() {
    return entradasBlog;
  },

  obtenerEntradaBlog(id) {
    return entradasBlog.find((e) => e.id === Number(id)) || null;
  },

  // ---------- sesion ----------
  obtenerSesion() {
    const guardada = localStorage.getItem(CLAVES.sesion);
    return guardada ? JSON.parse(guardada) : null;
  },

  // nunca se guarda la clave en la sesion
  guardarSesion(usuario) {
    const { clave, ...datosPublicos } = usuario;
    guardar(CLAVES.sesion, datosPublicos);
    return datosPublicos;
  },

  borrarSesion() {
    localStorage.removeItem(CLAVES.sesion);
  },

  // ---------- carrito ----------
  obtenerCarrito() {
    const guardado = localStorage.getItem(CLAVES.carrito);
    return guardado ? JSON.parse(guardado) : [];
  },

  guardarCarrito(carrito) {
    guardar(CLAVES.carrito, carrito);
  },

  // deja todo como al principio, se usa en las pruebas
  reiniciar() {
    Object.values(CLAVES).forEach((clave) => localStorage.removeItem(clave));
  },
};

export default baseDatos;
