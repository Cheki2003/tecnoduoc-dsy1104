import { useState } from "react";
import { Link } from "react-router-dom";

import Boton from "../../components/Boton";
import EncabezadoAdmin from "../../components/EncabezadoAdmin";
import baseDatos from "../../data/baseDatos";

function UsuariosAdmin({ usuarioActivo, onAviso }) {
  const [usuarios, setUsuarios] = useState(baseDatos.obtenerUsuarios());

  function eliminar(usuario) {
    if (!window.confirm(`¿Eliminar a ${usuario.nombre} ${usuario.apellidos}?`)) return;
    baseDatos.eliminarUsuario(usuario.id);
    setUsuarios(baseDatos.obtenerUsuarios());
    onAviso("Usuario eliminado.");
  }

  return (
    <>
      <EncabezadoAdmin titulo="Usuarios" descripcion={`${usuarios.length} cuentas registradas.`}>
        <Link to="/admin/usuarios/nuevo" className="btn btn-oscuro"><i className="bi bi-plus-lg me-2"></i>Nuevo usuario</Link>
      </EncabezadoAdmin>

      <div className="panel-admin table-responsive">
        <table className="table align-middle tabla-simple mb-0">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => {
              // el administrador no se puede borrar a si mismo
              const esElMismo = usuarioActivo && usuarioActivo.id === usuario.id;
              return (
                <tr key={usuario.id}>
                  <td className="fw-bold">{usuario.nombre} {usuario.apellidos}</td>
                  <td>{usuario.correo}</td>
                  <td>
                    <span className={`badge ${usuario.rol === "admin" ? "text-bg-warning" : "text-bg-light"}`}>{usuario.rol}</span>
                  </td>
                  <td className="text-end text-nowrap">
                    <Link to={`/admin/usuarios/${usuario.id}/historial`} className="btn btn-sm btn-outline-secondary me-2">Historial</Link>
                    <Link to={`/admin/usuarios/${usuario.id}/editar`} className="btn btn-sm btn-outline-secondary me-2">Editar</Link>
                    <Boton etiqueta="Eliminar" variante="outline-danger" className="btn-sm" deshabilitado={esElMismo} onClick={() => eliminar(usuario)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UsuariosAdmin;
