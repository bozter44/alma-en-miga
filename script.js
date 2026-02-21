const productos = [
    {
        id: "chipa-tradicional",
        nombre: "Chipa (Tradicional)",
        descripcion: "Receta clásica de queso. Precio por porción de 100g.",
        precio: 1800,
        unidad: "100g",
        imagen: "chipa.jpeg"
    },
    {
        id: "scons-dulces",
        nombre: "Scons",
        descripcion: "Scons caseros, ideales para el té.",
        precio: 1500,
        unidad: "unidad",
        imagen: "scons.jpg"
    },
    {
        id: "brownie-pack-x12",
        nombre: "Pack Brownies x12",
        descripcion: "Caja de 12 brownies artesanales decorados.",
        precio: 4500,
        unidad: "12 unidades",
        imagen: "brownie-pack-x12.jpeg"
    },
    {
        id: "rolls-chocolate",
        nombre: "Rolls de Chocolate",
        descripcion: "Rollos esponjosos rellenos de chocolate.",
        precio: 2200,
        unidad: "unidad",
        imagen: "rolls-chocolate.jpeg"
    }
];

// Función básica para mostrar los productos
function renderizarCatalogo() {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;
    
    grid.innerHTML = productos.map(p => `
        <div class="product-card">
            <img src="${p.imagen}" alt="${p.nombre}">
            <h3>${p.nombre}</h3>
            <p>${p.descripcion}</p>
            <p><strong>$${p.precio}</strong></p>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', renderizarCatalogo);

const catalogGrid = document.getElementById("catalogGrid");

const boxGrid = document.getElementById("boxGrid");
const boxCounter = document.getElementById("boxCounter");
const boxTotal = document.getElementById("boxTotal");
const sendBoxBtn = document.getElementById("sendBoxBtn");
const boxSizeButtons = document.querySelectorAll("#box .size-btn");

const frozenGrid = document.getElementById("frozenGrid");
const frozenCounter = document.getElementById("frozenCounter");
const frozenTotal = document.getElementById("frozenTotal");
const sendFrozenBtn = document.getElementById("sendFrozenBtn");
const frozenSizeButtons = document.querySelectorAll("#congelados .size-btn");

function crearEstado(productos) {
  return {
    capacidad: 6,
    cantidades: Object.fromEntries(productos.map((producto) => [producto.id, 0])),
  };
}

const estadoBox = crearEstado(productosBox);
const estadoFrozen = crearEstado(productosCongelados);

function formatoPrecio(valor) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);
}

function tieneDescuentoPorCantidad(producto) {
  return (
    typeof producto.descuentoDesde === "number" &&
    producto.descuentoDesde > 1 &&
    typeof producto.precioConDescuento === "number"
  );
}

function precioUnitario(producto, cantidad = 1) {
  if (tieneDescuentoPorCantidad(producto) && cantidad >= producto.descuentoDesde) {
    return producto.precioConDescuento;
  }

  return producto.precio;
}

function totalProducto(producto, cantidad) {
  return precioUnitario(producto, cantidad) * cantidad;
}

function etiquetaPrecio(producto, mostrarUnidadDefault = false) {
  if (producto.unidad) {
    return `${formatoPrecio(producto.precio)} / ${producto.unidad}`;
  }

  if (tieneDescuentoPorCantidad(producto)) {
    return `${formatoPrecio(producto.precio)} c/u (${producto.descuentoDesde}+ a ${formatoPrecio(
      producto.precioConDescuento
    )} c/u)`;
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

function renderCatalogo() {
  if (!catalogGrid) {
    return;
  }

  catalogGrid.innerHTML = catalogoProductos
    .map(
      (producto) => `
      <article class="product-card">
        <img
          src="${producto.imagen}"
          alt="${producto.nombre}"
          loading="lazy"
          referrerpolicy="no-referrer"
          onerror="this.onerror=null;this.src='./assets/brand-logo.png';"
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
      const producto = catalogoProductos.find((item) => item.id === id);

      if (!producto) {
        return;
      }

      const detalle = producto.esPack
        ? producto.nombre
        : `${nombreParaPedido(producto)} x1`;

      generarPedido(
        "Producto individual",
        detalle,
        formatoPrecio(precioUnitario(producto, 1))
      );
    });
  });
}


function inicializarSeccionBox({
  productos,
  estado,
  gridNode,
  counterNode,
  totalNode,
  sendButtonNode,
  sizeButtons,
  tipoPedido,
}) {
  if (
    !gridNode ||
    !counterNode ||
    !totalNode ||
    !sendButtonNode ||
    sizeButtons.length === 0
  ) {
    return;
  }

  function totalUnidades() {
    return Object.values(estado.cantidades).reduce((acc, cantidad) => acc + cantidad, 0);
  }

  function totalSeccion() {
    return productos.reduce((acumulado, producto) => {
      return acumulado + totalProducto(producto, estado.cantidades[producto.id]);
    }, 0);
  }

  function resumenSeccion() {
    return productos
      .filter((producto) => estado.cantidades[producto.id] > 0)
      .map((producto) => {
        const cantidad = estado.cantidades[producto.id];
        const etiquetaDescuento =
          tieneDescuentoPorCantidad(producto) && cantidad >= producto.descuentoDesde
            ? ` (${formatoPrecio(precioUnitario(producto, cantidad))} c/u)`
            : "";

        return `${cantidad}x ${nombreParaPedido(producto)}${etiquetaDescuento}`;
      })
      .join(", ");
  }

  function renderSeccion() {
    gridNode.innerHTML = productos
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

  function actualizarSeccion() {
    const unidades = totalUnidades();
    const total = totalSeccion();

    counterNode.textContent = `Llevas ${unidades}/${estado.capacidad} unidades seleccionadas.`;
    totalNode.textContent = formatoPrecio(total);
    sendButtonNode.disabled = unidades !== estado.capacidad;

    productos.forEach((producto) => {
      const qtyNode = gridNode.querySelector(`[data-qty="${producto.id}"]`);
      const menosBtn = gridNode.querySelector(
        `[data-action="restar"][data-producto-id="${producto.id}"]`
      );
      const masBtn = gridNode.querySelector(
        `[data-action="sumar"][data-producto-id="${producto.id}"]`
      );

      const cantidad = estado.cantidades[producto.id];

      if (qtyNode) {
        qtyNode.textContent = String(cantidad);
      }

      if (menosBtn) {
        menosBtn.disabled = cantidad === 0;
      }

      if (masBtn) {
        masBtn.disabled = unidades >= estado.capacidad;
      }
    });
  }

  function resetSeccion() {
    productos.forEach((producto) => {
      estado.cantidades[producto.id] = 0;
    });

    actualizarSeccion();
  }

  sizeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      sizeButtons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      estado.capacidad = Number(button.dataset.size);

      resetSeccion();
    });
  });

  gridNode.addEventListener("click", (event) => {
    const boton = event.target.closest("button[data-action]");

    if (!boton) {
      return;
    }

    const productoId = boton.dataset.productoId;

    if (!productoId || !(productoId in estado.cantidades)) {
      return;
    }

    if (boton.dataset.action === "sumar") {
      if (totalUnidades() >= estado.capacidad) {
        return;
      }

      estado.cantidades[productoId] += 1;
    }

    if (boton.dataset.action === "restar") {
      if (estado.cantidades[productoId] === 0) {
        return;
      }

      estado.cantidades[productoId] -= 1;
    }

    actualizarSeccion();
  });

  sendButtonNode.addEventListener("click", () => {
    if (totalUnidades() !== estado.capacidad) {
      return;
    }

    generarPedido(
      `${tipoPedido} x${estado.capacidad}`,
      resumenSeccion(),
      formatoPrecio(totalSeccion())
    );
  });

  renderSeccion();
  actualizarSeccion();
}

renderCatalogo();

inicializarSeccionBox({
  productos: productosBox,
  estado: estadoBox,
  gridNode: boxGrid,
  counterNode: boxCounter,
  totalNode: boxTotal,
  sendButtonNode: sendBoxBtn,
  sizeButtons: boxSizeButtons,
  tipoPedido: "Caja personalizada",
});

inicializarSeccionBox({
  productos: productosCongelados,
  estado: estadoFrozen,
  gridNode: frozenGrid,
  counterNode: frozenCounter,
  totalNode: frozenTotal,
  sendButtonNode: sendFrozenBtn,
  sizeButtons: frozenSizeButtons,
  tipoPedido: "Congelados",
});
