import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

const ENLACES = [
  { ruta: "/admin", texto: "Dashboard", icono: "speedometer2", fin: true },
  { ruta: "/admin/ordenes", texto: "Órdenes", icono: "receipt" },
  { ruta: "/admin/productos", texto: "Productos", icono: "box-seam" },
  { ruta: "/admin/categorias", texto: "Categorías", icono: "tags" },
  { ruta: "/admin/usuarios", texto: "Usuarios", icono: "people" },
  { ruta: "/admin/reportes", texto: "Reportes", icono: "bar-chart" },
  { ruta: "/admin/perfil", texto: "Perfil", icono: "person-circle" },
];

function LayoutAdmin({ usuario, onCerrarSesion }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="admin">
      <aside className={`admin-lateral no-imprimir ${menuAbierto ? "abierto" : ""}`}>
        <div className="d-flex justify-content-between align-items-center">
          <Link className="marca" to="/admin"><i className="bi bi-cpu-fill"></i>Tecno<span>DUOC</span></Link>
          <button
            type="button"
            className="btn-menu-admin d-lg-none"
            aria-label="Abrir menú de administración"
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <i className={`bi ${menuAbierto ? "bi-x-lg" : "bi-list"}`}></i>
          </button>
        </div>

        <div className="admin-menu">
          <nav className="mt-4" aria-label="Menú de administración">
            {ENLACES.map((enlace) => (
              <NavLink
                key={enlace.ruta}
                to={enlace.ruta}
                end={enlace.fin}
                className="admin-enlace"
                onClick={() => setMenuAbierto(false)}
              >
                <i className={`bi bi-${enlace.icono}`}></i>
                {enlace.texto}
              </NavLink>
            ))}
          </nav>

          <div className="admin-pie">
            <p className="admin-usuario"><i className="bi bi-person-circle me-2"></i>{usuario ? usuario.nombre : ""}</p>
            <Link className="btn btn-sm btn-outline-light w-100 mb-2" to="/"><i className="bi bi-shop me-2"></i>Ir a la tienda</Link>
            <button type="button" className="btn btn-sm btn-acento w-100" onClick={onCerrarSesion}>
              <i className="bi bi-box-arrow-right me-2"></i>Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      <main className="admin-contenido">
        <Outlet />
      </main>
    </div>
  );
}

export default LayoutAdmin;
