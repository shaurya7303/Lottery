function validateRegister() {
    let pass = document.getElementById("regPassword").value;
    let confirm = document.getElementById("confirmPassword").value;

    if (pass.length < 6) {
        alert("Password must be at least 6 characters");
        return false;
    }
    if (pass !== confirm) {
        alert("Passwords do not match");
        return false;
    }
    return true;
}

function validateLogin() {
    return true;
}
