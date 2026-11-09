import { useState } from "react";

// si la imagen no carga (por ejemplo sin internet) mostramos una de reemplazo
function Imagen({ src, alt, className = "" }) {
  const [fallo, setFallo] = useState(false);

  return (
    <img
      src={fallo || !src ? "/img/sin-imagen.svg" : src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFallo(true)}
    />
  );
}

export default Imagen;
