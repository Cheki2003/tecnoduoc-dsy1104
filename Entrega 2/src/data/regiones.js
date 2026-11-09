// regiones de chile con algunas de sus comunas principales

export const regiones = [
  { nombre: "Región de Arica y Parinacota", comunas: ["Arica", "Putre"] },
  { nombre: "Región de Tarapacá", comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte"] },
  { nombre: "Región de Antofagasta", comunas: ["Antofagasta", "Calama", "Tocopilla"] },
  { nombre: "Región de Atacama", comunas: ["Copiapó", "Caldera", "Vallenar"] },
  { nombre: "Región de Coquimbo", comunas: ["La Serena", "Coquimbo", "Ovalle"] },
  { nombre: "Región de Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio"] },
  {
    nombre: "Región Metropolitana de Santiago",
    comunas: ["Santiago", "Providencia", "Las Condes", "Ñuñoa", "La Florida", "Maipú", "Puente Alto", "San Joaquín", "Cerrillos", "Quilicura"],
  },
  { nombre: "Región de O'Higgins", comunas: ["Rancagua", "San Fernando", "Pichilemu"] },
  { nombre: "Región del Maule", comunas: ["Talca", "Curicó", "Linares"] },
  { nombre: "Región de Ñuble", comunas: ["Chillán", "San Carlos"] },
  { nombre: "Región del Biobío", comunas: ["Concepción", "Talcahuano", "Los Ángeles"] },
  { nombre: "Región de La Araucanía", comunas: ["Temuco", "Villarrica", "Angol"] },
  { nombre: "Región de Los Ríos", comunas: ["Valdivia", "La Unión"] },
  { nombre: "Región de Los Lagos", comunas: ["Puerto Montt", "Osorno", "Castro"] },
  { nombre: "Región de Aysén", comunas: ["Coyhaique", "Puerto Aysén"] },
  { nombre: "Región de Magallanes", comunas: ["Punta Arenas", "Puerto Natales"] },
];

export function obtenerComunas(nombreRegion) {
  const region = regiones.find((r) => r.nombre === nombreRegion);
  return region ? region.comunas : [];
}
