/* 
   js/productos.js - Gestión del Catálogo de Productos (
    */

// Lista de productos por defecto iniciales
const productosIniciales = [
    {
        id: 1,
        nombre: "Notebook Gamer HP Victus 15",
        categoria: "Laptops",
        precio: 699990,
        imagen: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=60",
        descripcion: "Procesador Intel Core i5, 16GB RAM, SSD 512GB, Tarjeta RTX 3050. Ideal para estudio y gaming."
    },
    {
        id: 2,
        nombre: "MacBook Air M2 13.6\"",
        categoria: "Laptops",
        precio: 949990,
        imagen: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60",
        descripcion: "Chip M2 de Apple, 8GB RAM unificada, SSD 256GB, Pantalla Liquid Retina, Batería de 18 horas."
    },
    {
        id: 3,
        nombre: "Monitor Gamer ASUS TUF 27\" 165Hz",
        categoria: "Monitores",
        precio: 219990,
        imagen: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60",
        descripcion: "Resolución Full HD (1920x1080), 1ms de respuesta, FreeSync Premium y HDR10."
    },
    {
        id: 4,
        nombre: "Teclado Mecánico Redragon Kumara K552",
        categoria: "Periféricos",
        precio: 34990,
        imagen: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60",
        descripcion: "Switches Red silenciosos, retroiluminación RGB, chasis de aluminio resistente."
    },
    {
        id: 5,
        nombre: "Mouse Inalámbrico Logitech G305",
        categoria: "Periféricos",
        precio: 29990,
        imagen: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60",
        descripcion: "Sensor HERO de 12.000 DPI, tecnología Lightspeed ultrarrápida, batería de hasta 250h."
    },
    {
        id: 6,
        nombre: "Audífonos Gamer HyperX Cloud II",
        categoria: "Audio",
        precio: 64999,
        imagen: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=60",
        descripcion: "Sonido surround 7.1 virtual, almohadillas de memoria viscoelástica, micrófono con cancelación de ruido."
    }
];

// Obtener productos desde localStorage o cargar los iniciales
function obtenerProductos() {
    const productosGuardados = localStorage.getItem("tecnoduoc_productos");
    if (!productosGuardados) {
        localStorage.setItem("tecnoduoc_productos", JSON.stringify(productosIniciales));
        return productosIniciales;
    }
    return JSON.parse(productosGuardados);
}

// Renderizar tarjetas de productos en una vista (index o productos)
function renderizarProductos(lista, contenedorId, limite = 0) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;

    contenedor.innerHTML = "";

    const itemsAMostrar = limite > 0 ? lista.slice(0, limite) : lista;

    if (itemsAMostrar.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="fs-5 text-muted">No se encontraron productos que coincidan con la búsqueda.</p>
            </div>
        `;
        return;
    }

    itemsAMostrar.forEach(producto => {
        const col = document.createElement("div");
        col.className = "col-md-4 col-sm-6 mb-4";
        col.innerHTML = `
            <div class="card product-card">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body d-flex flex-column">
                    <span class="badge bg-secondary mb-2 align-self-start">${producto.categoria}</span>
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text text-muted small flex-grow-1">${producto.descripcion}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="product-price">$${producto.precio.toLocaleString("es-CL")}</span>
                        <button class="btn btn-sm btn-primary" onclick="agregarAlCarrito(${producto.id})">
                            <i class="bi bi-cart-plus me-1"></i> Agregar
                        </button>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(col);
    });
}

// Función global para agregar producto al carrito
function agregarAlCarrito(idProducto) {
    const productos = obtenerProductos();
    const productoEncontrado = productos.find(p => p.id === idProducto);
    if (!productoEncontrado) return;

    let carrito = JSON.parse(localStorage.getItem("tecnoduoc_carrito")) || [];
    
    // Verificar si el producto ya existe en el carrito
    const itemEnCarrito = carrito.find(item => item.id === idProducto);
    if (itemEnCarrito) {
        itemEnCarrito.cantidad += 1;
    } else {
        carrito.push({
            id: productoEncontrado.id,
            nombre: productoEncontrado.nombre,
            precio: productoEncontrado.precio,
            imagen: productoEncontrado.imagen,
            cantidad: 1
        });
    }

    localStorage.setItem("tecnoduoc_carrito", JSON.stringify(carrito));
    
    // Actualizar contador en la navbar
    if (typeof actualizarContadorCarrito === "function") {
        actualizarContadorCarrito();
    }

    // Alerta sencilla para informar al estudiante/usuario
    alert(`¡"${productoEncontrado.nombre}" fue añadido al carrito!`);
}
