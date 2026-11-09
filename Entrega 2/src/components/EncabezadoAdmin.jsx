// titulo de cada pagina del panel. en children vienen los botones de accion
function EncabezadoAdmin({ titulo, descripcion, children }) {
  return (
    <div className="encabezado-admin no-imprimir">
      <div>
        <h1>{titulo}</h1>
        {descripcion && <p>{descripcion}</p>}
      </div>
      {children && <div className="d-flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export default EncabezadoAdmin;
