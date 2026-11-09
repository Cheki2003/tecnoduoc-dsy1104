import { Navigate } from "react-router-dom";

// si no hay sesion manda al login, y si el rol no alcanza manda al inicio
function RutaProtegida({ usuario, rolRequerido, children }) {
  if (!usuario) return <Navigate to="/login" replace />;
  if (rolRequerido && usuario.rol !== rolRequerido) return <Navigate to="/" replace />;
  return children;
}

export default RutaProtegida;
