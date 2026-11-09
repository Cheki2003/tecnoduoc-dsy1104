import { formatearPrecio } from "../utils/formato";

function ResumenTotales({ subtotal, descuento = 0, costoEnvio = null, total, textoTotal = "Total" }) {
  return (
    <dl className="resumen-totales">
      <div>
        <dt>Subtotal</dt>
        <dd>{formatearPrecio(subtotal)}</dd>
      </div>
      {descuento > 0 && (
        <div className="texto-descuento">
          <dt>Descuento</dt>
          <dd>-{formatearPrecio(descuento)}</dd>
        </div>
      )}
      {costoEnvio !== null && (
        <div>
          <dt>Envío</dt>
          <dd>{costoEnvio === 0 ? "Gratis" : formatearPrecio(costoEnvio)}</dd>
        </div>
      )}
      <div className="resumen-total">
        <dt>{textoTotal}</dt>
        <dd data-testid="total">{formatearPrecio(total)}</dd>
      </div>
      <p className="resumen-iva">Precios con IVA incluido.</p>
    </dl>
  );
}

export default ResumenTotales;
