import ResumenTotales from "./ResumenTotales";
import TablaProductosCompra from "./TablaProductosCompra";

// muestra los datos de una orden. lo comparten compra exitosa, pago con error y el admin
function DetalleCompra({ orden, textoTotal = "Total pagado" }) {
  const { cliente, direccion } = orden;
  const esDespacho = orden.entrega === "despacho";

  return (
    <>
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="bloque-datos">
            <h2>Cliente</h2>
            <p>{cliente.nombre} {cliente.apellidos}</p>
            <p>{cliente.correo}</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="bloque-datos">
            <h2>{esDespacho ? "Despacho a domicilio" : "Retiro en tienda"}</h2>
            {esDespacho ? (
              <>
                <p>{direccion.calle}{direccion.depto ? `, ${direccion.depto}` : ""}</p>
                <p>{direccion.comuna}, {direccion.region}</p>
                {direccion.indicaciones && <p className="text-muted">{direccion.indicaciones}</p>}
              </>
            ) : (
              <p>Duoc UC, sede San Joaquín</p>
            )}
          </div>
        </div>
      </div>

      <TablaProductosCompra items={orden.items} />

      <div className="row justify-content-end">
        <div className="col-md-6 col-lg-5">
          <ResumenTotales
            subtotal={orden.subtotal}
            descuento={orden.descuento}
            costoEnvio={orden.costoEnvio}
            total={orden.total}
            textoTotal={textoTotal}
          />
        </div>
      </div>
    </>
  );
}

export default DetalleCompra;
