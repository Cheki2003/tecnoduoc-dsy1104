/* 
   js/login.js - Validaciones en JS y Control de Inicio de Sesión / Registro
    */

document.addEventListener("DOMContentLoaded", () => {
    inicializarUsuariosPorDefecto();

    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    if (loginForm) {
        loginForm.addEventListener("submit", procesarLogin);
    }

    if (registerForm) {
        registerForm.addEventListener("submit", procesarRegistro);
    }
});

// Inicializar lista de usuarios registrada si no existe en localStorage
function inicializarUsuariosPorDefecto() {
    if (!localStorage.getItem("tecnoduoc_usuarios")) {
        const usuariosIniciales = [
            { nombre: "Administrador Duoc", email: "admin@duoc.cl", password: "admin123", rol: "admin" },
            { nombre: "Estudiante Ejemplo", email: "estudiante@duoc.cl", password: "user123", rol: "usuario" }
        ];
        localStorage.setItem("tecnoduoc_usuarios", JSON.stringify(usuariosIniciales));
    }
}

// Validar y procesar Inicio de Sesión
function procesarLogin(e) {
    e.preventDefault();

    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    
    const emailError = document.getElementById("login-email-error");
    const passwordError = document.getElementById("login-password-error");
    const loginGeneralError = document.getElementById("login-general-error");

    let esValido = true;

    // Reiniciar mensajes de error
    ocultarError(emailInput, emailError);
    ocultarError(passwordInput, passwordError);
    if (loginGeneralError) loginGeneralError.style.display = "none";

    // Validar Email
    const emailValue = emailInput.value.trim();
    if (emailValue === "") {
        mostrarError(emailInput, emailError, "Por favor, ingresa tu correo electrónico.");
        esValido = false;
    } else if (!validarFormatoEmail(emailValue)) {
        mostrarError(emailInput, emailError, "Ingresa un correo electrónico válido (ejemplo: usuario@duoc.cl).");
        esValido = false;
    }

    // Validar Contraseña
    const passwordValue = passwordInput.value.trim();
    if (passwordValue === "") {
        mostrarError(passwordInput, passwordError, "Por favor, ingresa tu contraseña.");
        esValido = false;
    } else if (passwordValue.length < 6) {
        mostrarError(passwordInput, passwordError, "La contraseña debe tener al menos 6 caracteres.");
        esValido = false;
    }

    if (!esValido) return;

    // Verificar credenciales
    const usuarios = JSON.parse(localStorage.getItem("tecnoduoc_usuarios")) || [];
    const usuarioEncontrado = usuarios.find(u => u.email.toLowerCase() === emailValue.toLowerCase() && u.password === passwordValue);

    if (usuarioEncontrado) {
        // Guardar sesión activa
        localStorage.setItem("tecnoduoc_usuario_activo", JSON.stringify({
            nombre: usuarioEncontrado.nombre,
            email: usuarioEncontrado.email,
            rol: usuarioEncontrado.rol
        }));

        alert(`¡Bienvenido/a ${usuarioEncontrado.nombre}!`);

        // Redirigir según el rol
        if (usuarioEncontrado.rol === "admin") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "index.html";
        }
    } else {
        if (loginGeneralError) {
            loginGeneralError.textContent = "Credenciales incorrectas. Revisa tu correo o contraseña.";
            loginGeneralError.style.display = "block";
        }
    }
}

// Validar y procesar Registro de Nuevo Usuario
function procesarRegistro(e) {
    e.preventDefault();

    const nombreInput = document.getElementById("reg-nombre");
    const emailInput = document.getElementById("reg-email");
    const passwordInput = document.getElementById("reg-password");
    const confirmInput = document.getElementById("reg-confirm-password");

    const nombreError = document.getElementById("reg-nombre-error");
    const emailError = document.getElementById("reg-email-error");
    const passwordError = document.getElementById("reg-password-error");
    const confirmError = document.getElementById("reg-confirm-error");

    let esValido = true;

    // Limpiar errores previos
    ocultarError(nombreInput, nombreError);
    ocultarError(emailInput, emailError);
    ocultarError(passwordInput, passwordError);
    ocultarError(confirmInput, confirmError);

    // Validar Nombre
    if (nombreInput.value.trim() === "") {
        mostrarError(nombreInput, nombreError, "Ingresa tu nombre completo.");
        esValido = false;
    }

    // Validar Email
    const emailVal = emailInput.value.trim();
    if (emailVal === "") {
        mostrarError(emailInput, emailError, "El correo electrónico es requerido.");
        esValido = false;
    } else if (!validarFormatoEmail(emailVal)) {
        mostrarError(emailInput, emailError, "Formato de correo no válido.");
        esValido = false;
    }

    // Validar Contraseña
    const passVal = passwordInput.value.trim();
    if (passVal === "") {
        mostrarError(passwordInput, passwordError, "La contraseña es requerida.");
        esValido = false;
    } else if (passVal.length < 6) {
        mostrarError(passwordInput, passwordError, "Mínimo 6 caracteres.");
        esValido = false;
    }

    // Confirmar Contraseña
    if (confirmInput.value.trim() !== passVal) {
        mostrarError(confirmInput, confirmError, "Las contraseñas no coinciden.");
        esValido = false;
    }

    if (!esValido) return;

    // Guardar nuevo usuario
    let usuarios = JSON.parse(localStorage.getItem("tecnoduoc_usuarios")) || [];
    
    // Verificar si correo ya existe
    if (usuarios.some(u => u.email.toLowerCase() === emailVal.toLowerCase())) {
        mostrarError(emailInput, emailError, "Este correo ya se encuentra registrado.");
        return;
    }

    const nuevoUsuario = {
        nombre: nombreInput.value.trim(),
        email: emailVal,
        password: passVal,
        rol: "usuario"
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem("tecnoduoc_usuarios", JSON.stringify(usuarios));

    alert("¡Registro exitoso! Ahora puedes iniciar sesión con tu cuenta.");
    location.reload();
}

// Funciones auxiliares de validación
function validarFormatoEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function mostrarError(inputElement, errorElement, mensaje) {
    inputElement.classList.add("is-invalid-custom");
    if (errorElement) {
        errorElement.textContent = mensaje;
        errorElement.classList.add("active");
    }
}

function ocultarError(inputElement, errorElement) {
    inputElement.classList.remove("is-invalid-custom");
    if (errorElement) {
        errorElement.textContent = "";
        errorElement.classList.remove("active");
    }
}
