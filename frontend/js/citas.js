const token = localStorage.getItem("token");

document.getElementById("fecha").addEventListener("change", cargarHoras);

function cargarHoras() {
  const fecha = document.getElementById("fecha").value;
  fetch(`http://localhost:3000/api/citas/ocupadas/${fecha}`, {
    headers: { Authorization: token }
  })
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("hora");
      const ocupadas = data.map(h => h.hora);
      const horas = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
      select.innerHTML = "<option value=''>--Seleccione hora--</option>";
      horas.forEach(h => {
        if (!ocupadas.includes(h)) {
          select.innerHTML += `<option value="${h}">${h}</option>`;
        }
      });
    });
}

function registrarCita() {
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const motivo = document.getElementById("motivo").value;

  if (!fecha || !hora || !motivo) return alert("Todos los campos son obligatorios");

  fetch("http://localhost:3000/api/citas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ fecha, hora, motivo })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      listarCitas();
    });
}

function listarCitas() {
  fetch("http://localhost:3000/api/citas", {
    headers: { Authorization: token }
  })
    .then(res => res.json())
    .then(data => {
      const ul = document.getElementById("listaCitas");
      ul.innerHTML = data.map(c => `
        <li>
          ${c.fecha} ${c.hora} - ${c.motivo} [${c.estado}]
          ${c.estado !== "cancelada" ? `<button onclick="cancelar(${c.id})">Cancelar</button>` : ""}
        </li>
      `).join("");
    });
}

function cancelar(id) {
  fetch(`http://localhost:3000/api/citas/cancelar/${id}`, {
    method: "PUT",
    headers: { Authorization: token }
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      listarCitas();
    });
}

window.onload = listarCitas;
