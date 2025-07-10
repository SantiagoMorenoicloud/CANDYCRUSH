const token = localStorage.getItem("token");

const pqrsForm = document.getElementById("pqrsForm");
if (pqrsForm) {
  pqrsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(pqrsForm).entries());
    const res = await fetch("http://localhost:3000/api/pqrs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    alert(json.message);
    location.reload();
  });
}

fetch("http://localhost:3000/api/pqrs", {
  headers: { "Authorization": token }
})
.then(res => res.json())
.then(pqrsList => {
  const ul = document.getElementById("lista");
  ul.innerHTML = pqrsList.map(p => `
    <li>
      <strong>${p.tipo}:</strong> ${p.asunto}<br>
      <em>${p.mensaje}</em><br>
      Estado: ${p.estado} <br>
      Respuesta: ${p.respuesta || '---'}<hr>
    </li>
  `).join("");
});
