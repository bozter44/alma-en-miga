const catalogoProductos = [
  {
    id: "scons",
    nombre: "Scons",
    descripcion: "Version tradicional. Precio por porcion de 100g.",
    precio: 1600,
    unidad: "100g",
    imagen: "./assets/catalogo/scons.jpg",
  },
  {
    id: "chipa-tradicional",
    nombre: "Chipa (Tradicional)",
    descripcion: "Receta clasica de queso. Precio por porcion de 100g.",
    precio: 1800,
    unidad: "100g",
    imagen: "./assets/catalogo/chipa.jpeg",
  },
  {
    id: "brownie-pack-6",
    nombre: "Brownie Pack x6",
    descripcion: "Pack cerrado de 6 brownies.",
    precio: 10000,
    esPack: true,
    imagen: "./assets/catalogo/brownie-pack-x6.jpeg",
  },
  {
    id: "brownie-pack-12",
    nombre: "Brownie Pack x12",
    descripcion: "Pack cerrado de 12 brownies.",
    precio: 18000,
    esPack: true,
    imagen: "./assets/catalogo/brownie-pack-x12.jpeg",
  },
  {
    id: "rolls-chocolate",
    nombre: "Rolls de Chocolate",
    descripcion: "Masa suave rellena de chocolate.",
    precio: 2500,
    descuentoDesde: 2,
    precioConDescuento: 2000,
    imagen: "./assets/catalogo/rolls-chocolate.jpeg",
  },
];

const productosBox = [
  {
    id: "scons",
    nombre: "Scons",
    precio: 1600,
    unidad: "100g",
  },
  {
    id: "chipa-tradicional",
    nombre: "Chipa (Tradicional)",
    precio: 1800,
    unidad: "100g",
  },
  {
    id: "rolls-chocolate",
    nombre: "Rolls de Chocolate",
    precio: 2500,
    descuentoDesde: 2,
    precioConDescuento: 2000,
  },
];

const productosCongelados = [
  {
    id: "scones-congelados",
    nombre: "Scones congelados",
    precio: 1400,
    unidad: "100g",
  },
  {
    id: "chipa-congelados",
    nombre: "Chipa congelados",
    precio: 1600,
    unidad: "100g",
  },
];

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
    !sendButtonNode
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

 // Busca esta función dentro de inicializarSeccionBox y reemplazala por esta:

function resumenSeccion() {
  return productos
    .filter((producto) => estado.cantidades[producto.id] > 0)
    .map((producto) => {
      const cantidad = estado.cantidades[producto.id];
      const etiquetaDescuento =
        tieneDescuentoPorCantidad(producto) && cantidad >= producto.descuentoDesde
          ? ` (${formatoPrecio(precioUnitario(producto, cantidad))} c/u)`
          : "";

      // Nueva lógica para calcular gramos totales
      if (producto.unidad && producto.unidad.includes("g")) {
        // Extraemos el número de la cadena (ej: "100g" -> 100)
        const valorUnidad = parseInt(producto.unidad); 
        const pesoTotal = valorUnidad * cantidad;
        
        // Si el peso es 1000g o más, podrías pasarlo a kg opcionalmente, 
        // pero para mantenerlo simple:
        return `${pesoTotal}g ${producto.nombre}${etiquetaDescuento}`;
      }

      // Si no tiene unidad de gramos, se queda como estaba
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

    counterNode.textContent = `Agrega lo que quieras. Llevas ${unidades} unidades seleccionadas.`;
    totalNode.textContent = formatoPrecio(total);
    sendButtonNode.disabled = unidades === 0;

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
        masBtn.disabled = false;
      }
    });
  }

  function resetSeccion() {
    productos.forEach((producto) => {
      estado.cantidades[producto.id] = 0;
    });

    actualizarSeccion();
  }

  if (sizeButtons && sizeButtons.length) {
    sizeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        sizeButtons.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        resetSeccion();
      });
    });
  }

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
    if (totalUnidades() === 0) {
      return;
    }

    generarPedido(
      tipoPedido,
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
