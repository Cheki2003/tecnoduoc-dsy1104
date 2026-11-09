import ListaProductos from "../../components/ListaProductos";
import baseDatos from "../../data/baseDatos";

function Ofertas({ onAgregar }) {
  const ofertas = baseDatos.obtenerOfertas();

  return (
    <>
      <section className="cabecera-ofertas">
        <div className="container">
          <p className="etiqueta-seccion">Precios rebajados</p>
          <h1>Ofertas</h1>
          <p>Productos con descuento mientras dure el stock. Y si quieres ahorrar más, suma el cupón DUOC10 en el carrito.</p>
        </div>
      </section>
      <div className="container seccion">
        <ListaProductos productos={ofertas} onAgregar={onAgregar} mensajeVacio="Por ahora no hay productos en oferta." />
      </div>
    </>
  );
}

export default Ofertas;
