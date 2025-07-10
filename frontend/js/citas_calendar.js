document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:3000/api/citas", {
    headers: {
      Authorization: token
    }
  });
  const citas = await res.json();

  const HORARIOS_DISPONIBLES = [
    "08:00", "11:00", "14:00", "17:00", "20:00"
  ];

  const calendarEl = document.getElementById("calendar");

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    selectable: true,
    events: citas.map(c => ({
      title: `${c.motivo} - ${c.hora}`,
      start: c.fecha,
      extendedProps: { hora: c.hora }
    })),
    select: async (info) => {
      const fechaSeleccionada = info.startStr;

      // Filtrar citas de ese día
      const citasEseDia = citas.filter(c => c.fecha === fechaSeleccionada);
      const horasOcupadas = citasEseDia.map(c => c.hora);

      // Mostrar solo horas no ocupadas
      const horasDisponibles = HORARIOS_DISPONIBLES.filter(h => !horasOcupadas.includes(h));

      if (horasDisponibles.length === 0) {
        alert("No hay horarios disponibles para esta fecha.");
        return;
      }

      const horaElegida = prompt(
        `Selecciona una hora disponible:\n${horasDisponibles.join(" - ")}`
      );

      if (!horaElegida || !horasDisponibles.includes(horaElegida)) {
        alert("Hora inválida o no seleccionada.");
        return;
      }

      await registrarCita(fechaSeleccionada, horaElegida);
    }
  });

  calendar.render();
});

async function registrarCita(fecha, hora) {
  const motivo = prompt("Motivo de la cita:");
  if (!motivo) return;

  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:3000/api/citas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ fecha, hora, motivo })
  });

  const data = await res.json();
  alert(data.message || "Cita registrada");
  location.reload();
}


