const tokenAdmin = localStorage.getItem("token");

fetch("http://localhost:3000/api/user/perfil", {
  headers: { Authorization: tokenAdmin }
})
  .then(res => res.json())
  .then(data => {
    if (data.id_rol !== 1) {
      alert("Acceso denegado. Página solo para administradores.");
      location.href = "perfil.html";
    } else {
      fetch("http://localhost:3000/api/pqrs/admin", {
        headers: { Authorization: tokenAdmin }
      })
        .then((res) => res.json())
        .then((data) => {
          const ul = document.getElementById("adminLista");
          ul.innerHTML = data.map((p) => `
            <li>
              <strong>${p.tipo}</strong> de ${p.usuario}<br>
              <b>${p.asunto}</b>: ${p.mensaje}<br>
              Estado: ${p.estado}<br>
              <textarea id="respuesta-${p.id}" placeholder="Escribe respuesta">${p.respuesta || ""}</textarea><br>
              <button onclick="responder(${p.id})">Responder</button>
              <hr>
            </li>
          `).join("");
        });
    }
  });

function responder(id) {
  const respuesta = document.getElementById(`respuesta-${id}`).value;
  fetch(`http://localhost:3000/api/pqrs/admin/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: tokenAdmin,
    },
    body: JSON.stringify({ respuesta }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      location.reload();
    });
}