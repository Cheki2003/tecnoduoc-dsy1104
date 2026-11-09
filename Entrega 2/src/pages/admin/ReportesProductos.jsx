import { Link } from "react-router-dom";

import BarraProgreso from "../../components/BarraProgreso";
import EncabezadoAdmin from "../../components/EncabezadoAdmin";
import TarjetaEstadistica from "../../components/TarjetaEstadistica";
import baseDatos from "../../data/baseDatos";
import { formatearPrecio } from "../../utils/formato";
import { calcularValorInventario, productosMasVendidos, stockPorCategoria } from "../../utils/reportes";

function ReportesProductos() {
  const productos = baseDatos.obtenerProductos();
  const stock = stockPorCategoria(productos);
  const masVendidos = productosMasVendidos(baseDatos.obtenerOrdenes());
  const stockTotal = stock.reduce((suma, fila) => suma + fila.stock, 0);

  return (
    <>
      <EncabezadoAdmin titulo="Reportes de productos" descripcion="Cómo está el inventario y qué se vende más.">
        <Link to="/admin/productos" className="btn btn-outline-secondary">Volver a productos</Link>
      </EncabezadoAdmin>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <TarjetaEstadistica titulo="Unidades en bodega" valor={stockTotal} icono="boxes" color="azul" />
        </div>
        <div className="col-md-6">
          <TarjetaEstadistica titulo="Valor del inventario" valor={formatearPrecio(calcularValorInventario(productos))} icono="cash-stack" color="dorado" />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="panel-admin p-3 p-md-4 h-100">
            <h2 className="subtitulo-panel">Stock por categoría</h2>
            {stock.map((fila) => (
              <BarraProgreso
                key={fila.categoria}
                etiqueta={fila.categoria}
                texto={`${fila.stock} unidades`}
                valor={stockTotal > 0 ? Math.round((fila.stock / stockTotal) * 100) : 0}
              />
            ))}
          </div>
        </div>
        <div className="col-lg-6">
          <div className="panel-admin p-3 p-md-4 h-100">
            <h2 className="subtitulo-panel">Más vendidos</h2>
            {masVendidos.length === 0 && <p className="text-muted">Todavía no hay ventas.</p>}
            <ol className="lista-ranking">
              {masVendidos.map((fila) => (
                <li key={fila.nombre}>
                  <span>{fila.nombre}</span>
                  <strong>{fila.cantidad} un.</strong>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReportesProductos;
