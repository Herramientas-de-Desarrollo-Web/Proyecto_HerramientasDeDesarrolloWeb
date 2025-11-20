// auth.js

document.addEventListener("DOMContentLoaded", () => {
  // Registro
  const formRegistro = document.getElementById("form-registro");
  if (formRegistro) {
    formRegistro.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const nombre = document.getElementById("nombre").value.trim();
      const email = document.getElementById("email").value.trim();
      const telefono = document.getElementById("telefono").value.trim();
      const contrasena = document.getElementById("contrasena").value;
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      const yaExiste = usuarios.some(user => user.email === email);
      if (yaExiste) {
        Swal.fire({
          icon: 'warning',
          title: 'Correo ya registrado',
          text: 'Por favor inicia sesión o usa otro correo.',
          confirmButtonColor: '#f39c12'
        });
        return;
      }
      usuarios.push({ nombre, email, telefono, contrasena });
      localStorage.setItem("usuarios", JSON.stringify(usuarios));

      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Ahora puedes iniciar sesión con tu cuenta.',
        confirmButtonColor: '#1abc9c'
      }).then(() => {
      window.location.href = "login.html";
      });
    });
  }
});
// Función para iniciar sesión
function iniciarSesion(correo, contrasena) {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // Verificar si es el administrador
  if (correo === "admin@admin.com" && contrasena === "admin123") {
    const admin = {
      nombre: "Administrador",
      email: "admin@admin.com",
      rol: "admin"
    };
    localStorage.setItem("usuarioActivo", JSON.stringify(admin));

    Swal.fire({
      icon: 'success',
      title: 'Bienvenido Administrador',
      text: 'Has iniciado sesión correctamente.',
      confirmButtonColor: '#1abc9c'
    }).then(() => {
      window.location.href = "admin.html";
    });
    return;
  }

  // Buscar cliente registrado
  const usuario = usuarios.find(user => user.email === correo && user.contrasena === contrasena);

  if (usuario) {
    const cliente = {
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      rol: "cliente"
    };
    localStorage.setItem("usuarioActivo", JSON.stringify(cliente));

    Swal.fire({
      icon: 'success',
      title: 'Inicio de sesión exitoso',
      text: `Bienvenido, ${cliente.nombre}.`,
      confirmButtonColor: '#1abc9c'
    }).then(() => {
      window.location.href = "index.html"; // o "reservas.html"
    });

  } else {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Correo o contraseña incorrectos.',
      confirmButtonColor: '#dc3545'
    });
  }
}
