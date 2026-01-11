function toggleTheme() {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    document.querySelector(".theme-toggle").textContent = isDark ? "☀️" : "🌙";
}

window.addEventListener("DOMContentLoaded", () => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark");
        document.querySelector(".theme-toggle").textContent = "☀️";
    }
});
