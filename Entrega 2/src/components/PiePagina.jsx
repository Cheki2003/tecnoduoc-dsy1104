import { Link } from "react-router-dom";

function PiePagina() {
  return (
    <footer className="pie-pagina no-imprimir">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-5">
            <p className="marca mb-2"><i className="bi bi-cpu-fill"></i>Tecno<span>DUOC</span></p>
            <p className="pie-texto">
              Tienda online de tecnología hecha para la asignatura Desarrollo Fullstack II (DSY1104).
              Frontend construido con React y Bootstrap.
            </p>
          </div>
          <div className="col-6 col-md-3">
            <h2 className="pie-titulo">Tienda</h2>
            <ul className="list-unstyled pie-lista">
              <li><Link to="/productos">Productos</Link></li>
              <li><Link to="/categorias">Categorías</Link></li>
              <li><Link to="/ofertas">Ofertas</Link></li>
              <li><Link to="/carrito">Mi carrito</Link></li>
            </ul>
          </div>
          <div className="col-12 col-sm-6 col-md-4">
            <h2 className="pie-titulo">Contacto</h2>
            <ul className="list-unstyled pie-lista">
              <li><i className="bi bi-geo-alt me-2"></i>Duoc UC, sede San Joaquín</li>
              <li><i className="bi bi-envelope me-2"></i>soporte@tecnoduoc.cl</li>
              <li><i className="bi bi-telephone me-2"></i>+56 9 1234 5678</li>
            </ul>
          </div>
        </div>
        <p className="pie-final">TecnoDUOC 2026. Proyecto académico, Evaluación Parcial N° 2.</p>
      </div>
    </footer>
  );
}

export default PiePagina;
