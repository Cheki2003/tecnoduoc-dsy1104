import { Link } from "react-router-dom";

import EncabezadoAdmin from "../../components/EncabezadoAdmin";
import TarjetaEstadistica from "../../components/TarjetaEstadistica";
import baseDatos from "../../data/baseDatos";
import { formatearPrecio } from "../../utils/formato";
import { calcularResumenVentas } from "../../utils/reportes";

const ACCESOS = [
  { ruta: "/admin/ordenes", icono: "receipt", titulo: "Órdenes", texto: "Revisa las compras y sus boletas." },
  { ruta: "/admin/productos", icono: "box-seam", titulo: "Productos", texto: "Agrega, edita o elimina productos." },
  { ruta: "/admin/productos/criticos", icono: "exclamation-triangle", titulo: "Stock crítico", texto: "Productos que se están acabando." },
  { ruta: "/admin/categorias", icono: "tags", titulo: "Categorías", texto: "Ordena los productos de la tienda." },
  { ruta: "/admin/usuarios", icono: "people", titulo: "Usuarios", texto: "Administra las cuentas y sus roles." },
  { ruta: "/admin/reportes", icono: "bar-chart", titulo: "Reportes", texto: "Mira cómo van las ventas." },
  { ruta: "/admin/perfil", icono: "person-circle", titulo: "Perfil", texto: "Actualiza tus datos personales." },
  { ruta: "/", icono: "shop", titulo: "Tienda", texto: "Mira la tienda como un cliente." },
];

function Dashboard() {
  const ordenes = baseDatos.obtenerOrdenes();
  const productos = baseDatos.obtenerProductos();
  const usuarios = baseDatos.obtenerUsuarios();
  const criticos = baseDatos.obtenerProductosCriticos();
  const resumen = calcularResumenVentas(ordenes);

  return (
    <>
      <EncabezadoAdmin titulo="Dashboard" descripcion="Resumen de lo que está pasando en la tienda." />

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <TarjetaEstadistica titulo="Compras" valor={ordenes.length} detalle={`${formatearPrecio(resumen.totalVendido)} vendidos`} icono="cart-check" color="azul" />
        </div>
        <div className="col-md-4">
          <TarjetaEstadistica titulo="Productos" valor={productos.length} detalle={`${criticos.length} con stock crítico`} icono="box-seam" color="dorado" />
        </div>
        <div className="col-md-4">
          <TarjetaEstadistica titulo="Usuarios" valor={usuarios.length} detalle="Cuentas registradas" icono="people" color="celeste" />
        </div>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3">
        {ACCESOS.map((acceso) => (
          <div className="col" key={acceso.ruta}>
            <Link to={acceso.ruta} className="acceso-admin">
              <i className={`bi bi-${acceso.icono}`}></i>
              <strong>{acceso.titulo}</strong>
              <span>{acceso.texto}</span>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

export default Dashboard;
