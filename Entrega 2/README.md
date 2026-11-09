# TecnoDUOC

Tienda online de tecnología hecha para la asignatura Desarrollo Fullstack II (DSY1104), Evaluación Parcial 2.
Es la continuación de la página en HTML de la primera entrega, ahora migrada a React.

## Qué se necesita

- Node.js 18 o más nuevo
- Google Chrome (solo para correr las pruebas)

## Cómo ejecutarlo

Instalar las dependencias (solo la primera vez):

```
npm install
```

Levantar la página, que queda en http://localhost:5173:

```
npm run dev
```

## Cómo correr las pruebas

Corre todas las pruebas una vez y genera el reporte de cobertura en `coverage/html/index.html`:

```
npm test
```

Deja Karma abierto en Chrome y repite las pruebas cada vez que se guarda un archivo:

```
npm run test:watch
```

## Cuentas de prueba

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administrador | admin@duoc.cl | admin123 |
| Usuario | estudiante@duoc.cl | user123 |

Los cupones de descuento son `DUOC10` y `DUOC20`.

Para ver la pantalla de pago rechazado hay que marcar la casilla "Simular pago rechazado" en el checkout.

## Cómo está ordenado

```
src/
  App.jsx          rutas y estado compartido (sesión, carrito, cupón)
  components/      piezas reutilizables (tarjetas, formularios, tablas)
  pages/tienda/    vistas públicas
  pages/admin/     vistas del panel de administración
  data/            baseDatos.js es la base de datos simulada, con el CRUD
  utils/           funciones de cálculo y validación
  styles/          hoja de estilos del proyecto
  tests/           pruebas con Jasmine
```

## Changelog

Consulta el [changelog](CHANGELOG.md) para ver los cambios de esta versión respecto de la primera entrega.

Como todavía no hay backend, los datos se guardan en el localStorage del navegador.
Para volver a los datos iniciales basta con borrar el localStorage del sitio.
