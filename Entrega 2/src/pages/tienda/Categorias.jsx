import { useParams } from "react-router-dom";

import ListaProductos from "../../components/ListaProductos";
import TarjetaCategoria from "../../components/TarjetaCategoria";
import baseDatos from "../../data/baseDatos";

function Categorias({ onAgregar }) {
  const { id } = useParams();
  const categorias = baseDatos.obtenerCategorias();

  // si la url no trae una categoria mostramos la primera
  const seleccionada = id ? baseDatos.obtenerCategoria(id) : categorias[0];
  const productos = seleccionada ? baseDatos.obtenerProductosPorCategoria(seleccionada.nombre) : [];

  return (
    <div className="container seccion">
      <div className="titulo-pagina">
        <h1>Categorías</h1>
        <p>Elige una categoría para ver sus productos.</p>
      </div>

      <div className="row row-cols-2 row-cols-lg-4 g-3 mb-5">
        {categorias.map((categoria) => (
          <div className="col" key={categoria.id}>
            <TarjetaCategoria categoria={categoria} activa={seleccionada && seleccionada.id === categoria.id} />
          </div>
        ))}
      </div>

      {seleccionada ? (
        <section>
          <div className="encabezado-seccion">
            <h2>{seleccionada.nombre}</h2>
            <span className="contador-resultados">{productos.length} productos</span>
          </div>
          <ListaProductos productos={productos} onAgregar={onAgregar} mensajeVacio="Todavía no hay productos en esta categoría." />
        </section>
      ) : (
        <p className="estado-vacio">Esa categoría no existe.</p>
      )}
    </div>
  );
}

export default Categorias;
