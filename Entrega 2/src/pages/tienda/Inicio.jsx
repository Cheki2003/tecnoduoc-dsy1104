import { Link } from "react-router-dom";

import Carrusel from "../../components/Carrusel";
import ListaProductos from "../../components/ListaProductos";
import TarjetaBlog from "../../components/TarjetaBlog";
import TarjetaCategoria from "../../components/TarjetaCategoria";
import baseDatos from "../../data/baseDatos";

const DIAPOSITIVAS = [
  {
    etiqueta: "Equipos para estudiar y jugar",
    titulo: "Tu próximo notebook te está esperando",
    texto: "Modelos para programar, editar y jugar, con descuentos para la comunidad estudiantil.",
    imagen: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&auto=format&fit=crop&q=75",
    enlace: "/categorias/1",
    textoBoton: "Ver laptops",
  },
  {
    etiqueta: "Arma tu escritorio",
    titulo: "Monitores y periféricos que se notan",
    texto: "Pantallas de alta frecuencia y teclados mecánicos para trabajar más cómodo.",
    imagen: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&auto=format&fit=crop&q=75",
    enlace: "/categorias/3",
    textoBoton: "Ver periféricos",
  },
  {
    etiqueta: "Ofertas de la semana",
    titulo: "Hasta 30% de descuento en audio",
    texto: "Audífonos y parlantes para tus clases online, tu música y tus streams.",
    imagen: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1600&auto=format&fit=crop&q=75",
    enlace: "/ofertas",
    textoBoton: "Ver ofertas",
  },
];

const BENEFICIOS = [
  { icono: "truck", titulo: "Despacho a todo Chile", texto: "O retira gratis en la sede." },
  { icono: "shield-check", titulo: "12 meses de garantía", texto: "En todos los productos." },
  { icono: "credit-card", titulo: "Pago simulado", texto: "Proyecto de prueba, sin cobros reales." },
];

function Inicio({ onAgregar }) {
  const destacados = baseDatos.obtenerDestacados();
  const categorias = baseDatos.obtenerCategorias();
  const entradas = baseDatos.obtenerEntradasBlog().slice(0, 3);

  return (
    <>
      <Carrusel diapositivas={DIAPOSITIVAS} />

      <section className="franja-beneficios" aria-label="Beneficios">
        <div className="container">
          <div className="row g-3">
            {BENEFICIOS.map((beneficio) => (
              <div className="col-md-4" key={beneficio.titulo}>
                <div className="beneficio">
                  <i className={`bi bi-${beneficio.icono}`}></i>
                  <div>
                    <strong>{beneficio.titulo}</strong>
                    <span>{beneficio.texto}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="seccion">
        <div className="container">
          <div className="encabezado-seccion">
            <h2>Compra por categoría</h2>
            <Link to="/categorias" className="enlace-flecha">Ver todas <i className="bi bi-arrow-right"></i></Link>
          </div>
          <div className="row row-cols-2 row-cols-lg-4 g-3">
            {categorias.map((categoria) => (
              <div className="col" key={categoria.id}>
                <TarjetaCategoria categoria={categoria} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="seccion pt-0">
        <div className="container">
          <div className="encabezado-seccion">
            <h2>Los más elegidos</h2>
            <Link to="/productos" className="enlace-flecha">Ver catálogo <i className="bi bi-arrow-right"></i></Link>
          </div>
          <ListaProductos productos={destacados} onAgregar={onAgregar} />
        </div>
      </section>

      <section className="banner-cupon">
        <div className="container d-md-flex align-items-center justify-content-between gap-4">
          <div>
            <p className="etiqueta-seccion">Solo para estudiantes</p>
            <h2>10% de descuento con el cupón DUOC10</h2>
            <p className="mb-md-0">Lo ingresas en el carrito y se aplica al tiro a toda tu compra.</p>
          </div>
          <Link to="/ofertas" className="btn btn-acento btn-lg flex-shrink-0">Ver ofertas</Link>
        </div>
      </section>

      <section className="seccion">
        <div className="container">
          <div className="encabezado-seccion">
            <h2>Desde el blog</h2>
            <Link to="/blog" className="enlace-flecha">Ver todas <i className="bi bi-arrow-right"></i></Link>
          </div>
          <div className="row g-4">
            {entradas.map((entrada) => (
              <div className="col-md-4" key={entrada.id}>
                <TarjetaBlog entrada={entrada} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Inicio;
