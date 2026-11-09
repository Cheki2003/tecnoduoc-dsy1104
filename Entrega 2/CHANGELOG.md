# Changelog

## 2.0.0 - Segunda entrega

Esta versión continúa la tienda estática de la primera entrega y la migra a una aplicación React con navegación por rutas.

### Añadido

- Catálogo con búsqueda y navegación por productos, categorías, ofertas y detalle de producto.
- Registro e inicio de sesión, con rutas administrativas protegidas por rol.
- Carrito persistente en `localStorage`, gestión de cantidades y cupones de descuento.
- Proceso de checkout con confirmación de compra y vista para pagos rechazados.
- Secciones de nosotros, contacto y blog con vista de artículos.
- Panel de administración con dashboard, gestión de productos, categorías y usuarios, además de órdenes, historial y reportes.
- Alertas, formularios reutilizables y páginas para rutas inexistentes.
- Pruebas automatizadas con Jasmine y Karma, incluyendo reporte de cobertura.

### Cambiado

- La interfaz pasó de páginas HTML independientes con lógica en JavaScript a componentes React y rutas con React Router.
- La ejecución ahora usa Vite (`npm install` y `npm run dev`) en lugar de un servidor estático.
- Los datos continúan siendo locales al navegador mediante `localStorage`; esta entrega no incorpora backend.

### Conservado

- La tienda mantiene el catálogo, el carrito, el acceso de usuarios, el panel administrativo y el diseño adaptable de la primera entrega, ahora ampliados dentro de la aplicación React.