document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav-dinamico");
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

  if (!nav) return;

  nav.innerHTML = ""; // Limpiar

  if (!usuario) {
    // Usuario NO logueado
    nav.innerHTML = `
      <li class="nav-item"><a class="nav-link" href="index.html">Inicio</a></li>
      <li class="nav-item"><a class="nav-link" href="login.html">Iniciar Sesión</a></li>
      <li class="nav-item"><a class="nav-link" href="registro.html">Registrarse</a></li>
    `;
  } else {
    // Usuario logueado (si luego quieres agregar botones dinámicos para usuarios)
    nav.innerHTML = `
      <li class="nav-item"><a class="nav-link" href="index.html">Inicio</a></li>
      <li class="nav-item"><span class="nav-link">Hola, ${usuario.nombre}</span></li>
      <li class="nav-item"><a class="nav-link" href="#" id="btn-logout">Cerrar Sesión</a></li>
    `;

    const btnLogout = document.getElementById("btn-logout");
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("usuarioActivo");
      window.location.href = "index.html";
    });
  }
});