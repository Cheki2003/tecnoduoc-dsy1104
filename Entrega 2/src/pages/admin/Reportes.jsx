import BarraProgreso from "../../components/BarraProgreso";
import EncabezadoAdmin from "../../components/EncabezadoAdmin";
import TarjetaEstadistica from "../../components/TarjetaEstadistica";
import baseDatos from "../../data/baseDatos";
import { formatearPrecio } from "../../utils/formato";
import { calcularResumenVentas, ventasPorCategoria } from "../../utils/reportes";

function Reportes() {
  const ordenes = baseDatos.obtenerOrdenes();
  const resumen = calcularResumenVentas(ordenes);
  const porCategoria = ventasPorCategoria(ordenes);

  return (
    <>
      <EncabezadoAdmin titulo="Reportes de ventas" descripcion="Solo se consideran las órdenes pagadas." />

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <TarjetaEstadistica titulo="Total vendido" valor={formatearPrecio(resumen.totalVendido)} icono="cash-stack" color="azul" />
        </div>
        <div className="col-md-4">
          <TarjetaEstadistica titulo="Compra promedio" valor={formatearPrecio(resumen.promedio)} icono="graph-up" color="dorado" />
        </div>
        <div className="col-md-4">
          <TarjetaEstadistica
            titulo="Órdenes pagadas"
            valor={resumen.cantidadPagadas}
            detalle={`${resumen.cantidadRechazadas} rechazadas`}
            icono="receipt"
            color="celeste"
          />
        </div>
      </div>

      <div className="panel-admin p-3 p-md-4">
        <h2 className="subtitulo-panel">Ventas por categoría</h2>
        {porCategoria.length === 0 && <p className="text-muted">Todavía no hay ventas.</p>}
        {porCategoria.map((fila) => (
          <BarraProgreso
            key={fila.categoria}
            etiqueta={fila.categoria}
            texto={formatearPrecio(fila.total)}
            valor={Math.round((fila.total / porCategoria[0].total) * 100)}
          />
        ))}
      </div>
    </>
  );
}

export default Reportes;
