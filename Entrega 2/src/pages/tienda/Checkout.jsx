import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import Boton from "../../components/Boton";
import CampoFormulario from "../../components/CampoFormulario";
import ResumenTotales from "../../components/ResumenTotales";
import SelectorRegion from "../../components/SelectorRegion";
import TablaProductosCompra from "../../components/TablaProductosCompra";
import baseDatos from "../../data/baseDatos";
import { calcularTotales, COSTO_DESPACHO } from "../../utils/carrito";
import { formatearPrecio } from "../../utils/formato";
import { hayErrores, validarCheckout } from "../../utils/validaciones";

// si hay sesion, los datos del usuario se completan solos
function armarDatosIniciales(usuario) {
  return {
    nombre: usuario ? usuario.nombre : "",
    apellidos: usuario ? usuario.apellidos : "",
    correo: usuario ? usuario.correo : "",
    calle: usuario ? usuario.calle : "",
    depto: usuario ? usuario.depto : "",
    region: usuario ? usuario.region : "",
    comuna: usuario ? usuario.comuna : "",
    indicaciones: "",
    entrega: "despacho",
  };
}

function Checkout({ usuario, carrito, cupon, onCompraExitosa }) {
  const navigate = useNavigate();
  const location = useLocation();

  // cuando vuelve de un pago rechazado trae los datos que ya habia escrito
  const datosAnteriores = location.state ? location.state.datos : null;
  const [datos, setDatos] = useState(datosAnteriores || armarDatosIniciales(usuario));
  const [errores, setErrores] = useState({});
  const [simularRechazo, setSimularRechazo] = useState(false);

  if (carrito.length === 0) return <Navigate to="/carrito" replace />;

  const esDespacho = datos.entrega === "despacho";
  const totales = calcularTotales(carrito, cupon, esDespacho ? COSTO_DESPACHO : 0);

  function cambiar(evento) {
    const { name, value } = evento.target;
    setDatos((anteriores) => ({ ...anteriores, [name]: value }));
  }

  function pagar(evento) {
    evento.preventDefault();
    const encontrados = validarCheckout(datos);
    setErrores(encontrados);
    if (hayErrores(encontrados)) return;

    const orden = baseDatos.crearOrden({
      cliente: { nombre: datos.nombre, apellidos: datos.apellidos, correo: datos.correo },
      direccion: {
        calle: datos.calle,
        depto: datos.depto,
        region: datos.region,
        comuna: datos.comuna,
        indicaciones: datos.indicaciones,
      },
      entrega: datos.entrega,
      items: carrito,
      ...totales,
      estado: simularRechazo ? "rechazada" : "pagada",
    });

    // el pago es simulado, el rechazo se elige con la casilla de abajo
    if (simularRechazo) {
      navigate(`/pago-error/${orden.id}`, { state: { datos } });
      return;
    }

    baseDatos.descontarStock(carrito);
    navigate(`/compra-exitosa/${orden.id}`);
    onCompraExitosa();
  }

  return (
    <div className="container seccion">
      <div className="titulo-pagina">
        <h1>Finalizar compra</h1>
        {!usuario && <p>Si tienes cuenta, inicia sesión y tus datos se completan solos.</p>}
      </div>

      <form onSubmit={pagar} noValidate>
        <div className="row g-4">
          <div className="col-lg-7">
            <section className="panel-formulario mb-4">
              <h2 className="subtitulo-panel">Información del cliente</h2>
              <div className="row">
                <div className="col-md-6">
                  <CampoFormulario etiqueta="Nombre" nombre="nombre" valor={datos.nombre} onChange={cambiar} error={errores.nombre} />
                </div>
                <div className="col-md-6">
                  <CampoFormulario etiqueta="Apellidos" nombre="apellidos" valor={datos.apellidos} onChange={cambiar} error={errores.apellidos} />
                </div>
              </div>
              <CampoFormulario etiqueta="Correo" nombre="correo" tipo="email" valor={datos.correo} onChange={cambiar} error={errores.correo} />
            </section>

            <section className="panel-formulario">
              <h2 className="subtitulo-panel">Entrega</h2>
              <div className="row g-2 mb-4">
                <div className="col-sm-6">
                  <label className={`opcion-entrega ${esDespacho ? "activa" : ""}`}>
                    <input type="radio" name="entrega" value="despacho" checked={esDespacho} onChange={cambiar} />
                    <span>
                      <strong>Despacho a domicilio</strong>
                      <small>{formatearPrecio(COSTO_DESPACHO)}, de 3 a 5 días hábiles</small>
                    </span>
                  </label>
                </div>
                <div className="col-sm-6">
                  <label className={`opcion-entrega ${!esDespacho ? "activa" : ""}`}>
                    <input type="radio" name="entrega" value="retiro" checked={!esDespacho} onChange={cambiar} />
                    <span>
                      <strong>Retiro en tienda</strong>
                      <small>Gratis, en la sede San Joaquín</small>
                    </span>
                  </label>
                </div>
              </div>

              {esDespacho && (
                <>
                  <div className="row">
                    <div className="col-md-8">
                      <CampoFormulario etiqueta="Calle y número" nombre="calle" valor={datos.calle} onChange={cambiar} error={errores.calle} />
                    </div>
                    <div className="col-md-4">
                      <CampoFormulario etiqueta="Depto (opcional)" nombre="depto" valor={datos.depto} onChange={cambiar} />
                    </div>
                  </div>
                  <SelectorRegion region={datos.region} comuna={datos.comuna} onChange={cambiar} errores={errores} />
                  <CampoFormulario
                    etiqueta="Indicaciones para la entrega (opcional)"
                    nombre="indicaciones"
                    tipo="textarea"
                    placeholder="Por ejemplo: dejar con el conserje"
                    valor={datos.indicaciones}
                    onChange={cambiar}
                  />
                </>
              )}
            </section>
          </div>

          <div className="col-lg-5">
            <aside className="panel-formulario panel-resumen">
              <h2 className="subtitulo-panel">Tu pedido</h2>
              <TablaProductosCompra items={carrito} compacta />
              <ResumenTotales
                subtotal={totales.subtotal}
                descuento={totales.descuento}
                costoEnvio={totales.costoEnvio}
                total={totales.total}
                textoTotal="Total a pagar"
              />

              <div className="form-check caja-simulacion">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="simular-rechazo"
                  checked={simularRechazo}
                  onChange={(e) => setSimularRechazo(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="simular-rechazo">
                  Simular pago rechazado (solo para la demostración)
                </label>
              </div>

              <Boton
                etiqueta={`Pagar ahora ${formatearPrecio(totales.total)}`}
                icono="lock-fill"
                tipo="submit"
                variante="acento"
                className="btn-lg w-100"
              />
            </aside>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
