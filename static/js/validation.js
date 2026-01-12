document.addEventListener("DOMContentLoaded", () => {
    const fields = [
        "fname",
        "lname",
        "phone",
        "email",
        "password",
        "confirm_password"
    ];

    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("input", validateRegister);
        }
    });

    validateRegister(); // initial state
});

function validateRegister() {
    const isValid =
        validateName("fname", "fnameError", "First name") &&
        validateName("lname", "lnameError", "Last name") &&
        validatePhone() &&
        validateEmail() &&
        validatePassword() &&
        validateConfirmPassword();

    const submitBtn = document.getElementById("submitBtn");

    if (submitBtn) {
        submitBtn.style.display = isValid ? "block" : "none";
        submitBtn.disabled = !isValid;
    }

    return isValid; 
}



function validateName(id, errorId, label) {
    const input = document.getElementById(id);
    const value = input.value.trim();
    const regex = /^[A-Za-z]{3,}$/;

    if (value === "") {
        showError(input, errorId, `${label} is required.`);
        return false;
    }

    if (!regex.test(value)) {
        showError(
            input,
            errorId,
            `${label} must contain only letters and be at least 3 characters.`
        );
        return false;
    }

    success(input, errorId);
    return true;
}

function validatePhone() {
    const input = document.getElementById("phone");
    const value = input.value.trim();

    if (!/^[0-9]{10}$/.test(value)) {
        showError(
            input,
            "phoneError",
            "Phone number must be exactly 10 digits."
        );
        return false;
    }

    success(input, "phoneError");
    return true;
}

function validateEmail() {
    const input = document.getElementById("email");
    const value = input.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(value)) {
        showError(
            input,
            "emailError",
            "Enter a valid email (example: name@gmail.com)."
        );
        return false;
    }

    success(input, "emailError");
    return true;
}

function validatePassword() {
    const input = document.getElementById("password");
    const value = input.value;

    const strong =
        value.length >= 8 &&
        /[A-Z]/.test(value) &&
        /[0-9]/.test(value) &&
        /[^A-Za-z0-9]/.test(value);

    if (!strong) {
        showError(
            input,
            "passwordError",
            "Password must be at least 8 characters, include uppercase, number, and symbol."
        );
        return false;
    }

    success(input, "passwordError");
    validateConfirmPassword();
    return true;
}

function validateConfirmPassword() {
    const pass = document.getElementById("password").value;
    const confirm = document.getElementById("confirm_password");

    if (confirm.value === "" || confirm.value !== pass) {
        showError(
            confirm,
            "confirmPasswordError",
            "Passwords must match exactly."
        );
        return false;
    }

    success(confirm, "confirmPasswordError");
    return true;
}



function showError(input, errorId, message) {
    const error = document.getElementById(errorId);
    if (error) {
        error.innerText = message;
        error.style.display = "block";
    }
    input.classList.add("input-error");
    input.classList.remove("input-success");
}

function success(input, errorId) {
    const error = document.getElementById(errorId);
    if (error) {
        error.innerText = "";
        error.style.display = "none";
    }
    input.classList.remove("input-error");
    input.classList.add("input-success");
}
