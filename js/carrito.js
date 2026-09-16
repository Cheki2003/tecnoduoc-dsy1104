/* 
   js/carrito.js - Lógica del Carrito de Compras 
    */

document.addEventListener("DOMContentLoaded", () => {
    renderizarCarrito();
});

let descuentoAplicado = 0; // Porcentaje de descuento (0 a 1)

function renderizarCarrito() {
    const tbody = document.getElementById("carrito-tbody");
    const subtotalEl = document.getElementById("carrito-subtotal");
    const ivaEl = document.getElementById("carrito-iva");
    const descuentoEl = document.getElementById("carrito-descuento");
    const totalEl = document.getElementById("carrito-total");
    const vacioAlerta = document.getElementById("carrito-vacio-msg");
    const tablaContenedor = document.getElementById("carrito-tabla-container");

    if (!tbody) return;

    const carrito = JSON.parse(localStorage.getItem("tecnoduoc_carrito")) || [];

    if (carrito.length === 0) {
        if (vacioAlerta) vacioAlerta.style.display = "block";
        if (tablaContenedor) tablaContenedor.style.display = "none";
        return;
    } else {
        if (vacioAlerta) vacioAlerta.style.display = "none";
        if (tablaContenedor) tablaContenedor.style.display = "block";
    }

    tbody.innerHTML = "";

    let subtotalCalculado = 0;

    carrito.forEach(item => {
        const itemSubtotal = item.precio * item.cantidad;
        subtotalCalculado += itemSubtotal;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.imagen}" alt="${item.nombre}" style="width: 50px; height: 50px; object-fit: contain;" class="me-3 rounded">
                    <span class="fw-semibold">${item.nombre}</span>
                </div>
            </td>
            <td class="align-middle">$${item.precio.toLocaleString("es-CL")}</td>
            <td class="align-middle">
                <div class="input-group input-group-sm" style="width: 110px;">
                    <button class="btn btn-outline-secondary" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                    <span class="form-control text-center bg-white">${item.cantidad}</span>
                    <button class="btn btn-outline-secondary" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                </div>
            </td>
            <td class="align-middle fw-bold">$${itemSubtotal.toLocaleString("es-CL")}</td>
            <td class="align-middle text-center">
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarDelCarrito(${item.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Cálculos económicos
    const montoDescuento = subtotalCalculado * descuentoAplicado;
    const subtotalConDescuento = subtotalCalculado - montoDescuento;
    const ivaCalculado = subtotalConDescuento * 0.19; // IVA 19% en Chile
    const totalFinal = subtotalConDescuento + ivaCalculado;

    if (subtotalEl) subtotalEl.textContent = `$${Math.round(subtotalCalculado).toLocaleString("es-CL")}`;
    if (descuentoEl) descuentoEl.textContent = `-$${Math.round(montoDescuento).toLocaleString("es-CL")}`;
    if (ivaEl) ivaEl.textContent = `$${Math.round(ivaCalculado).toLocaleString("es-CL")}`;
    if (totalEl) totalEl.textContent = `$${Math.round(totalFinal).toLocaleString("es-CL")}`;
}

// Modificar la cantidad de un ítem
function cambiarCantidad(idProducto, cambio) {
    let carrito = JSON.parse(localStorage.getItem("tecnoduoc_carrito")) || [];
    const item = carrito.find(i => i.id === idProducto);
    
    if (item) {
        item.cantidad += cambio;
        if (item.cantidad <= 0) {
            carrito = carrito.filter(i => i.id !== idProducto);
        }
        localStorage.setItem("tecnoduoc_carrito", JSON.stringify(carrito));
        renderizarCarrito();
        actualizarContadorCarrito();
    }
}

// Eliminar un producto completo del carrito
function eliminarDelCarrito(idProducto) {
    let carrito = JSON.parse(localStorage.getItem("tecnoduoc_carrito")) || [];
    carrito = carrito.filter(i => i.id !== idProducto);
    localStorage.setItem("tecnoduoc_carrito", JSON.stringify(carrito));
    renderizarCarrito();
    actualizarContadorCarrito();
}

// Vaciar carrito por completo
function vaciarCarrito() {
    if (confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
        localStorage.removeItem("tecnoduoc_carrito");
        renderizarCarrito();
        actualizarContadorCarrito();
    }
}

// Aplicar cupón de descuento
function aplicarCupon() {
    const cuponInput = document.getElementById("cupon-input");
    const cuponMsg = document.getElementById("cupon-msg");

    if (!cuponInput) return;

    const codigo = cuponInput.value.trim().toUpperCase();
    if (codigo === "DUOC10") {
        descuentoAplicado = 0.10; // 10% de descuento
        cuponMsg.className = "text-success small mt-1";
        cuponMsg.textContent = "¡Cupón DUOC10 aplicado! 10% de descuento.";
    } else if (codigo === "DUOC20") {
        descuentoAplicado = 0.20; // 20% de descuento
        cuponMsg.className = "text-success small mt-1";
        cuponMsg.textContent = "¡Cupón DUOC20 aplicado! 20% de descuento especial.";
    } else {
        descuentoAplicado = 0;
        cuponMsg.className = "text-danger small mt-1";
        cuponMsg.textContent = "Cupón no válido. Intenta con DUOC10.";
    }

    renderizarCarrito();
}

// Simular el proceso de pago/checkout
function finalizarCompra() {
    const carrito = JSON.parse(localStorage.getItem("tecnoduoc_carrito")) || [];
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    const usuarioActivo = JSON.parse(localStorage.getItem("tecnoduoc_usuario_activo"));
    const nombreCliente = usuarioActivo ? usuarioActivo.nombre : "Estimado/a cliente";

    alert(`¡Gracias por tu compra en TecnoDUOC, ${nombreCliente}!\nTu pedido ha sido procesado exitosamente en esta demostración frontend.`);

    localStorage.removeItem("tecnoduoc_carrito");
    window.location.href = "index.html";
}
