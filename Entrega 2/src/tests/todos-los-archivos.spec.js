// carga todos los archivos del proyecto, asi el reporte de cobertura tambien cuenta
// los que ninguna prueba usa, y el porcentaje no sale inflado
const archivos = require.context("..", true, /^\.\/(?!tests\/|main\.jsx).*\.jsx?$/);

describe("proyecto completo", () => {
  it("todos los archivos se pueden importar sin errores", () => {
    expect(() => archivos.keys().forEach(archivos)).not.toThrow();
    expect(archivos.keys().length).toBeGreaterThan(40);
  });
});
