import { Link, useParams } from "react-router-dom";

import Boton from "../../components/Boton";
import DetalleCompra from "../../components/DetalleCompra";
import baseDatos from "../../data/baseDatos";
import { formatearFecha } from "../../utils/formato";
import NoEncontrada from "./NoEncontrada";

function CompraExitosa({ onAviso }) {
  const { id } = useParams();
  const orden = baseDatos.obtenerOrden(id);

  if (!orden) return <NoEncontrada mensaje="No encontramos esta compra." />;

  return (
    <div className="container seccion">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="panel-formulario boleta">
            <div className="resultado-compra exito">
              <i className="bi bi-check-circle-fill"></i>
              <div>
                <h1>Tu compra fue exitosa</h1>
                <p>Orden #{orden.id}, {formatearFecha(orden.fecha)}</p>
              </div>
            </div>

            <DetalleCompra orden={orden} />

            <div className="d-flex flex-wrap gap-2 justify-content-center mt-4 no-imprimir">
              <Boton etiqueta="Imprimir boleta" icono="printer" variante="oscuro" onClick={() => window.print()} />
              <Boton
                etiqueta="Enviar boleta por correo"
                icono="envelope"
                variante="outline-secondary"
                onClick={() => onAviso(`La boleta se envió a ${orden.cliente.correo} (simulado).`)}
              />
              <Link to="/productos" className="btn btn-link">Seguir comprando</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompraExitosa;
