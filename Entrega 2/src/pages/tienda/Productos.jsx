import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import ListaProductos from "../../components/ListaProductos";
import baseDatos from "../../data/baseDatos";
import { filtrarProductos, ordenarProductos } from "../../utils/filtros";

function Productos({ onAgregar }) {
  // el texto queda en la url para que funcione el buscador de la barra de navegacion
  const [parametros, setParametros] = useSearchParams();
  const [categoria, setCategoria] = useState("Todas");
  const [orden, setOrden] = useState("");
  const [soloOfertas, setSoloOfertas] = useState(false);

  const texto = parametros.get("buscar") || "";
  const categorias = baseDatos.obtenerCategorias();

  const filtrados = filtrarProductos(baseDatos.obtenerProductos(), { texto, categoria, soloOfertas });
  const productos = ordenarProductos(filtrados, orden);

  function cambiarTexto(evento) {
    const valor = evento.target.value;
    setParametros(valor ? { buscar: valor } : {}, { replace: true });
  }

  function limpiarFiltros() {
    setParametros({}, { replace: true });
    setCategoria("Todas");
    setOrden("");
    setSoloOfertas(false);
  }

  return (
    <div className="container seccion">
      <div className="titulo-pagina">
        <h1>Productos</h1>
        <p>Todo nuestro catálogo, con garantía y despacho a todo Chile.</p>
      </div>

      <div className="barra-filtros">
        <div className="row g-3 align-items-center">
          <div className="col-lg-5">
            <label htmlFor="filtro-texto" className="visually-hidden">Buscar por nombre</label>
            <input
              id="filtro-texto"
              type="search"
              className="form-control"
              placeholder="Buscar por nombre, por ejemplo teclado"
              value={texto}
              onChange={cambiarTexto}
            />
          </div>
          <div className="col-sm-6 col-lg-3">
            <label htmlFor="filtro-orden" className="visually-hidden">Ordenar por</label>
            <select id="filtro-orden" className="form-select" value={orden} onChange={(e) => setOrden(e.target.value)}>
              <option value="">Ordenar por</option>
              <option value="precio-menor">Menor precio</option>
              <option value="precio-mayor">Mayor precio</option>
              <option value="nombre">Nombre</option>
            </select>
          </div>
          <div className="col-sm-6 col-lg-4">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="filtro-ofertas"
                checked={soloOfertas}
                onChange={(e) => setSoloOfertas(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="filtro-ofertas">Solo productos en oferta</label>
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 mt-3">
          {["Todas", ...categorias.map((c) => c.nombre)].map((nombre) => (
            <button
              key={nombre}
              type="button"
              className={`chip ${categoria === nombre ? "activo" : ""}`}
              aria-pressed={categoria === nombre}
              onClick={() => setCategoria(nombre)}
            >
              {nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="contador-resultados mb-0">
          {productos.length} {productos.length === 1 ? "producto" : "productos"}
        </p>
        <button type="button" className="btn btn-link btn-sm" onClick={limpiarFiltros}>Limpiar filtros</button>
      </div>

      <ListaProductos
        productos={productos}
        onAgregar={onAgregar}
        mensajeVacio="No encontramos productos con esos filtros."
      />
    </div>
  );
}

export default Productos;
