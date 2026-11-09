import { useState } from "react";
import { Link } from "react-router-dom";

import Boton from "../../components/Boton";
import ItemCarrito from "../../components/ItemCarrito";
import ResumenTotales from "../../components/ResumenTotales";
import { buscarCupon, calcularTotales } from "../../utils/carrito";

function Carrito({ carrito, cupon, onCambiarCantidad, onQuitar, onVaciar, onCambiarCupon }) {
  const [codigo, setCodigo] = useState("");
  const [errorCupon, setErrorCupon] = useState("");

  function aplicarCupon(evento) {
    evento.preventDefault();
    const encontrado = buscarCupon(codigo);
    if (encontrado) {
      onCambiarCupon(encontrado);
      setErrorCupon("");
      setCodigo("");
    } else {
      setErrorCupon("Ese cupón no existe. Prueba con DUOC10.");
    }
  }

  function confirmarVaciar() {
    if (window.confirm("¿Quieres vaciar el carrito?")) onVaciar();
  }

  if (carrito.length === 0) {
    return (
      <div className="container seccion">
        <div className="estado-vacio">
          <i className="bi bi-bag-x"></i>
          <h1 className="titulo-formulario">Tu carrito está vacío</h1>
          <p>Mira nuestro catálogo y agrega lo que necesites.</p>
          <Link to="/productos" className="btn btn-oscuro">Ver productos</Link>
        </div>
      </div>
    );
  }

  const totales = calcularTotales(carrito, cupon);

  return (
    <div className="container seccion">
      <div className="titulo-pagina">
        <h1>Carrito de compras</h1>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="panel-formulario p-3 p-md-4">
            {carrito.map((item) => (
              <ItemCarrito key={item.id} item={item} onCambiarCantidad={onCambiarCantidad} onQuitar={onQuitar} />
            ))}
          </div>
          <div className="d-flex justify-content-between mt-3">
            <Link to="/productos" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left me-2"></i>Seguir comprando
            </Link>
            <Boton etiqueta="Vaciar carrito" variante="outline-danger" onClick={confirmarVaciar} />
          </div>
        </div>

        <div className="col-lg-4">
          <aside className="panel-formulario panel-resumen">
            <h2 className="subtitulo-panel">Resumen</h2>

            {cupon ? (
              <p className="cupon-aplicado">
                <span>Cupón {cupon.codigo}: {cupon.porcentaje}% menos</span>
                <button type="button" className="btn btn-link btn-sm p-0" onClick={() => onCambiarCupon(null)}>Quitar</button>
              </p>
            ) : (
              <form className="mb-3" onSubmit={aplicarCupon} noValidate>
                <label htmlFor="campo-cupon" className="form-label">¿Tienes un cupón?</label>
                <div className="input-group">
                  <input
                    id="campo-cupon"
                    type="text"
                    className={`form-control ${errorCupon ? "is-invalid" : ""}`}
                    placeholder="DUOC10"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                  />
                  <button type="submit" className="btn btn-outline-secondary">Aplicar</button>
                </div>
                {errorCupon && <div className="invalid-feedback d-block">{errorCupon}</div>}
              </form>
            )}

            <ResumenTotales subtotal={totales.subtotal} descuento={totales.descuento} total={totales.total} />

            <Link to="/checkout" className="btn btn-acento btn-lg w-100 mt-2">Continuar con la compra</Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Carrito;
