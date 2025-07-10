const CATALOGO_URL = "http://localhost:3000/api/productos";
const CARRITO_URL = "http://localhost:3000/api/carrito";

const contenedor = document.getElementById("catalogo");

// Cargar catálogo
document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch(CATALOGO_URL);
  const productos = await res.json();

  productos.forEach((producto) => {
    const card = document.createElement("div");
    card.className = "producto-card";
    card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre_prod}" width="150">
      <h3>${producto.nombre_prod}</h3>
      <p>Marca: ${producto.marca}</p>
      <p>Categoría: ${producto.categoria}</p>
      <p>Precio: $${producto.precio}</p>
      <input type="number" min="1" value="1" id="cantidad-${producto.id}">
      <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
    `;
    contenedor.appendChild(card);
  });
});

// Agregar producto al carrito
async function agregarAlCarrito(id) {
  const cantidad = document.getElementById(`cantidad-${id}`).value;

  const res = await fetch(CARRITO_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ producto_id: id, cantidad: parseInt(cantidad) }),
  });

  if (res.ok) {
    const data = await res.json();
    alert(data.mensaje);
  }
}
