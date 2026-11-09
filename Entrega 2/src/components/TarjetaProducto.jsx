import { Link } from "react-router-dom";

import { precioFinal } from "../utils/carrito";
import { formatearPrecio } from "../utils/formato";
import Boton from "./Boton";
import Imagen from "./Imagen";

function TarjetaProducto({ producto, onAgregar }) {
  const sinStock = producto.stock === 0;
  const pocasUnidades = !sinStock && producto.stock <= 5;

  return (
    <article className="tarjeta-producto">
      <Link to={`/productos/${producto.id}`} className="tarjeta-foto">
        <Imagen src={producto.imagen} alt={producto.nombre} />
        {producto.descuento > 0 && <span className="etiqueta-descuento">-{producto.descuento}%</span>}
      </Link>

      <div className="tarjeta-cuerpo">
        <p className="tarjeta-categoria">{producto.categoria}</p>
        <h3 className="tarjeta-titulo">
          <Link to={`/productos/${producto.id}`}>{producto.nombre}</Link>
        </h3>

        <div className="tarjeta-precios">
          <span className="precio">{formatearPrecio(precioFinal(producto))}</span>
          {producto.descuento > 0 && <span className="precio-anterior">{formatearPrecio(producto.precio)}</span>}
        </div>

        {pocasUnidades && <p className="aviso-stock">Quedan {producto.stock} unidades</p>}

        <Boton
          etiqueta={sinStock ? "Sin stock" : "Agregar"}
          icono={sinStock ? "" : "bag-plus"}
          variante="oscuro"
          className="w-100 mt-auto"
          deshabilitado={sinStock}
          onClick={() => onAgregar(producto)}
        />
      </div>
    </article>
  );
}

export default TarjetaProducto;
