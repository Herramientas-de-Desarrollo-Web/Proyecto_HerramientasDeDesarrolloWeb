// auth.js
document.addEventListener("DOMContentLoaded", () => {
  // Registro
  const formRegistro = document.getElementById("form-registro");
  if (formRegistro) {
    formRegistro.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value.trim();
      const email = document.getElementById("email").value.trim();
      const telefono = document.getElementById("telefono").value.trim();
      const dni = document.getElementById("dni").value.trim();
      const fecha_nacimiento =
        document.getElementById("fecha_nacimiento").value;
      const genero = document.getElementById("genero").value;
      const direccion = document.getElementById("direccion").value.trim();
      const contrasena = document.getElementById("contrasena").value;
      // Aquí agregas el console.log
      console.log({
        nombre,
        email,
        telefono,
        dni,
        fecha_nacimiento,
        genero,
        direccion,
        contrasena,
      });
      try {
        const res = await fetch("http://localhost:3000/api/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre,
            email,
            telefono,
            dni,
            fecha_nacimiento,
            genero,
            direccion,
            password: contrasena,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          Swal.fire({
            icon: "success",
            title: "Registro exitoso",
            text: "Ahora puedes iniciar sesión con tu cuenta",
            confirmButtonColor: "#1abc9c",
          }).then(() => (window.location.href = "login.html"));
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.msg || "No se pudo registrar el usuario",
            confirmButtonColor: "#dc3545",
          });
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo conectar con el servidor",
          confirmButtonColor: "#dc3545",
        });
      }
    });
  }

  // Login
  const formLogin = document.getElementById("form-login");
  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();

      const correo = document.getElementById("correoLogin").value.trim();
      const contrasena = document.getElementById("contrasenaLogin").value;

      try {
        const res = await fetch("http://localhost:3000/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: correo, password: contrasena }),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("usuarioActivo", JSON.stringify(data.user));

          if (data.user.rol === "ADMIN") {
            window.location.href = "admin.html";
          } else {
            window.location.href = "reservas.html";
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.msg || "Correo o contraseña incorrectos",
            confirmButtonColor: "#dc3545",
          });
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo conectar con el servidor",
          confirmButtonColor: "#dc3545",
        });
      }
    });
  }
});
