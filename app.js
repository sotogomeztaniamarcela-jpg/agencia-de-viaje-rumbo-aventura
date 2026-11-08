const WHATSAPP = "573205359482";
const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

const destinos = [
  { id: 1, nombre: "Cartagena", pais: "Colombia", continente: "América", dias: 4, precio: 1200000, destacado: true,
    imagen: img("photo-1583531352515-8884af319dc1"),
    descripcion: "Ciudad amurallada, playas cercanas y una vida nocturna inolvidable.",
    incluye: ["Tiquetes aéreos", "Tour por el Centro Histórico", "Paseo a Islas del Rosario"] },
  { id: 2, nombre: "San Andrés", pais: "Colombia", continente: "América", dias: 5, precio: 1650000, destacado: false,
    imagen: img("photo-1544551763-46a013bb70d5"),
    descripcion: "El mar de siete colores, ideal para descansar y practicar buceo.",
    incluye: ["Tiquetes aéreos", "Vuelta a la isla", "Visita a Johnny Cay"] },
  { id: 3, nombre: "Cancún", pais: "México", continente: "América", dias: 6, precio: 3200000, destacado: true,
    imagen: img("photo-1507525428034-b723cf961d3e"),
    descripcion: "Playas de arena blanca, cenotes y ruinas mayas a pocos minutos.",
    incluye: ["Tiquetes aéreos", "Excursión a Chichén Itzá", "Traslados"] },
  { id: 4, nombre: "Machu Picchu", pais: "Perú", continente: "América", dias: 6, precio: 3900000, destacado: false,
    imagen: img("photo-1526392060635-9d6019884377"),
    descripcion: "La ciudadela inca, una de las maravillas del mundo moderno.",
    incluye: ["Tiquetes aéreos", "Tren a Aguas Calientes", "Entrada y guía"] },
  { id: 5, nombre: "Nueva York", pais: "Estados Unidos", continente: "América", dias: 7, precio: 5200000, destacado: false,
    imagen: img("photo-1496442226666-8d4d0e62e6e9"),
    descripcion: "Times Square, Central Park y la Estatua de la Libertad.",
    incluye: ["Tiquetes aéreos", "City tour", "Metro card 7 días"] },
  { id: 6, nombre: "París", pais: "Francia", continente: "Europa", dias: 8, precio: 6800000, destacado: true,
    imagen: img("photo-1502602898657-3e91760cbb34"),
    descripcion: "La ciudad del amor, con la Torre Eiffel, el Louvre y Versalles.",
    incluye: ["Tiquetes aéreos", "Crucero por el Sena", "Entrada al Louvre"] },
  { id: 7, nombre: "Roma", pais: "Italia", continente: "Europa", dias: 8, precio: 6500000, destacado: false,
    imagen: img("photo-1552832230-c0197dd311b5"),
    descripcion: "Historia viva: Coliseo, Vaticano y Fontana di Trevi.",
    incluye: ["Tiquetes aéreos", "Tour Coliseo y Foro", "Visita al Vaticano"] },
  { id: 8, nombre: "Santorini", pais: "Grecia", continente: "Europa", dias: 7, precio: 7100000, destacado: false,
    imagen: img("photo-1570077188670-e3a8d69ac5ff"),
    descripcion: "Casas blancas, cúpulas azules y atardeceres únicos en el Egeo.",
    incluye: ["Tiquetes aéreos", "Paseo en catamarán", "Cena al atardecer"] },
  { id: 9, nombre: "Tokio", pais: "Japón", continente: "Asia", dias: 10, precio: 9800000, destacado: true,
    imagen: img("photo-1540959733332-eab4deabeeaf"),
    descripcion: "Tradición y tecnología: templos, cerezos y barrios futuristas.",
    incluye: ["Tiquetes aéreos", "Visita a Asakusa y Shibuya", "Excursión al Monte Fuji"] }
];

const hoteles = {
  economico: { nombre: "Económico", noche: 90000 },
  estandar:  { nombre: "Estándar",  noche: 160000 },
  lujo:      { nombre: "Lujo",      noche: 320000 }
};

const moneda = (n) => "$" + n.toLocaleString("es-CO");
const $ = (id) => document.getElementById(id);

function tarjeta(d) {
  return `
    <article class="card">
      <img src="${d.imagen}" alt="${d.nombre}, ${d.pais}" loading="lazy" onerror="this.removeAttribute('src')">
      <div class="card-body">
        <h3>${d.nombre}, ${d.pais}</h3>
        <div class="meta"><span>${d.dias} días</span><span>${d.continente}</span></div>
        <p class="precio">${moneda(d.precio)} <small>por persona</small></p>
        <a class="btn" href="destino.html?id=${d.id}">Ver detalle</a>
      </div>
    </article>`;
}

/* ---------- Página de inicio ---------- */
function iniciarInicio() {
  const catalogo = $("catalogoGrid");
  let textoBusqueda = "";

  $("destacadosGrid").innerHTML = destinos.filter(d => d.destacado).map(tarjeta).join("");
  $("cDestino").innerHTML = destinos.map(d => `<option value="${d.id}">${d.nombre}, ${d.pais}</option>`).join("");

  function pintarCatalogo() {
    const continente = $("filtroContinente").value;
    const precio = $("filtroPrecio").value;
    const lista = destinos.filter(d => {
      const okC = continente === "todos" || d.continente === continente;
      let okP = true;
      if (precio !== "todos") {
        const [min, max] = precio.split("-").map(Number);
        okP = d.precio >= min && d.precio <= max;
      }
      const okT = (d.nombre + " " + d.pais).toLowerCase().includes(textoBusqueda);
      return okC && okP && okT;
    });
    catalogo.innerHTML = lista.map(tarjeta).join("");
    $("sinResultados").hidden = lista.length > 0;
  }

  $("filtroContinente").addEventListener("change", pintarCatalogo);
  $("filtroPrecio").addEventListener("change", pintarCatalogo);
  $("buscador").addEventListener("submit", (e) => {
    e.preventDefault();
    textoBusqueda = $("busqueda").value.trim().toLowerCase();
    pintarCatalogo();
    $("catalogo").scrollIntoView();
  });
  pintarCatalogo();

  /* Cotizador */
  const params = new URLSearchParams(location.search);
  if (params.get("destino")) $("cDestino").value = params.get("destino");

  $("formCotizador").addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $("cError");
    const personas = parseInt($("cPersonas").value, 10);
    const noches = parseInt($("cNoches").value, 10);
    const destino = destinos.find(d => d.id === Number($("cDestino").value));
    const hotel = hoteles[$("cHotel").value];

    if (!destino) return mostrarError(err, "Selecciona un destino.");
    if (!Number.isInteger(personas) || personas < 1 || personas > 20) return mostrarError(err, "Las personas deben ser entre 1 y 20.");
    if (!Number.isInteger(noches) || noches < 1 || noches > 30) return mostrarError(err, "Las noches deben ser entre 1 y 30.");
    err.hidden = true;

    const base = destino.precio * personas;
    const costoHotel = hotel.noche * noches * personas;
    const total = base + costoHotel;

    $("resultado").innerHTML = `
      <h3>Cotización para ${destino.nombre}</h3>
      <ul class="desglose">
        <li><span>Precio base (${moneda(destino.precio)} × ${personas} persona/s)</span><strong>${moneda(base)}</strong></li>
        <li><span>Hotel ${hotel.nombre} (${moneda(hotel.noche)} × ${noches} noche/s × ${personas})</span><strong>${moneda(costoHotel)}</strong></li>
        <li class="total"><span>Total estimado</span><strong>${moneda(total)}</strong></li>
      </ul>
      <a class="btn" target="_blank" rel="noopener"
         href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola, quiero reservar ${destino.nombre} para ${personas} persona/s, ${noches} noche/s, hotel ${hotel.nombre}. Total estimado: ${moneda(total)}.`)}">
         Reservar por WhatsApp</a>`;
  });

  /* Contacto */
  $("formContacto").addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = $("wNombre").value.trim();
    const destino = $("wDestino").value.trim();
    const mensaje = $("wMensaje").value.trim();
    if (nombre.length < 3) return mostrarError($("wError"), "Escribe tu nombre.");
    if (mensaje.length < 5) return mostrarError($("wError"), "Escribe un mensaje.");
    $("wError").hidden = true;
    const texto = `Hola, soy ${nombre}. Destino de interés: ${destino || "por definir"}. ${mensaje}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, "_blank");
  });
}

function mostrarError(el, msg) {
  el.textContent = msg;
  el.hidden = false;
}

/* ---------- Página de detalle ---------- */
function iniciarDetalle() {
  const id = Number(new URLSearchParams(location.search).get("id"));
  const d = destinos.find(x => x.id === id);
  const cont = $("detalle");

  if (!d) {
    cont.innerHTML = `<p class="vacio">Destino no encontrado. <a href="index.html#catalogo" class="btn">Ver catálogo</a></p>`;
    return;
  }
  document.title = `${d.nombre} | Rumbo Aventura`;
  cont.innerHTML = `
    <div class="detalle">
      <img src="${d.imagen}" alt="${d.nombre}, ${d.pais}" onerror="this.removeAttribute('src')">
      <div>
        <h1>${d.nombre}, ${d.pais}</h1>
        <p class="meta"><span>${d.dias} días</span><span>${d.continente}</span></p>
        <p style="margin-top:14px">${d.descripcion}</p>
        <h3 style="margin-top:18px">El paquete incluye</h3>
        <ul>${d.incluye.map(i => `<li>${i}</li>`).join("")}</ul>
        <p class="precio">${moneda(d.precio)} <small>por persona</small></p>
        <div class="acciones">
          <a class="btn" href="index.html?destino=${d.id}#cotizador">Cotizar este viaje</a>
          <a class="btn" target="_blank" rel="noopener"
             href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hola, quiero información sobre el viaje a " + d.nombre)}">Asesoría por WhatsApp</a>
        </div>
      </div>
    </div>`;
}

/* ---------- Arranque ---------- */
if ($("catalogoGrid")) iniciarInicio();
if ($("detalle")) iniciarDetalle();