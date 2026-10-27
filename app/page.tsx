"use client";

import { useMemo, useState, useEffect } from "react";

const WHATSAPP = "573217448056";

const products = [
  {
    id: 1,
    name: "Forros para asientos del carro",
    category: "Forros",
    description: "Forros para asientos de carro, hechos a medida y con materiales de alta calidad.",
    price: "desde $350.000",
    image: "",
    tag: "Más solicitados"
  },
  {
    id: 2,
    name: "Tapicería de carro",
    category: "Tapicería",
    description: "Servicio de tapicería para carros, con acabados profesionales y duraderos.",
    price: "desde $500.000",
    image: "",
    tag: "Más solicitados"
  },
  {
    id: 3,
    name: "Fundas para volante",
    category: "Fundas",
    description: "Fundas para volante de carro, disponibles en diferentes colores y materiales.",
    price: "desde $150.000",
    image: "",
    tag: "Más solicitados"
  },
  {
    id: 4,
    name: "Funda para palanca de cambios", 
    category: "Fundas",
    description: "Funda para palanca de cambios de carro, con diseño ergonómico y materiales resistentes.",
    price: "desde $100.000",
    image: "",
    tag: "Más solicitados"
  },
  {
    id: 5,
    name: "Tapetes y pisos para carro",
    category: "Tapetes",
    description: "Tapetes y pisos para carro, con diseños personalizados y materiales de alta durabilidad.",
    price: "desde $200.000",
    image: "",
    tag: "Más solicitados"
  },
  {
    id: 6,
    name: "Tapizado techo de carro",
    category: "Tapizado",
    description: "Servicio de tapizado para el techo del carro, con acabados elegantes y resistentes.",
    price: "desde $400.000",
    image: "",
    tag: "Más solicitados"
  }
];

const materiales = [
  { name: "Estándar", extra: 0 },
  { name: "Premium", extra: 100000 },
  { name: "Alta gama", extra: 200000 },
];

type CarItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  material: string;
};

export default function Home() {
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [material, setMaterial] = useState("Estándar");
  const [car, setCar] = useState<CarItem[]>([]);
  const [notice, setNotice] = useState("");
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase();
  
    return products.filter((product) => {
      const matchCategory = 
        category === "Todos" || product.category === category;

      const matchSearch =
        !term ||
        `${product.name} ${product.category} ${product.description}`
          .toLowerCase()
          .includes(term);

      return matchCategory && matchSearch;
    });
  }, [category, search]);

  function agregarCarro(product: (typeof products)[number]) {
    const selectedMaterial = materiales.find((item) => item.name === material) ?? materiales[0];
    
    const basePrice = Number(product.price.replace(/[^0-9]/g, ""));
    const price = basePrice + selectedMaterial.extra;

    setCar((current) => {
      const existing = current.find(
        (item) => item.id === product.id && item.material === material
      );
      if (existing) {
        return current.map((item) => 
          item.id === product.id && item.material === material
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...current,
        { 
          id: product.id,
          name: product.name,
          material,
          price,
          quantity: 1,
        },
      ];
    });

    setNotice(`${product.name} agregado al carrito`);
    window.setTimeout(() => setNotice(""), 2500);
  }

  const totalItems = car.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = car.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  function sendWhatsApp() {
    if (car.length === 0) {
      setNotice("Agrega al menos un producto al carro.");
      return;
    }

    const vehicle = [
      brand && `Marca: ${brand}`,
      model && `Modelo: ${model}`,
      year && `Año: ${year}`,
    ]
      .filter(Boolean)
      .join("\n");
    
    const details = car
      .map(
        (item) =>
          `- ${item.name} | Material: (${item.material}) | Cantidad: x${item.quantity} | Subtotal estimado: $${formatPrice(item.price * item.quantity)}`
      )
      .join("\n");

    const message = [
      "Hola, Forros y Tapicería Fénix. Quiero cotizar este pedido:",
      vehicle || "Vehículo: pendiente por confirmar",
      "",
      details,
      "",
      `Total estimado: $${formatPrice(totalPrice)}`,
      "", 
      "Confirmar precio final, disponibilidad, tiempo de entrega y opciones de pago.",
    ].join("\n");

    window.open(
      `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] text-zinc-900">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#171717] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <a href="#" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-2xl font-black">
              F
            </span>
            <span>
              <span className="block text-lg font-black tracking-widest">
                FÉNIX
              </span>
              <span className="block text-[10px] font-semibold tracking-[0.16em] text-orange-400">
                FORROS Y TAPICERÍA
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 text-sm text-zinc-300 md:flex">
            <a href="#Inicio" className="hover:text-orange-400">Inicio</a>
            <a href="#Catalogo" className="hover:text-orange-400">Catálogo</a>
            <a href="#nosotros" className="hover:text-orange-400">Nosotros</a>
            <a href="#contacto" className="hover:text-orange-400">Contacto</a>
          </nav>
          
          <a
            href="#carrito"
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:border-orange-400"
          >
            🛒 Mi carrito ({totalItems})
          </a>
        </div>
      </header>

      <section
        id="Inicio"
        className="relative isolate overflow-hidden bg-[#171717] text-white"
      >
        <div 
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70')"
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/85 to-black/35" />
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-2 md:items-center md:py-32">
          <div>
            <span className="inline-flex rounded-full border border-orange-400/40 bg-orange-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange-300">
              Calidad ° Diseño ° Personalización
            </span>
            <h1 className="mt-7 max-w-2xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Tu vehículo
              <span className="block text-red-500">tu estilo, </span>
              tu sello.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
              Forros y tapicería a la medida, accesorios personalizados y 
              atención 100% personalizada en Medellín.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a 
                href="#buscar"
                className="rounded-xl bg-red-600 px-6 py-4 font-bold text-white transition hover:bg-red-700">
                Encuentra tu producto →
              </a>
              <a 
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hola, quiero información sobre sus productos.")}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/30 px-6 py-4 font-bold hover:border-orange-400 hover:text-orange-300"
              >
                Hablar con un asesor
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["A tu medida", "Diseños personalizados"],
              ["Tu combinación", "Colores y materiales"],
              ["Tu logo", "Original o personalizado"],
              ["Atención humana", "Asesoría por Whatsapp"],
            ].map(([title, subtitle]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/15 bg-black/50 p-5 backdrop-blur-sm text-white"
              >
              <span className="mb-4 block h-1 w-10 rounded-full bg-orange-400" />
              <h4 className="font-bold text-lg mb-1">{title}</h4>
              <p className="text-sm text-zinc-400">{subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="buscar" className="relative z-10 mx-auto -mt-8 max-w-6xl px-5">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-widest text-red-600">
              Encuentra lo que buscas
            </p>
            <h2 className="mt-2 text-2xl font-black">
              Personaliza tu búsqueda
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Selecciona tu vehículo para incluir sus datos en la cotización.
              La compatibilidad se confirma con un asesor.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm font-semibold">
              Marca del vehículo
              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ej. Chevrolet"
                className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 font-normal outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </label>
            <label className="text-sm font-semibold">
              Modelo 
              <input 
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Ej. Onix"
                className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 font-normal outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </label>
            <label className="text-sm font-semibold">
              Año
              <input
              value={year}
              onChange={(e) => setYear(e.target.value)}
              inputMode="numeric"
              maxLength={4}
              placeholder="Ej. 2023"
              className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 font-normal outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </label>
            <label className="text-sm font-semibold">
              Buscar producto
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Forros, volante..."
                className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 font-normal outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />
            </label>
          </div>
        </div>
      </section>

      <section id="catalogo" className="mx-auto max-w-7xl px-5 py-20">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-red-600">
              Nuestro catálogo
            </p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              Dale vida a tu vehículo
            </h2>
            <p className="mt-3 max-w-2xl text-zinc-600">
              Explora las opciones, elige tu material y solicita una cotización
              personalizada.
            </p>
          </div>
          <p className="text-sm text-zinc-500">
            {filteredProducts.length} productos disponibles en esta muestra
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {["Todos", "Forros", "Tapicería", "Accesorios"].map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                category === item
                  ? "bg-red-600 text-white"
                  : "border border-zinc-300 bg-white text-zinc-700 hover:border-red-400"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-56 overflow-hidden bg-zinc-200">
                {/*eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-2 text-xs font-bold text-zinc-900 shadow">
                  {product.tag}
                </span>
              </div>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600">
                  {product.category}
                </p>
                <h3 className="mt-2 text-xl font-extrabold">{product.name}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-600">
                  {product.description}
                </p>

                <label className="mt-5 block text-sm font-semibold">
                  Tipo de material
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-3 font-normal"
                  >
                    {materiales.map((option: { name: string; extra: number }) => (
                      <option key={option.name} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="mt-5 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs text-zinc-500">precio de ejemplo</p>
                    <p className="mt-1 text-xl font-black">
                      {formatPrice(
                        Number(product.price.replace(/[^0-9]/g, "")) + 
                          (materiales.find((m) => m.name === material)?.extra ?? 0)
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => agregarCarro(product)}
                    className="rounded-xl bg-[#171717] px-4 py-3 text-sm font-bold text-white transition hover:bg-red-600"
                  >
                    Agregar +
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 p-10 text-center">
            <h3 className="text-xl font-bold">No encontramos resultados</h3>
            <p className="mt-2 text-zinc-600">
              Prueba con otro término o selecciona una categoría diferente.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("Todos");
              }}
              className="mt-5 font-bold text-red-600"
            >
              Limpiar búsqueda
            </button>
          </div>
        )}

        <p className="mt-6 text-xs leading-5 text-zinc-500">
          Importante: productos, fotografías, tarifas y recargos son
          ilustrativos para esta primera versión. Deben reemplazarse y
          verificarse con Fénix antes de publicar la tienda. La selección del 
          vehículo todavía no verifica compatibilidad automática.
        </p>
      </section>

      <section id="nosotros" className="bg-[#171717] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
              Nuestra esencia
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Cada detalle habla de ti.
            </h2>
            <p className="mt-5 leading-7 text-zinc-300">
              En Forros y Tapicería Fénix queremos ayudarte a personalizar el 
              interior de tu vehículo. Escoge tus colores, materiales y 
              acabados, y conversa con nuestro equipo para encontrar la mejor
              opción para tu carro.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              "Diseños a la medida",
              "Atención personalizada",
              "Opciones de materiales",
              "Logos personalizados",
            ].map((text) => (
              <div
                key={text}
                className="rounded-xl border border-white/10 bg-white/5 p-5"
              >
                <span className="text-xl text-orange-400">✦</span>
                <p className="mt-3 font-bold">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="carrito" className="mx-auto max-w-5xl px-5 py-20">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-9">
          <p className="text-sm font-bold uppercase tracking-widest text-red-600">
            Tu selección
          </p>
          <h2 className="mt-2 text-3xl font-black">Carrito de cotización</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Revisa tus productos antes de enviar la solicitud al asesor de fénix por WhatsApp.
          </p>

          {car.length === 0 ? (
            <div className="mt-6 rounded-xl bg-zinc-50 p-8 text-center">
              <p className="text-zinc-600">
                Todavía no has agregado productos.
              </p>
              <a 
                href="#catalogo"
                className="mt-4 inline-block font-bold text-red-600"
              >
                Explorar catálogo →
              </a>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {car.map((item) => (
                <div
                  key={`${item.id}-${item.material}`}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 p-4"
                >
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="mt-1 text-sm text-zinc-500">
                      Material: {item.material} · Cantidad: {item.quantity}
                    </p>
                    <p className="mt-1 font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setCar((current) =>
                        current.filter(
                          (entry) =>
                            !(
                              entry.id === item.id &&
                              entry.material === item.material
                            )
                        )
                      )
                    }
                    className="text-sm font-semibold text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-5">
                <div>
                  <p className="text-sm text-zinc-500">Total estimado</p>
                  <p className="mt-1 text-3xl font-black">
                    {formatPrice(totalPrice)}
                  </p>
                </div>
                <button
                  onClick={sendWhatsApp}
                  className="rounded-xl bg-green-600 px-6 py-4 font-bold text-white transition hover:bg-green-700"
                >
                  Confirmar por WhatsApp →
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer id="contacto" className="bg-black text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xl font-black tracking-widest">FÉNIX</p>
            <p className="mt-2 text-sm text-zinc-400">
              Forros y Tapicería Vehicular · Medellín, Antioquia
            </p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hola, quiero asesoría sobre los productos de Fénix")}`}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-orange-400 hover:text-orange-300"
          >
            Escríbenos al WhatsApp ↗
          </a>
        </div>
        <div className="border-t border-white/10 px-5 py-4 text-center text-xs text-zinc-500">
          © {currentYear ?? new Date().getFullYear()} Forros y Tapicería Fénix. Todos los
          derechos reservados.
        </div>
      </footer>

      <a
        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hola, quiero asesoría sobre los productos de Fénix")}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Contactar a Fénix por WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white shadow-xl transition hover:bg-green-600"
      >
        ☎
      </a>
      
      {notice && (
        <div
          role="status"
          className="fixed bottom-24 right-6 z-50 max-w-xs rounded-xl bg-[#171717] px-5 py-4 text-sm font-semibold text-white shadow-xl"
        >
          {notice}
        </div>
      )}
    </main>
  );
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}