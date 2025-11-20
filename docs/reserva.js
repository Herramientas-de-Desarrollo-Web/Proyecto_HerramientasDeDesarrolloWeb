document.addEventListener("DOMContentLoaded", () => {
  const formReserva = document.getElementById("form-reserva");
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

  if (!formReserva || !usuarioActivo) return;

  formReserva.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Datos del formulario
    const fechaInicio = document.getElementById("fecha-inicio").value;
    const fechaFin = document.getElementById("fecha-fin").value;
    const comentarios = document.getElementById("comentarios").value;
    
    // Servicios seleccionados
    const servicios = Array.from(document.querySelectorAll("input[type='checkbox']:checked"))
                          .map(el => parseInt(el.id.replace("servicio", "")));

    // Total mínimo (puedes dejar 0 si aún no lo calculas)
    const total = 0;

    const reserva = {
      usuarioId: usuarioActivo.id,   // ID del usuario logueado
      salaId: 1,                     // ID fijo por ahora
      fechaInicio,
      fechaFin,
      comentarios,
      servicios,
      total
    };

    try {
      const res = await fetch("http://localhost:3000/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reserva)
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Reserva registrada",
          text: "Se guardó correctamente en la base de datos.",
          confirmButtonColor: "#1abc9c"
        });

        formReserva.reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById("modal-reserva"));
        modal.hide();
      } else {
        throw new Error(data.error || "Error al registrar reserva");
      }

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        confirmButtonColor: "#d33"
      });
    }
  });
});
