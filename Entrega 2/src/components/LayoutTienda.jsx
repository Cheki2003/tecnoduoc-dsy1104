import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import BarraNavegacion from "./BarraNavegacion";
import PiePagina from "./PiePagina";

// estructura comun de la tienda. el Outlet es donde se dibuja cada pagina
function LayoutTienda({ usuario, carrito, onCerrarSesion }) {
  const { pathname } = useLocation();

  // al cambiar de pagina volvemos arriba
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="pagina">
      <BarraNavegacion usuario={usuario} carrito={carrito} onCerrarSesion={onCerrarSesion} />
      <main className="contenido">
        <Outlet />
      </main>
      <PiePagina />
    </div>
  );
}

export default LayoutTienda;
