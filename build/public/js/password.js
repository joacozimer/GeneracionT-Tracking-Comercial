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

// Función para validar la contraseña
function validatePassword() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Expresión regular para validar la contraseña
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\-]).{8,}$/;
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

// Funcion para comparar la PK
    

// Agrega un evento de escucha para la validación al cambiar el valor de la contraseña
passwordInput.addEventListener("input", validatePassword);
confirmPasswordInput.addEventListener("input", validatePassword);
