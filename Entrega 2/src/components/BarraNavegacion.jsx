import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import baseDatos from "../data/baseDatos";
import { calcularSubtotal, contarUnidades } from "../utils/carrito";
import { formatearPrecio } from "../utils/formato";
import Buscador from "./Buscador";

function BarraNavegacion({ usuario, carrito, onCerrarSesion }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const categorias = baseDatos.obtenerCategorias();

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  return (
    <header className="sticky-top no-imprimir">
      <div className="franja-superior d-none d-md-block">
        <div className="container d-flex justify-content-between">
          <span>Despacho a todo Chile</span>
          <span>Usa el cupón <strong>DUOC10</strong> y paga un 10% menos</span>
        </div>
      </div>

      <nav className="navbar navbar-expand-xl navbar-tienda" aria-label="Navegación principal">
        <div className="container">
          <Link className="navbar-brand marca" to="/" onClick={cerrarMenu}>
            <i className="bi bi-cpu-fill"></i>
            Tecno<span>DUOC</span>
          </Link>

          <Link to="/carrito" className="btn-carrito d-xl-none ms-auto me-2" aria-label="Ver carrito" onClick={cerrarMenu}>
            <i className="bi bi-bag"></i>
            <span className="contador">{contarUnidades(carrito)}</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <i className={`bi ${menuAbierto ? "bi-x-lg" : "bi-list"}`}></i>
          </button>

          <div className={`collapse navbar-collapse ${menuAbierto ? "show" : ""}`}>
            <ul className="navbar-nav me-auto mb-3 mb-xl-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" end onClick={cerrarMenu}>Inicio</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/productos" onClick={cerrarMenu}>Productos</NavLink>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Categorías
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/categorias" onClick={cerrarMenu}>Ver todas</Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  {categorias.map((categoria) => (
                    <li key={categoria.id}>
                      <Link className="dropdown-item" to={`/categorias/${categoria.id}`} onClick={cerrarMenu}>
                        {categoria.nombre}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/ofertas" onClick={cerrarMenu}>Ofertas</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/nosotros" onClick={cerrarMenu}>Nosotros</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/blog" onClick={cerrarMenu}>Blog</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/contacto" onClick={cerrarMenu}>Contacto</NavLink>
              </li>
              {usuario && usuario.rol === "admin" && (
                <li className="nav-item">
                  <NavLink className="nav-link enlace-admin" to="/admin" onClick={cerrarMenu}>Panel admin</NavLink>
                </li>
              )}
            </ul>

            <div className="d-flex flex-column flex-xl-row align-items-xl-center gap-2">
              <Buscador onBuscar={cerrarMenu} />

              <Link to="/carrito" className="btn-carrito d-none d-xl-inline-flex" onClick={cerrarMenu}>
                <i className="bi bi-bag"></i>
                <span className="d-none d-xxl-inline">{formatearPrecio(calcularSubtotal(carrito))}</span>
                <span className="contador" data-testid="contador-carrito">{contarUnidades(carrito)}</span>
              </Link>

              {usuario ? (
                <div className="d-flex align-items-center gap-2">
                  <span className="saludo"><i className="bi bi-person-circle me-1"></i><span className="d-xl-none d-xxl-inline">{usuario.nombre}</span></span>
                  <button type="button" className="btn btn-sm btn-outline-light" onClick={onCerrarSesion}>Salir</button>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Link className="btn btn-sm btn-outline-light" to="/login" onClick={cerrarMenu}>Iniciar sesión</Link>
                  <Link className="btn btn-sm btn-acento" to="/registro" onClick={cerrarMenu}>Crear cuenta</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default BarraNavegacion;
