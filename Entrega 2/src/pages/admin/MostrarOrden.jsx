import { Link, useParams } from "react-router-dom";

import Boton from "../../components/Boton";
import DetalleCompra from "../../components/DetalleCompra";
import EncabezadoAdmin from "../../components/EncabezadoAdmin";
import EstadoOrden from "../../components/EstadoOrden";
import baseDatos from "../../data/baseDatos";
import { formatearFecha } from "../../utils/formato";

function MostrarOrden() {
  const { id } = useParams();
  const orden = baseDatos.obtenerOrden(id);

  if (!orden) return <p className="estado-vacio-admin">No encontramos esta orden.</p>;

  return (
    <>
      <EncabezadoAdmin titulo={`Boleta #${orden.id}`} descripcion={formatearFecha(orden.fecha)}>
        <Boton etiqueta="Imprimir" icono="printer" variante="oscuro" onClick={() => window.print()} />
        <Link to="/admin/ordenes" className="btn btn-outline-secondary">Volver</Link>
      </EncabezadoAdmin>

      <div className="panel-admin p-3 p-md-4 boleta">
        <p>Estado: <EstadoOrden estado={orden.estado} /></p>
        <DetalleCompra orden={orden} textoTotal={orden.estado === "pagada" ? "Total pagado" : "Total de la orden"} />
      </div>
    </>
  );
}

export default MostrarOrden;
