const API_URL = "http://localhost:3000/api/productos";

      
      const formulario = document.getElementById("form-producto");
      const tabla = document.getElementById("tabla-productos");
      const btnSubmit = formulario.querySelector("button[type='submit']");

      let productoEditandoId = null; // ← Para saber si estás en modo edición

document.addEventListener("DOMContentLoaded", () => {
  obtenerProductos();
  cargarMarcas();
  cargarCategorias();
});

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const producto = {
    nombre_prod: formulario.nombre_prod.value,
    marca_id: parseInt(formulario.marca_id.value),
    categoria_id: parseInt(formulario.categoria_id.value),
    anio: parseInt(formulario.anio.value),
    imagen: formulario.imagen.value,
    stock: parseInt(formulario.stock.value),
    precio: parseFloat(formulario.precio.value),
  };

  let res;
  if (productoEditandoId) {
    // MODO EDICIÓN → PUT
    res = await fetch(`${API_URL}/${productoEditandoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
    });
  } else {
    // MODO REGISTRO → POST
    res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
    });
  }

  if (res.ok) {
    alert(productoEditandoId ? "✅ Producto actualizado" : "📚 Producto guardado");
    formulario.reset();
    btnSubmit.textContent = "Registrar";
    productoEditandoId = null;
    obtenerProductos();
  } else {
    const error = await res.text();
    alert("❌ Error: " + error);
  }
});

async function obtenerProductos() {
  const res = await fetch(API_URL);
  const productos = await res.json();
  tabla.innerHTML = "";

  productos.forEach((producto) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${producto.id}</td>
      <td>${producto.nombre_prod}</td>
      <td>${producto.marca}</td>
      <td>${producto.categoria}</td>
      <td>${producto.anio || "—"}</td>
      <td><img src="${producto.imagen}" alt="${producto.nombre_prod}" style="width:60px; height:90px; object-fit:cover;"></td>
      <td>${producto.stock}</td>
      <td>$${Number(producto.precio).toFixed(2)}</td>
      <td>
        <button onclick="editarProducto(${producto.id})">Editar</button>
        <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

window.eliminarProducto = async function (id) {
  if (confirm("¿Estás seguro de eliminar este producto?")) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      obtenerProductos();
    } else {
      alert("❌ No se pudo eliminar.");
    }
  }
};

window.editarProducto = async function (id) {
  const res = await fetch(`${API_URL}/${id}`);
  const producto = await res.json();

  formulario.nombre_prod.value = producto.nombre_prod;
  formulario.marca_id.value = producto.marca_id;
  formulario.categoria_id.value = producto.categoria_id;
  formulario.anio.value = producto.anio;
  formulario.imagen.value = producto.imagen;
  formulario.stock.value = producto.stock;
  formulario.precio.value = producto.precio;

  productoEditandoId = id;
  btnSubmit.textContent = "Actualizar";
};

async function cargarMarcas() {
  const res = await fetch("http://localhost:3000/api/productos/marcas/lista");
  const marcas = await res.json();
  const select = formulario.marca_id;
  select.innerHTML = `<option disabled selected value="">Seleccione un marca</option>`;
  marcas.forEach((marca) => {
    const option = document.createElement("option");
    option.value = marca.id;
    option.textContent = marca.nombre;
    select.appendChild(option);
  });
}

async function cargarCategorias() {
  const res = await fetch("http://localhost:3000/api/productos/categorias/lista");
  const categorias = await res.json();
  const select = formulario.categoria_id;
  select.innerHTML = `<option disabled selected value="">Seleccione una categoría</option>`;
  categorias.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.nombre;
    select.appendChild(option);
  });
}
     


