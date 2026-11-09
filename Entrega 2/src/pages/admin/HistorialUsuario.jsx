import { Link, useParams } from "react-router-dom";

import EncabezadoAdmin from "../../components/EncabezadoAdmin";
import TablaOrdenes from "../../components/TablaOrdenes";
import baseDatos from "../../data/baseDatos";

function HistorialUsuario() {
  const { id } = useParams();
  const usuario = baseDatos.obtenerUsuario(id);

  if (!usuario) return <p className="estado-vacio-admin">No encontramos este usuario.</p>;

  const ordenes = baseDatos.obtenerOrdenesPorCorreo(usuario.correo);

  return (
    <>
      <EncabezadoAdmin titulo="Historial de compras" descripcion={`${usuario.nombre} ${usuario.apellidos}, ${usuario.correo}`}>
        <Link to="/admin/usuarios" className="btn btn-outline-secondary">Volver a usuarios</Link>
      </EncabezadoAdmin>
      <TablaOrdenes ordenes={ordenes} />
    </>
  );
}

export default HistorialUsuario;
