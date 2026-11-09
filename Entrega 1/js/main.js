/* 
   js/main.js - Lógica General del Sitio Web y Estado de Sesión (TecnoDUOC)
    */

document.addEventListener("DOMContentLoaded", () => {
    actualizarNavbar();
    actualizarContadorCarrito();
});

// Función para actualizar el estado del Navbar dinámicamente según sesión
function actualizarNavbar() {
    const usuarioActivo = JSON.parse(localStorage.getItem("tecnoduoc_usuario_activo"));
    const navUsuarioContenedor = document.getElementById("nav-usuario-info");
    const linkAdminContenedor = document.getElementById("link-admin-item");

    if (!navUsuarioContenedor) return;

    if (usuarioActivo) {
        // Si hay usuario logueado
        navUsuarioContenedor.innerHTML = `
            <span class="navbar-text me-3 text-light">
                <i class="bi bi-person-circle text-warning me-1"></i> ${usuarioActivo.nombre || usuarioActivo.email}
            </span>
            <button class="btn btn-outline-light btn-sm" onclick="cerrarSesion()">
                <i class="bi bi-box-arrow-right me-1"></i> Salir
            </button>
        `;

        // Mostrar u ocultar el link del Mantenedor Admin si el rol es Admin
        if (linkAdminContenedor) {
            if (usuarioActivo.rol === "admin") {
                linkAdminContenedor.style.display = "block";
            } else {
                linkAdminContenedor.style.display = "none";
            }
        }
    } else {
        // Si no hay usuario logueado
        navUsuarioContenedor.innerHTML = `
            <a href="login.html" class="btn btn-outline-warning btn-sm fw-bold">
                <i class="bi bi-person-lock me-1"></i> Iniciar Sesión
            </a>
        `;
        if (linkAdminContenedor) {
            linkAdminContenedor.style.display = "none";
        }
    }
}

// Función para actualizar el badge de cantidad de ítems en el carrito
function actualizarContadorCarrito() {
    const contadorBadge = document.getElementById("cart-count");
    if (!contadorBadge) return;

    const carrito = JSON.parse(localStorage.getItem("tecnoduoc_carrito")) || [];
    const totalUnidades = carrito.reduce((acum, item) => acum + item.cantidad, 0);

    contadorBadge.textContent = totalUnidades;
}

// Función para cerrar la sesión del usuario
function cerrarSesion() {
    localStorage.removeItem("tecnoduoc_usuario_activo");
    alert("Has cerrado sesión correctamente.");
    window.location.href = "index.html";
}
