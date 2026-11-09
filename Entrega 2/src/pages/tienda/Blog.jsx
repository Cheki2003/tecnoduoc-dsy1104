import TarjetaBlog from "../../components/TarjetaBlog";
import baseDatos from "../../data/baseDatos";

function Blog() {
  const entradas = baseDatos.obtenerEntradasBlog();

  return (
    <div className="container seccion">
      <div className="titulo-pagina">
        <h1>Blog</h1>
        <p>Consejos para elegir tu equipo y armar tu lugar de estudio.</p>
      </div>
      <div className="row g-4">
        {entradas.map((entrada) => (
          <div className="col-md-6 col-lg-4" key={entrada.id}>
            <TarjetaBlog entrada={entrada} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blog;
