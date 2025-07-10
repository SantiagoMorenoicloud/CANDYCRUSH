    const USUARIO_ID = 1;
    const API_URL = `http://localhost:3000/api/carrito`;

    const tabla = document.getElementById("carritoTabla");
    const totalSpan = document.getElementById("totalCarrito");
    const confirmarBtn = document.getElementById("confirmarBtn");

    async function cargarCarrito() {
      const res = await fetch(`${API_URL}/${USUARIO_ID}`);
      const data = await res.json(); 

      tabla.innerHTML = "";
      if (data.items.length === 0) {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td colspan="5">No hay productos en el carrito</td>`;
        tabla.appendChild(fila);
      } else {
        data.items.forEach(item => {
          const fila = document.createElement("tr");
          fila.innerHTML = `
            <td>${item.nombre_prod}</td>
            <td>$${parseFloat(item.precio).toFixed(2)}</td>
            <td>${item.cantidad}</td>
            <td>$${parseFloat(item.subtotal).toFixed(2)}</td>
            <td><button onclick="eliminarItem(${item.id})">Eliminar</button></td>
          `;
          tabla.appendChild(fila);
        });
      }

      totalSpan.textContent = parseFloat(data.total).toFixed(2);
    }

    window.eliminarItem = async (id) => {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      cargarCarrito();
    };

    confirmarBtn.addEventListener("click", async () => {
      const res = await fetch(`${API_URL}/confirmar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: USUARIO_ID })
      });

      if (res.ok) {
        window.location.href = "resumen.html";
      } else {
        const error = await res.json();
        alert(error.error);
      }
    });

    cargarCarrito();