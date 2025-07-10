const token = localStorage.getItem("token");

fetch("http://localhost:3000/api/user/perfil", {
  headers: { Authorization: token }
})
  .then(res => res.json())
  .then(user => {
    if (user.id_rol !== 1) {
      alert("Solo los administradores pueden ver esta página");
      location.href = "perfil.html";
    } else {
      cargarCitas();
    }
  });

async function cargarCitas() {
  const res = await fetch("http://localhost:3000/api/citas/admin", {
    headers: { Authorization: token }
  });
  const citas = await res.json();

  const tbody = document.getElementById("tablaCitasAdmin");
  tbody.innerHTML = citas.map(c => `
    <tr>
      <td>${c.usuario}</td>
      <td>${c.fecha}</td>
      <td>${c.hora}</td>
      <td>${c.motivo}</td>
      <td>${c.estado}</td>
      <td>
        <button class="btn-estado" data-id="${c.id}" data-estado="confirmada">Confirmar</button>
        <button class="btn-estado" data-id="${c.id}" data-estado="cancelada">Cancelar</button>
      </td>
    </tr>
  `).join("");

  // Agrega manejador de eventos a todos los botones
  document.querySelectorAll(".btn-estado").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = btn.dataset.id;
      const estado = btn.dataset.estado;
      await actualizarEstado(id, estado);
    });
  });
}

async function actualizarEstado(id, estado) {
  const res = await fetch(`http://localhost:3000/api/citas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ estado })
  });

  const data = await res.json();
  alert(data.message);
  cargarCitas();
}

