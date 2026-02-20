const productos = [
  {
    id: "alfajores",
    nombre: "Alfajores de Maicena",
    descripcion: "Rellenos con dulce de leche y bordes de coco.",
    precio: 1200,
    imagen:
      "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "cookies",
    nombre: "Cookies con Chips",
    descripcion: "Masa de manteca dorada con chips de chocolate.",
    precio: 1400,
    imagen:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "scons",
    nombre: "Scons de Vainilla",
    descripcion: "Suaves, aireados y listos para la merienda.",
    precio: 1000,
    imagen:
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "budin",
    nombre: "Budin de Limon",
    descripcion: "Con glaseado citrico y miga humeda.",
    precio: 2200,
    imagen:
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "chipa",
    nombre: "Chipa",
    descripcion: "Panes de queso, dorados y listos para el mate.",
    precio: 1000,
    unidad: "100g",
    imagen:
      "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "brownie",
    nombre: "Brownie",
    descripcion: "Intenso sabor a chocolate, humedo y bien goloso.",
    precio: 2200,
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Chocolatebrownie.JPG/960px-Chocolatebrownie.JPG",
  },
  {
    id: "rolls-canela",
    nombre: "Rolls de Canela",
    descripcion: "Masa suave con espiral de canela y azucar mascabo.",
    precio: 1200,
    imagen:
      "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=900&q=80",
  },
];

const catalogGrid = document.getElementById("catalogGrid");
const boxGrid = document.getElementById("boxGrid");
const boxCounter = document.getElementById("boxCounter");
const boxTotal = document.getElementById("boxTotal");
const sendBoxBtn = document.getElementById("sendBoxBtn");
const sizeButtons = document.querySelectorAll(".size-btn");

const estadoBox = {
  capacidad: 6,
  cantidades: Object.fromEntries(productos.map((producto) => [producto.id, 0])),
};

function formatoPrecio(valor) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);
}

function etiquetaPrecio(producto, mostrarUnidadDefault = false) {
  if (producto.unidad) {
    return `${formatoPrecio(producto.precio)} / ${producto.unidad}`;
  }

  if (mostrarUnidadDefault) {
    return `${formatoPrecio(producto.precio)} c/u`;
  }

  return formatoPrecio(producto.precio);
}

function nombreParaPedido(producto) {
  if (producto.unidad) {
    return `${producto.nombre} (${producto.unidad})`;
  }

  return producto.nombre;
}

function generarPedido(tipo, detalle, total) {
  const miTelefono = "5493795375199";
  const mensajeBase = `*🍰 Nuevo Pedido - Alma en Miga 🍰*%0A%0A`;
  const cuerpo = `*• Tipo:* ${tipo}%0A*• Detalle:* ${detalle}%0A*• Total:* ${total}`;
  const cierre = `%0A%0A*---*%0A_Pedido generado desde la web_`;

  const url = `https://wa.me/${miTelefono}?text=${mensajeBase}${cuerpo}${cierre}`;
  window.open(url, "_blank");
}

function totalUnidades() {
  return Object.values(estadoBox.cantidades).reduce((acc, cantidad) => acc + cantidad, 0);
}

function totalBox() {
  return productos.reduce((acumulado, producto) => {
    return acumulado + estadoBox.cantidades[producto.id] * producto.precio;
  }, 0);
}

function renderCatalogo() {
  catalogGrid.innerHTML = productos
    .map(
      (producto) => `
      <article class="product-card">
        <img
          src="${producto.imagen}"
          alt="${producto.nombre}"
          loading="lazy"
          referrerpolicy="no-referrer"
          onerror="this.onerror=null;this.src='./brand-logo.svg';"
        />
        <div class="product-body">
          <h3 class="product-title">${producto.nombre}</h3>
          <p>${producto.descripcion}</p>
          <p class="price">${etiquetaPrecio(producto)}</p>
          <button
            type="button"
            class="btn btn-secondary product-order-btn"
            data-producto-id="${producto.id}"
          >
            Pedir por WhatsApp
          </button>
        </div>
      </article>
    `
    )
    .join("");

  const botonesProducto = document.querySelectorAll(".product-order-btn");

  botonesProducto.forEach((boton) => {
    boton.addEventListener("click", () => {
      const id = boton.dataset.productoId;
      const producto = productos.find((item) => item.id === id);

      if (!producto) {
        return;
      }

      generarPedido(
        "Producto individual",
        `${nombreParaPedido(producto)} x1`,
        formatoPrecio(producto.precio)
      );
    });
  });
}

function renderBox() {
  boxGrid.innerHTML = productos
    .map(
      (producto) => `
      <article class="box-item">
        <div>
          <h3>${producto.nombre}</h3>
          <p>${etiquetaPrecio(producto, true)}</p>
        </div>
        <div class="qty-controls">
          <button
            type="button"
            class="qty-btn"
            data-action="restar"
            data-producto-id="${producto.id}"
            aria-label="Quitar una unidad de ${producto.nombre}"
          >
            -
          </button>
          <span class="qty-number" data-qty="${producto.id}">0</span>
          <button
            type="button"
            class="qty-btn"
            data-action="sumar"
            data-producto-id="${producto.id}"
            aria-label="Agregar una unidad de ${producto.nombre}"
          >
            +
          </button>
        </div>
      </article>
    `
    )
    .join("");
}

function resetBox() {
  productos.forEach((producto) => {
    estadoBox.cantidades[producto.id] = 0;
  });

  actualizarBox();
}

function actualizarBox() {
  const unidades = totalUnidades();
  const total = totalBox();

  boxCounter.textContent = `Llevas ${unidades}/${estadoBox.capacidad} unidades seleccionadas.`;
  boxTotal.textContent = formatoPrecio(total);
  sendBoxBtn.disabled = unidades !== estadoBox.capacidad;

  productos.forEach((producto) => {
    const qtyNode = boxGrid.querySelector(`[data-qty="${producto.id}"]`);
    const menosBtn = boxGrid.querySelector(
      `[data-action="restar"][data-producto-id="${producto.id}"]`
    );
    const masBtn = boxGrid.querySelector(
      `[data-action="sumar"][data-producto-id="${producto.id}"]`
    );

    const cantidad = estadoBox.cantidades[producto.id];

    if (qtyNode) {
      qtyNode.textContent = String(cantidad);
    }

    if (menosBtn) {
      menosBtn.disabled = cantidad === 0;
    }

    if (masBtn) {
      masBtn.disabled = unidades >= estadoBox.capacidad;
    }
  });
}

function resumenBox() {
  return productos
    .filter((producto) => estadoBox.cantidades[producto.id] > 0)
    .map((producto) => `${estadoBox.cantidades[producto.id]}x ${nombreParaPedido(producto)}`)
    .join(", ");
}

sizeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    sizeButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    estadoBox.capacidad = Number(button.dataset.size);

    resetBox();
  });
});

boxGrid.addEventListener("click", (event) => {
  const boton = event.target.closest("button[data-action]");

  if (!boton) {
    return;
  }

  const productoId = boton.dataset.productoId;

  if (!productoId) {
    return;
  }

  if (boton.dataset.action === "sumar") {
    if (totalUnidades() >= estadoBox.capacidad) {
      return;
    }

    estadoBox.cantidades[productoId] += 1;
  }

  if (boton.dataset.action === "restar") {
    if (estadoBox.cantidades[productoId] === 0) {
      return;
    }

    estadoBox.cantidades[productoId] -= 1;
  }

  actualizarBox();
});

sendBoxBtn.addEventListener("click", () => {
  if (totalUnidades() !== estadoBox.capacidad) {
    return;
  }

  generarPedido(
    `Caja personalizada x${estadoBox.capacidad}`,
    resumenBox(),
    formatoPrecio(totalBox())
  );
});

renderCatalogo();
renderBox();
actualizarBox();
