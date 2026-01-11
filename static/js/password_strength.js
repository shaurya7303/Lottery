function checkStrength(password) {
    const bar = document.getElementById("strength-bar");
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const colors = ["#ef4444", "#f59e0b", "#84cc16", "#22c55e"];
    bar.style.width = `${strength * 25}%`;
    bar.style.background = colors[strength - 1] || "#ef4444";
}
