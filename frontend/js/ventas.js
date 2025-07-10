// frontend/js/ventas.js
const API_URL = "http://localhost:3000/api/ventas";
const API_PRODUCTOS = "http://localhost:3000/api/ventas/productos"; // ✅

const form = document.getElementById("formVenta");
const tabla = document.getElementById("tablaVentas");
const productoSelect = document.getElementById("productoSelect");
const busquedaProducto = document.getElementById("busquedaProducto");
const precioInput = document.getElementById("precio"); // ✅ Asegúrate de tener este input en tu formulario

let productos = []; // ✅ Almacena todos los productos disponibles

// ✅ Cargar productos al inicio
async function cargarProductos() {
  try {
    const res = await fetch(API_PRODUCTOS);
    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("❌ Error: producto no es una lista:", data);
      return;
    }

    productos = data; // ✅ Guarda la lista
    renderOpciones(productos); // ✅ Carga en el select
  } catch (error) {
    console.error("❌ Error al cargar productos:", error);
  }
}

// ✅ Mostrar productos en el select
function renderOpciones(lista) {
  productoSelect.innerHTML = "";
  lista.forEach(producto => {
    const option = document.createElement("option");
    option.value = producto.id;
    option.textContent = producto.nombre_prod;
    option.dataset.precio = producto.precio; // ✅ Guarda el precio como data attribute
    productoSelect.appendChild(option);
  });

  actualizarPrecio(); // ✅ Al terminar, muestra el precio
}

// ✅ Filtrar productos por texto escrito
busquedaProducto.addEventListener("input", () => {
  const filtro = busquedaProducto.value.toLowerCase();
  const filtrados = productos.filter(p => p.nombre_prod.toLowerCase().includes(filtro));
  renderOpciones(filtrados); // ✅ Muestra productos filtrados
});

// ✅ Cambiar precio al cambiar producto
productoSelect.addEventListener("change", actualizarPrecio);

function actualizarPrecio() {
  const selected = productoSelect.selectedOptions[0];
  if (selected) {
    precioInput.value = selected.dataset.precio || 0; // ✅ Actualiza el campo precio
  }
}

// ✅ Enviar venta
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const venta = {
    producto_id: productoSelect.value,
    usuario_id: form.usuario_id.value,
    cantidad: form.cantidad.value
    // El precio lo calcula el backend ✅
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(venta),
  });

  form.reset();
  cargarVentas();
  renderOpciones(productos); // ✅ Vuelve a cargar todos los productos en el select
  actualizarPrecio(); // ✅ Muestra precio del primero
});

// ✅ Cargar todas las ventas en tabla
async function cargarVentas() {
  const res = await fetch(API_URL);
  const ventas = await res.json();

  tabla.innerHTML = "";
  ventas.forEach((v) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${v.id}</td>
      <td>${v.producto}</td>
      <td>${v.usuario}</td>
      <td>$${parseFloat(v.precio || 0).toFixed(2)}</td>
      <td>${v.cantidad}</td>
      <td>$${parseFloat(v.total || 0).toFixed(2)}</td>
      <td>${new Date(v.fecha).toLocaleString()}</td>
      <td>
        <button onclick="eliminarVenta(${v.id})">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

window.eliminarVenta = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  cargarVentas();
};

// 🚀 Inicialización
cargarProductos(); // ✅
cargarVentas();
