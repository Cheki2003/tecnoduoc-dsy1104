import { obtenerComunas, regiones } from "../data/regiones";
import CampoSelect from "./CampoSelect";

// las comunas dependen de la region elegida
function SelectorRegion({ region, comuna, onChange, errores = {} }) {
  function cambiarRegion(evento) {
    onChange(evento);
    // al cambiar la region la comuna anterior ya no sirve
    onChange({ target: { name: "comuna", value: "" } });
  }

  return (
    <div className="row">
      <div className="col-md-6">
        <CampoSelect
          etiqueta="Región"
          nombre="region"
          valor={region}
          onChange={cambiarRegion}
          opciones={regiones.map((r) => r.nombre)}
          error={errores.region}
        />
      </div>
      <div className="col-md-6">
        <CampoSelect
          etiqueta="Comuna"
          nombre="comuna"
          valor={comuna}
          onChange={onChange}
          opciones={obtenerComunas(region)}
          error={errores.comuna}
          textoInicial={region ? "Selecciona" : "Primero elige una región"}
          deshabilitado={!region}
        />
      </div>
    </div>
  );
}

export default SelectorRegion;
