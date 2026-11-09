import { Link, useLocation, useParams } from "react-router-dom";

import DetalleCompra from "../../components/DetalleCompra";
import baseDatos from "../../data/baseDatos";
import { formatearFecha } from "../../utils/formato";
import NoEncontrada from "./NoEncontrada";

function PagoError() {
  const { id } = useParams();
  const location = useLocation();
  const orden = baseDatos.obtenerOrden(id);

  if (!orden) return <NoEncontrada mensaje="No encontramos esta compra." />;

  // devolvemos los datos al checkout para que no tenga que escribirlos otra vez
  const datosAnteriores = location.state ? location.state.datos : null;

  return (
    <div className="container seccion">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="panel-formulario">
            <div className="resultado-compra error">
              <i className="bi bi-x-circle-fill"></i>
              <div>
                <h1>No se pudo realizar el pago</h1>
                <p>Orden #{orden.id}, {formatearFecha(orden.fecha)}. No se hizo ningún cobro y tu carrito sigue guardado.</p>
              </div>
            </div>

            <div className="text-center mb-4">
              <Link to="/checkout" state={{ datos: datosAnteriores }} className="btn btn-oscuro btn-lg">
                <i className="bi bi-arrow-repeat me-2"></i>Volver a realizar el pago
              </Link>
            </div>

            <DetalleCompra orden={orden} textoTotal="Total de la orden" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PagoError;
