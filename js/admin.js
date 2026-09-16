/* 
   js/admin.js - Panel Mantenedor de Productos y Usuarios 
   */

document.addEventListener("DOMContentLoaded", () => {
    verificarAccesoAdmin();
    renderizarTablaAdminProductos();
    renderizarTablaAdminUsuarios();

    const formProducto = document.getElementById("admin-form-producto");
    if (formProducto) {
        formProducto.addEventListener("submit", agregarNuevoProducto);
    }
});

// Verificar que solo un usuario con rol 'admin' pueda ingresar a esta vista
function verificarAccesoAdmin() {
    const usuarioActivo = JSON.parse(localStorage.getItem("tecnoduoc_usuario_activo"));
    if (!usuarioActivo || usuarioActivo.rol !== "admin") {
        alert("Acceso denegado: Esta sección requiere privilegios de Administrador.");
        window.location.href = "login.html";
    }
}

// Renderizar tabla de Productos en el Panel Admin
function renderizarTablaAdminProductos() {
    const tbody = document.getElementById("admin-tabla-productos");
    if (!tbody) return;

    const productos = JSON.parse(localStorage.getItem("tecnoduoc_productos")) || [];
    tbody.innerHTML = "";

    productos.forEach(prod => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${prod.id}</td>
            <td>
                <img src="${prod.imagen}" alt="${prod.nombre}" style="width: 40px; height: 40px; object-fit: contain;" class="me-2">
                ${prod.nombre}
            </td>
            <td><span class="badge bg-secondary">${prod.categoria}</span></td>
            <td class="fw-bold">$${prod.precio.toLocaleString("es-CL")}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarProductoAdmin(${prod.id})">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Renderizar tabla de Usuarios registrados
function renderizarTablaAdminUsuarios() {
    const tbody = document.getElementById("admin-tabla-usuarios");
    if (!tbody) return;

    const usuarios = JSON.parse(localStorage.getItem("tecnoduoc_usuarios")) || [];
    tbody.innerHTML = "";

    usuarios.forEach((usr, index) => {
        const tr = document.createElement("tr");
        const esAdmin = usr.rol === "admin";
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${usr.nombre}</td>
            <td>${usr.email}</td>
            <td>
                <span class="badge ${esAdmin ? 'bg-danger' : 'bg-primary'}">
                    ${usr.rol.toUpperCase()}
                </span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Agregar un nuevo producto desde el formulario Admin con validación JS
function agregarNuevoProducto(e) {
    e.preventDefault();

    const nombreInput = document.getElementById("prod-nombre");
    const categoriaInput = document.getElementById("prod-categoria");
    const precioInput = document.getElementById("prod-precio");
    const imagenInput = document.getElementById("prod-imagen");
    const descInput = document.getElementById("prod-desc");

    const errorMsg = document.getElementById("admin-prod-error");

    if (errorMsg) errorMsg.style.display = "none";

    // Validar que los campos no estén vacíos
    if (!nombreInput.value.trim() || !categoriaInput.value.trim() || !precioInput.value || !descInput.value.trim()) {
        if (errorMsg) {
            errorMsg.textContent = "Por favor, completa todos los campos obligatorios.";
            errorMsg.style.display = "block";
        }
        return;
    }

    const precioNum = parseInt(precioInput.value, 10);
    if (isNaN(precioNum) || precioNum <= 0) {
        if (errorMsg) {
            errorMsg.textContent = "Ingresa un precio válido mayor a 0.";
            errorMsg.style.display = "block";
        }
        return;
    }

    const productos = JSON.parse(localStorage.getItem("tecnoduoc_productos")) || [];
    
    // Generar nuevo ID único
    const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
    const urlImagen = imagenInput.value.trim() || "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=60";

    const nuevoProd = {
        id: nuevoId,
        nombre: nombreInput.value.trim(),
        categoria: categoriaInput.value.trim(),
        precio: precioNum,
        imagen: urlImagen,
        descripcion: descInput.value.trim()
    };

    productos.push(nuevoProd);
    localStorage.setItem("tecnoduoc_productos", JSON.stringify(productos));

    alert(`¡Producto "${nuevoProd.nombre}" agregado con éxito al catálogo!`);
    
    // Limpiar formulario y recargar tablas
    document.getElementById("admin-form-producto").reset();
    renderizarTablaAdminProductos();
}

// Eliminar un producto desde el panel Admin
function eliminarProductoAdmin(idProducto) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto del catálogo?")) {
        let productos = JSON.parse(localStorage.getItem("tecnoduoc_productos")) || [];
        productos = productos.filter(p => p.id !== idProducto);
        localStorage.setItem("tecnoduoc_productos", JSON.stringify(productos));
        renderizarTablaAdminProductos();
    }
}
