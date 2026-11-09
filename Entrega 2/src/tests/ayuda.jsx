// funciones de apoyo que usan varias pruebas

import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";

// muestra la ruta actual, asi las pruebas pueden revisar a donde navego la pagina
function RutaActual() {
  const { pathname } = useLocation();
  return <p data-testid="ruta-actual">{pathname}</p>;
}

// dibuja un componente dentro de un router de mentira, sin tocar la url real
export function renderConRouter(componente) {
  return render(<MemoryRouter>{componente}</MemoryRouter>);
}

// dibuja una pagina que depende de la url, por ejemplo /productos/:id
export function renderEnRuta(componente, patron, ruta) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path={patron} element={componente} />
        <Route path="*" element={<RutaActual />} />
      </Routes>
    </MemoryRouter>
  );
}

export const productoEjemplo = {
  id: 50,
  nombre: "Teclado de prueba",
  categoria: "Periféricos",
  precio: 10000,
  descuento: 0,
  stock: 10,
  imagen: "",
  descripcion: "Un teclado para probar",
  caracteristicas: ["Con cable"],
};

export const itemEjemplo = {
  id: 50,
  nombre: "Teclado de prueba",
  categoria: "Periféricos",
  imagen: "",
  precio: 10000,
  stock: 3,
  cantidad: 2,
};

export const ordenEjemplo = {
  cliente: { nombre: "Ana", apellidos: "Pérez", correo: "ana@duoc.cl" },
  direccion: { calle: "Calle 1", depto: "", region: "Región de Valparaíso", comuna: "Quilpué", indicaciones: "Tocar el timbre" },
  entrega: "despacho",
  items: [itemEjemplo],
  subtotal: 20000,
  descuento: 0,
  costoEnvio: 3990,
  total: 23990,
  estado: "pagada",
};
