import { useState } from "react";

import EncabezadoAdmin from "../../components/EncabezadoAdmin";
import TablaOrdenes from "../../components/TablaOrdenes";
import baseDatos from "../../data/baseDatos";

function Ordenes() {
  const [estado, setEstado] = useState("todas");
  const ordenes = baseDatos.obtenerOrdenes();

  const visibles = estado === "todas" ? ordenes : ordenes.filter((orden) => orden.estado === estado);

  return (
    <>
      <EncabezadoAdmin titulo="Órdenes y boletas" descripcion="Todas las compras hechas en la tienda.">
        <label htmlFor="filtro-estado" className="visually-hidden">Filtrar por estado</label>
        <select id="filtro-estado" className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="todas">Todas</option>
          <option value="pagada">Pagadas</option>
          <option value="rechazada">Rechazadas</option>
        </select>
      </EncabezadoAdmin>

      <TablaOrdenes ordenes={[...visibles].reverse()} />
    </>
  );
}

export default Ordenes;
