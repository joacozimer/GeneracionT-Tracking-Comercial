document.addEventListener("DOMContentLoaded", function() {
    const passwordInput = document.getElementById("FormNewPasswordInput");
    const iconPassword = document.getElementById("iconPassword");

    iconPassword.addEventListener("click", function() {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            iconPassword.src = "/assets/icons/visibility on.svg";
        } else {
            passwordInput.type = "password";
            iconPassword.src = "/assets/icons/visibility off.svg";
        }
    });
});

// Obtén referencias a los elementos del DOM
const passwordInput = document.getElementById("FormNewPasswordInput");
const confirmPasswordInput = document.getElementById("FormConfirmPasswordInput");
const passwordError = document.getElementById("passwordError");
const submitButton = document.getElementById("registrarse");

// Expresión regular para validar la contraseña
const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\-]).{8,}$/;

// Función para validar la contraseña
function validatePassword() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!passwordPattern.test(password)) {
        passwordError.textContent = "La contraseña debe contener al menos un dígito, una letra minúscula, una letra mayúscula y un carácter especial. Debe tener al menos 8 caracteres.";
        return false;
    } else if (password !== confirmPassword) {
        passwordError.textContent = "Las contraseñas no coinciden.";
        return false;
    } else {
        passwordError.textContent = "";
        return true;
    }
}

// Función para habilitar o deshabilitar el botón de registro
function toggleSubmitButton() {
    if (validatePassword()) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
}

// Agrega un evento de escucha para la validación al cambiar el valor de la contraseña
passwordInput.addEventListener("input", toggleSubmitButton);

// Agrega un evento de escucha para la validación al cambiar el valor de la confirmación de contraseña
confirmPasswordInput.addEventListener("input", toggleSubmitButton);
