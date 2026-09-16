# Guía rápida para levantar el proyecto

Este proyecto es una página web estática hecha con HTML, CSS y JavaScript.

## 1) Abrir la carpeta del proyecto
Abre la carpeta que contiene el proyecto en tu editor de código (por ejemplo, VS Code).

## 2) Ejecutar el proyecto localmente
### Opción A: usando Python
Abre una terminal dentro de la carpeta del proyecto y ejecuta:

```powershell
cd "ruta/de/la/carpeta-del-proyecto"
python -m http.server 8000
```

Si la ruta real es por ejemplo `C:\proyectos\mi-web`, entonces debes escribir:

```powershell
cd "C:\proyectos\mi-web"
python -m http.server 8000
```

Luego abre este enlace en el navegador:

```text
http://localhost:8000
```

### Opción B: usando Live Server en VS Code
1. Abre la carpeta en Visual Studio Code.
2. Abre el archivo `index.html`.
3. Haz clic derecho y selecciona `Open with Live Server`.

## 3) Estructura principal
- `index.html` → página principal
- `productos.html` → catálogo de productos
- `login.html` → inicio de sesión
- `carrito.html` → carrito de compras
- `admin.html` → panel de administración
- `css/styles.css` → estilos del proyecto
- `js/` → scripts del sitio

## 4) Importante
No cambies la estructura de carpetas ni nombres de archivos si quieres que los enlaces funcionen correctamente.

## 5) Si quieres usar un navegador directo
Puedes abrir el archivo `index.html` directamente desde el explorador, pero si el proyecto usa scripts o carga recursos locales, la opción de servidor local es más confiable.

---

Proyecto: TecnoDUOC
