import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import Boton from "../../components/Boton";
import Imagen from "../../components/Imagen";
import ListaProductos from "../../components/ListaProductos";
import baseDatos from "../../data/baseDatos";
import { precioFinal } from "../../utils/carrito";
import { formatearPrecio } from "../../utils/formato";
import NoEncontrada from "./NoEncontrada";

function DetalleProducto({ onAgregar }) {
  const { id } = useParams();
  const [cantidad, setCantidad] = useState(1);
  const producto = baseDatos.obtenerProducto(id);

  if (!producto) return <NoEncontrada mensaje="Este producto ya no está disponible." />;

  const sinStock = producto.stock === 0;
  const relacionados = baseDatos
    .obtenerProductosPorCategoria(producto.categoria)
    .filter((p) => p.id !== producto.id)
    .slice(0, 4);

  return (
    <div className="container seccion">
      <nav aria-label="Ruta de navegación" className="migas">
        <Link to="/productos">Productos</Link>
        <i className="bi bi-chevron-right"></i>
        <span>{producto.nombre}</span>
      </nav>

      <div className="row g-4 g-lg-5 mb-5">
        <div className="col-md-6">
          <div className="detalle-foto">
            <Imagen src={producto.imagen} alt={producto.nombre} />
            {producto.descuento > 0 && <span className="etiqueta-descuento">-{producto.descuento}%</span>}
          </div>
        </div>

        <div className="col-md-6">
          <p className="tarjeta-categoria">{producto.categoria}</p>
          <h1 className="detalle-titulo">{producto.nombre}</h1>

          <div className="tarjeta-precios mb-3">
            <span className="precio precio-grande">{formatearPrecio(precioFinal(producto))}</span>
            {producto.descuento > 0 && <span className="precio-anterior">{formatearPrecio(producto.precio)}</span>}
          </div>

          <p className="detalle-texto">{producto.descripcion}</p>

          {producto.caracteristicas && producto.caracteristicas.length > 0 && (
            <ul className="lista-caracteristicas">
              {producto.caracteristicas.map((caracteristica) => (
                <li key={caracteristica}><i className="bi bi-check2"></i>{caracteristica}</li>
              ))}
            </ul>
          )}

          <p className={sinStock ? "text-danger fw-bold" : "aviso-disponible"}>
            {sinStock ? "Sin stock por ahora" : `${producto.stock} unidades disponibles`}
          </p>

          {!sinStock && (
            <div className="d-flex flex-wrap gap-3 align-items-center">
              <div className="selector-cantidad selector-grande" role="group" aria-label="Cantidad">
                <button type="button" aria-label="Quitar una unidad" disabled={cantidad <= 1} onClick={() => setCantidad(cantidad - 1)}>
                  <i className="bi bi-dash"></i>
                </button>
                <span data-testid="cantidad">{cantidad}</span>
                <button type="button" aria-label="Agregar una unidad" disabled={cantidad >= producto.stock} onClick={() => setCantidad(cantidad + 1)}>
                  <i className="bi bi-plus"></i>
                </button>
              </div>
              <Boton
                etiqueta="Agregar al carrito"
                icono="bag-plus"
                variante="oscuro"
                className="btn-lg flex-grow-1"
                onClick={() => onAgregar(producto, cantidad)}
              />
            </div>
          )}
        </div>
      </div>

      {relacionados.length > 0 && (
        <section>
          <div className="encabezado-seccion">
            <h2>También te puede interesar</h2>
          </div>
          <ListaProductos productos={relacionados} onAgregar={onAgregar} />
        </section>
      )}
    </div>
  );
}

export default DetalleProducto;
