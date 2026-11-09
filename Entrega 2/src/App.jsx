import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import baseDatos from "./data/baseDatos";
import { agregarItem, cambiarCantidadItem, quitarItem } from "./utils/carrito";

import Aviso from "./components/Aviso";
import LayoutAdmin from "./components/LayoutAdmin";
import LayoutTienda from "./components/LayoutTienda";
import RutaProtegida from "./components/RutaProtegida";

import Blog from "./pages/tienda/Blog";
import Carrito from "./pages/tienda/Carrito";
import Categorias from "./pages/tienda/Categorias";
import Checkout from "./pages/tienda/Checkout";
import CompraExitosa from "./pages/tienda/CompraExitosa";
import Contacto from "./pages/tienda/Contacto";
import DetalleBlog from "./pages/tienda/DetalleBlog";
import DetalleProducto from "./pages/tienda/DetalleProducto";
import Inicio from "./pages/tienda/Inicio";
import Login from "./pages/tienda/Login";
import NoEncontrada from "./pages/tienda/NoEncontrada";
import Nosotros from "./pages/tienda/Nosotros";
import Ofertas from "./pages/tienda/Ofertas";
import PagoError from "./pages/tienda/PagoError";
import Productos from "./pages/tienda/Productos";
import Registro from "./pages/tienda/Registro";

import CategoriasAdmin from "./pages/admin/CategoriasAdmin";
import Dashboard from "./pages/admin/Dashboard";
import EditarCategoria from "./pages/admin/EditarCategoria";
import EditarProducto from "./pages/admin/EditarProducto";
import EditarUsuario from "./pages/admin/EditarUsuario";
import HistorialUsuario from "./pages/admin/HistorialUsuario";
import MostrarOrden from "./pages/admin/MostrarOrden";
import Ordenes from "./pages/admin/Ordenes";
import Perfil from "./pages/admin/Perfil";
import ProductosAdmin from "./pages/admin/ProductosAdmin";
import ProductosCriticos from "./pages/admin/ProductosCriticos";
import Reportes from "./pages/admin/Reportes";
import ReportesProductos from "./pages/admin/ReportesProductos";
import UsuariosAdmin from "./pages/admin/UsuariosAdmin";

// aqui vive el estado que necesitan varias paginas: la sesion, el carrito y el cupon.
// cada pagina los recibe por props
function App() {
  const [usuario, setUsuario] = useState(baseDatos.obtenerSesion());
  const [carrito, setCarrito] = useState(baseDatos.obtenerCarrito());
  const [cupon, setCupon] = useState(null);
  const [aviso, setAviso] = useState("");
  const navigate = useNavigate();

  // cada vez que cambia el carrito lo guardamos
  useEffect(() => {
    baseDatos.guardarCarrito(carrito);
  }, [carrito]);

  function iniciarSesion(datosUsuario) {
    setUsuario(baseDatos.guardarSesion(datosUsuario));
  }

  function cerrarSesion() {
    baseDatos.borrarSesion();
    setUsuario(null);
    setAviso("Cerraste tu sesión.");
    navigate("/");
  }

  function agregarAlCarrito(producto, cantidad = 1) {
    setCarrito(agregarItem(carrito, producto, cantidad));
    setAviso(`Agregaste ${producto.nombre} al carrito.`);
  }

  function cambiarCantidad(id, cambio) {
    setCarrito(cambiarCantidadItem(carrito, id, cambio));
  }

  function quitarDelCarrito(id) {
    setCarrito(quitarItem(carrito, id));
  }

  function vaciarCarrito() {
    setCarrito([]);
    setCupon(null);
  }

  const propsLayout = { usuario, carrito, onCerrarSesion: cerrarSesion };

  return (
    <>
      <Routes>
        <Route element={<LayoutTienda {...propsLayout} />}>
          <Route path="/" element={<Inicio onAgregar={agregarAlCarrito} />} />
          <Route path="/productos" element={<Productos onAgregar={agregarAlCarrito} />} />
          <Route path="/productos/:id" element={<DetalleProducto onAgregar={agregarAlCarrito} />} />
          <Route path="/categorias" element={<Categorias onAgregar={agregarAlCarrito} />} />
          <Route path="/categorias/:id" element={<Categorias onAgregar={agregarAlCarrito} />} />
          <Route path="/ofertas" element={<Ofertas onAgregar={agregarAlCarrito} />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<DetalleBlog />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login onLogin={iniciarSesion} />} />
          <Route path="/registro" element={<Registro onLogin={iniciarSesion} />} />
          <Route
            path="/carrito"
            element={
              <Carrito
                carrito={carrito}
                cupon={cupon}
                onCambiarCantidad={cambiarCantidad}
                onQuitar={quitarDelCarrito}
                onVaciar={vaciarCarrito}
                onCambiarCupon={setCupon}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <Checkout usuario={usuario} carrito={carrito} cupon={cupon} onCompraExitosa={vaciarCarrito} />
            }
          />
          <Route path="/compra-exitosa/:id" element={<CompraExitosa onAviso={setAviso} />} />
          <Route path="/pago-error/:id" element={<PagoError />} />
          <Route path="*" element={<NoEncontrada />} />
        </Route>

        <Route
          path="/admin"
          element={
            <RutaProtegida usuario={usuario} rolRequerido="admin">
              <LayoutAdmin {...propsLayout} />
            </RutaProtegida>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="ordenes" element={<Ordenes />} />
          <Route path="ordenes/:id" element={<MostrarOrden />} />
          <Route path="productos" element={<ProductosAdmin onAviso={setAviso} />} />
          <Route path="productos/nuevo" element={<EditarProducto onAviso={setAviso} />} />
          <Route path="productos/criticos" element={<ProductosCriticos />} />
          <Route path="productos/reportes" element={<ReportesProductos />} />
          <Route path="productos/:id/editar" element={<EditarProducto onAviso={setAviso} />} />
          <Route path="categorias" element={<CategoriasAdmin onAviso={setAviso} />} />
          <Route path="categorias/nueva" element={<EditarCategoria onAviso={setAviso} />} />
          <Route path="categorias/:id/editar" element={<EditarCategoria onAviso={setAviso} />} />
          <Route path="usuarios" element={<UsuariosAdmin usuarioActivo={usuario} onAviso={setAviso} />} />
          <Route path="usuarios/nuevo" element={<EditarUsuario onAviso={setAviso} />} />
          <Route path="usuarios/:id/editar" element={<EditarUsuario onAviso={setAviso} />} />
          <Route path="usuarios/:id/historial" element={<HistorialUsuario />} />
          <Route path="reportes" element={<Reportes />} />
          <Route
            path="perfil"
            element={<Perfil usuario={usuario} onActualizar={iniciarSesion} onAviso={setAviso} />}
          />
        </Route>
      </Routes>

      <Aviso mensaje={aviso} onCerrar={() => setAviso("")} />
    </>
  );
}

export default App;
