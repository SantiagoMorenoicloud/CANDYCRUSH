// Registro
// Registro
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(registerForm);
    const data = Object.fromEntries(formData.entries());
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const json = await res.json();

    if (res.ok) {
      alert(json.message || "Registro exitoso");
      registerForm.reset(); // Limpia el formulario
      window.location.href = "/pages/login.html"; // Redirige al login
    } else {
      alert(json.message || "Error al registrarse");
    }
  });
}


// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const json = await res.json();

    if (json.token && json.user) {
      localStorage.setItem("token", json.token);
      localStorage.setItem("user", JSON.stringify(json.user));

      // 🔀 Redirección según el id_rol
      if (json.user.id_rol === 1) {
        window.location.href = "index.html"; // Admin
      } else if (json.user.id_rol === 2) {
        window.location.href = "catalogo.html"; // Cliente
      } else {
        alert("Rol no reconocido.");
      }
    } else {
      alert(json.message || "Error al iniciar sesión");
    }
  });
}
