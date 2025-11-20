// Datos de salas
const salas = [
  {
    nombre: "Sala Ejecutiva",
    descripcion: "Espacio ideal para reuniones pequeñas y presentaciones ejecutivas.",
    capacidad: 10,
    servicios: ["WiFi", "Proyector", "Café"],
    precio: 150,
    categoria: "pequeno",
    imagen: "sala-ejecutiva.jpg"
  },
  {
    nombre: "Sala de Conferencias",
    descripcion: "Espacio versátil para conferencias y eventos corporativos.",
    capacidad: 25,
    servicios: ["WiFi", "Proyector", "Sonido", "Catering"],
    precio: 300,
    categoria: "mediano",
    imagen: "Sala-de-conferencias.jpg"
  },
  {
    nombre: "Salón de Eventos",
    descripcion: "Amplio espacio para eventos sociales y corporativos grandes.",
    capacidad: 50,
    servicios: ["WiFi", "Sonido", "Catering", "Decoración"],
    precio: 500,
    categoria: "grande",
    imagen: "Sala-de-eventos.jpg"
  },
  {
    nombre: "Sala Creativa",
    descripcion: "Espacio diseñado para sesiones de brainstorming y trabajo creativo.",
    capacidad: 8,
    servicios: ["WiFi", "Pizarras", "Café"],
    precio: 120,
    categoria: "pequeno",
    imagen: "Sala-creativa.jpg"
  },
  {
    nombre: "Sala de Capacitación",
    descripcion: "Espacio equipado para talleres y sesiones de capacitación.",
    capacidad: 20,
    servicios: ["WiFi", "Proyector", "Pizarras"],
    precio: 250,
    categoria: "mediano",
    imagen: "Sala-de-capacitación.jpg"
  },
  {
    nombre: "Auditorio Principal",
    descripcion: "Amplio auditorio para conferencias y eventos de gran escala.",
    capacidad: 100,
    servicios: ["WiFi", "Sonido", "Iluminación", "Catering"],
    precio: 800,
    categoria: "grande",
    imagen: "Auditorio-principal.jpg"
  }
];

let salaSeleccionada = null;
let semanaActual = 0; // 0 = esta semana, 1 = próxima semana, -1 = semana pasada


// Mostrar tarjetas filtradas
function mostrarSalas(filtro) {


  const contenedor = document.getElementById("contenedor-tarjetas");
  contenedor.innerHTML = "";

  const salasFiltradas = salas.filter(s => filtro === "todos" || s.categoria === filtro);

  salasFiltradas.forEach((sala) => {
    const col = document.createElement("div");
    col.className = "col-md-4";

    const card = document.createElement("div");
    card.className = "card h-100 animate__animated animate__fadeInUp";


    // Inserta la imagen referencial al principio
    const imagen = document.createElement("img");
    imagen.src = sala.imagen;
    imagen.alt = sala.nombre;
    imagen.className = "card-img-top";

    // Crear el cuerpo de la tarjeta
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    cardBody.innerHTML = `
      <h5 class="card-title">${sala.nombre}</h5>
      <p class="card-text"><strong>Capacidad:</strong> ${sala.capacidad} personas</p>
      <p class="card-text">${sala.descripcion}</p>
      <ul>${sala.servicios.map(s => `<li>${s}</li>`).join("")}</ul>
      <p class="card-text"><strong>S/. ${sala.precio.toFixed(2)}</strong></p>
    `;

    // Botón de reserva
    const boton = document.createElement("button");
      boton.className = "btn btn-primary";
      boton.textContent = "Seleccionar";
      boton.addEventListener("click", () => {

        semanaActual = 0;
        salaSeleccionada = sala;
        document.getElementById("precioBase").innerHTML = `<strong>Precio base:</strong> S/. ${sala.precio.toFixed(2)}`;
        calcularTotal();
        generarCalendarioDisponibilidad(sala.nombre);

        const modalElement = document.getElementById("modal-reserva");
        const modalContent = document.getElementById("modal-content");

        if (modalContent) {
          modalContent.classList.remove("animate__zoomIn");
          void modalContent.offsetWidth;
          modalContent.classList.add("animate__zoomIn");
        }
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
      });


    cardBody.appendChild(boton);

    // Armar la tarjeta
    card.appendChild(imagen);
    card.appendChild(cardBody);
    col.appendChild(card);
    contenedor.appendChild(col);
  });
}

// Calcular total
function calcularTotal() {
  let total = salaSeleccionada ? salaSeleccionada.precio : 0;
  document.querySelectorAll("#modal-reserva input[type=checkbox]").forEach(cb => {
    if (cb.checked) total += parseFloat(cb.value);
  });
  document.getElementById("totalPrecio").innerHTML = `<strong>Total:</strong> S/. ${total.toFixed(2)}`;
}

// Evento envío de reserva
document.getElementById("form-reserva").addEventListener("submit", (e) => {
  e.preventDefault();

  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (!usuario || usuario.rol !== "cliente") {
    //Alert Inicio de sesión
    Swal.fire({
          icon: 'warning',
          title: 'No registrado',
          text: 'Debes iniciar sesión para generar una reserva',
          confirmButtonColor: '#f39c12'
        });
        return;
  }

  const fechaInicio = document.getElementById("fecha-inicio").value;
  const fechaFin = document.getElementById("fecha-fin").value;
  const comentarios = document.getElementById("comentarios").value;

  if (!fechaInicio || !fechaFin || new Date(fechaInicio) >= new Date(fechaFin)) {
    //Alert Fecha Inválida
    Swal.fire({
          icon: 'warning',
          title: 'Fechas Inválidas',
          text: 'Por favor seleccione una fecha correcta.',
          confirmButtonColor: '#f39c12'
        });
    return;
  }

  const serviciosSeleccionados = [];
  document.querySelectorAll("#modal-reserva .form-check-input").forEach(cb => {
    if (cb.checked) {
      const label = document.querySelector(`label[for=${cb.id}]`);
      serviciosSeleccionados.push(label ? label.innerText : "Servicio adicional");
    }
  });

  const totalTexto = document.getElementById("totalPrecio").textContent;
  const total = totalTexto.replace("Total:", "").replace("S/.", "").trim();

  const reserva = {
    id: Date.now(), // ID único para rastreo
    sala: salaSeleccionada.nombre,
    fechaInicio,
    fechaFin,
    comentarios,
    serviciosExtras: serviciosSeleccionados,
    total,
    email: usuario.email,
    nombre: usuario.nombre,
    telefono: usuario.telefono,
    rol: usuario.rol,
    cancelada: false, 
    fechaCreacion: new Date().toISOString()
  };


  let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

  // Antes de guardar, evitamos duplicados exactos
const yaExiste = reservas.some(r =>
  r.email === usuario.email &&
  r.sala === reserva.sala &&
  r.fechaInicio === reserva.fechaInicio &&
  r.fechaFin === reserva.fechaFin
);

if (yaExiste) {
  //Alert cambio
  Swal.fire({
          icon: 'warning',
          title: 'Horario Duplicado',
          text: 'Por favor selecciona otro horario.',
          confirmButtonColor: '#f39c12'
        });        
  return;
}

  reserva.id = Date.now(); // ID único basado en timestamp ---Cambio de prueba
  reservas.push(reserva);
  localStorage.setItem("reservas", JSON.stringify(reservas));
  //aca se cambio alert
  Swal.fire({
  icon: 'success',
  title: '¡Reserva confirmada!',
  html: `
    <p><strong>Sala:</strong> ${reserva.sala}</p>
    <p><strong>Inicio:</strong> ${new Date(reserva.fechaInicio).toLocaleString()}</p>
    <p><strong>Fin:</strong> ${new Date(reserva.fechaFin).toLocaleString()}</p>
    <p><strong>Total:</strong> S/. ${reserva.total}</p>
  `,
  confirmButtonColor: '#1abc9c'
  }).then(() => {
  bootstrap.Modal.getInstance(document.getElementById("modal-reserva")).hide();
  });
});

// Filtros
document.querySelectorAll("#filter-buttons button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#filter-buttons button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    mostrarSalas(btn.getAttribute("data-filter"));
  });
});

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
  mostrarSalas("todos");
  document.querySelectorAll("#modal-reserva input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", calcularTotal);
  });
});

function generarCalendarioDisponibilidad(nombreSala) {
  const reservas = JSON.parse(localStorage.getItem("reservas")) || [];

const hoy = new Date();
const base = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()); // copia limpia sin hora
const lunes = new Date(base);
lunes.setDate(base.getDate() - base.getDay() + 1 + semanaActual * 7);


  const domingo = new Date(lunes);
  domingo.setDate(lunes.getDate() + 6);

  const formato = { day: 'numeric', month: 'long' };
  const rangoTexto = `Semana del ${lunes.toLocaleDateString('es-PE', formato)} al ${domingo.toLocaleDateString('es-PE', formato)}`;
  document.getElementById("rango-semanal").textContent = rangoTexto;

  // Crear estructura básica
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const horas = Array.from({ length: 15 }, (_, i) => `${8 + i}:00`);

  const tabla = document.createElement("table");
  tabla.className = "table table-bordered text-center align-middle";
  
  // Cabecera
  const thead = document.createElement("thead");
  const filaCabecera = document.createElement("tr");
  filaCabecera.innerHTML = "<th>Hora</th>" + dias.map(d => `<th>${d}</th>`).join("");
  thead.appendChild(filaCabecera);
  tabla.appendChild(thead);

  // Cuerpo
  const tbody = document.createElement("tbody");

  horas.forEach(hora => {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td><strong>${hora}</strong></td>`;

    dias.forEach((dia, index) => {
      const celda = document.createElement("td");

      /*const ahora = new Date();
      const inicioSemana = new Date(ahora.setDate(ahora.getDate() - ahora.getDay() + 1)); // lunes 
      const hoy = new Date();
      const lunes = new Date(hoy.setDate(hoy.getDate() - hoy.getDay() + 1 + semanaActual * 7));*/


      /*const fechaHora = new Date(lunes);
      fechaHora.setDate(fechaHora.getDate() + index); // sumar días*/
      const fechaBase = new Date(lunes.getFullYear(), lunes.getMonth(), lunes.getDate());
      fechaBase.setDate(fechaBase.getDate() + index);

      const [h, m] = hora.split(":");
      fechaBase.setHours(h, m);

      const ocupado = reservas.some(r =>
        r.sala === nombreSala &&
        new Date(r.fechaInicio) <= fechaBase &&
        new Date(r.fechaFin) > fechaBase
      );

      celda.textContent = ocupado ? "Ocupado" : "Libre";
      celda.className = ocupado ? "bg-danger text-white" : "bg-success text-white";
      fila.appendChild(celda);
    });

    tbody.appendChild(fila);
  });

  tabla.appendChild(tbody);
  tabla.classList.add("animate__animated", "animate__fadeIn");


  // Mostrar en el DOM
  const contenedor = document.getElementById("calendario-disponibilidad");
  contenedor.innerHTML = "";
  contenedor.appendChild(tabla);


}
  //Botónes
      document.getElementById("semana-anterior").addEventListener("click", () => {
      semanaActual--;
      generarCalendarioDisponibilidad(salaSeleccionada.nombre);
    });

    document.getElementById("semana-siguiente").addEventListener("click", () => {
      semanaActual++;
      generarCalendarioDisponibilidad(salaSeleccionada.nombre);
    });



