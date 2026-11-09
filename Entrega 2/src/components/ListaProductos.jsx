import TarjetaProducto from "./TarjetaProducto";

function ListaProductos({ productos, onAgregar, mensajeVacio = "No encontramos productos." }) {
  if (productos.length === 0) {
    return (
      <div className="estado-vacio">
        <i className="bi bi-search"></i>
        <p>{mensajeVacio}</p>
      </div>
    );
  }

  // en celular se ven 2 por fila, en tablet 3 y en escritorio 4
  return (
    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 g-lg-4">
      {productos.map((producto) => (
        <div className="col" key={producto.id}>
          <TarjetaProducto producto={producto} onAgregar={onAgregar} />
        </div>
      ))}
    </div>
  );
}

export default ListaProductos;
