// cada validar... recibe los datos del formulario y devuelve un objeto con los errores.
// si el objeto viene vacio, significa que esta todo bien.

export function correoValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
}

export function hayErrores(errores) {
  return Object.keys(errores).length > 0;
}

function campoVacio(valor) {
  return !valor || String(valor).trim() === "";
}

export function validarLogin({ correo, clave }) {
  const errores = {};
  if (campoVacio(correo)) errores.correo = "Ingresa tu correo.";
  else if (!correoValido(correo)) errores.correo = "El correo no tiene un formato válido.";
  if (campoVacio(clave)) errores.clave = "Ingresa tu contraseña.";
  else if (clave.length < 6) errores.clave = "La contraseña debe tener al menos 6 caracteres.";
  return errores;
}

export function validarUsuario(datos, { pedirClave = true } = {}) {
  const errores = {};
  if (campoVacio(datos.nombre)) errores.nombre = "Ingresa el nombre.";
  if (campoVacio(datos.apellidos)) errores.apellidos = "Ingresa los apellidos.";
  if (campoVacio(datos.correo)) errores.correo = "Ingresa el correo.";
  else if (!correoValido(datos.correo)) errores.correo = "El correo no tiene un formato válido.";

  // al editar la clave es opcional, solo se revisa si escribieron algo
  if (pedirClave || !campoVacio(datos.clave)) {
    if (campoVacio(datos.clave)) errores.clave = "Ingresa una contraseña.";
    else if (datos.clave.length < 6) errores.clave = "Debe tener al menos 6 caracteres.";
    if (datos.confirmar !== datos.clave) errores.confirmar = "Las contraseñas no coinciden.";
  }
  return errores;
}

export function validarProducto(datos) {
  const errores = {};
  if (campoVacio(datos.nombre)) errores.nombre = "Ingresa el nombre del producto.";
  if (campoVacio(datos.categoria)) errores.categoria = "Selecciona una categoría.";
  if (campoVacio(datos.descripcion)) errores.descripcion = "Agrega una descripción.";

  const precio = Number(datos.precio);
  if (campoVacio(datos.precio) || isNaN(precio) || precio <= 0) {
    errores.precio = "El precio debe ser mayor a 0.";
  }

  const stock = Number(datos.stock);
  if (campoVacio(datos.stock) || isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
    errores.stock = "El stock debe ser un número entero, 0 o más.";
  }

  const descuento = Number(datos.descuento || 0);
  if (isNaN(descuento) || descuento < 0 || descuento > 90) {
    errores.descuento = "El descuento debe estar entre 0 y 90.";
  }
  return errores;
}

export function validarCategoria(datos) {
  const errores = {};
  if (campoVacio(datos.nombre)) errores.nombre = "Ingresa el nombre de la categoría.";
  if (campoVacio(datos.descripcion)) errores.descripcion = "Agrega una descripción.";
  return errores;
}

export function validarCheckout(datos) {
  const errores = {};
  if (campoVacio(datos.nombre)) errores.nombre = "Ingresa tu nombre.";
  if (campoVacio(datos.apellidos)) errores.apellidos = "Ingresa tus apellidos.";
  if (campoVacio(datos.correo)) errores.correo = "Ingresa tu correo.";
  else if (!correoValido(datos.correo)) errores.correo = "El correo no tiene un formato válido.";

  // si retira en tienda no necesitamos la direccion
  if (datos.entrega === "despacho") {
    if (campoVacio(datos.calle)) errores.calle = "Ingresa la calle y el número.";
    if (campoVacio(datos.region)) errores.region = "Selecciona una región.";
    if (campoVacio(datos.comuna)) errores.comuna = "Selecciona una comuna.";
  }
  return errores;
}

export function validarContacto(datos) {
  const errores = {};
  if (campoVacio(datos.nombre)) errores.nombre = "Ingresa tu nombre.";
  if (campoVacio(datos.correo)) errores.correo = "Ingresa tu correo.";
  else if (!correoValido(datos.correo)) errores.correo = "El correo no tiene un formato válido.";
  if (campoVacio(datos.mensaje)) errores.mensaje = "Escribe tu mensaje.";
  else if (datos.mensaje.trim().length < 10) errores.mensaje = "El mensaje debe tener al menos 10 caracteres.";
  return errores;
}
