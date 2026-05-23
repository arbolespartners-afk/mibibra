import Link from "next/link";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { GenreTicker } from "@/components/landing/GenreTicker";

// Paleta viva: rosa eléctrico #ff2d55 · azul eléctrico #007aff · amarillo #ffd60a
// Hero oscuro para impacto inmediato. Resto del página fondo cálido #faf8f4

const DJS = [
  {
    initials: "DM", nombre: "DJ Marcos", generos: "House · Techno",
    ciudad: "Barcelona", precio: "300€", rating: "4.9",
    bg: "from-[#007aff] via-[#0055cc] to-[#001a66]",
  },
  {
    initials: "LN", nombre: "La Negra", generos: "Reggaeton · Urban",
    ciudad: "Madrid", precio: "250€", rating: "4.8",
    bg: "from-[#ff2d55] via-[#cc0033] to-[#660019]",
  },
  {
    initials: "S7", nombre: "Sektor7", generos: "Drum & Bass",
    ciudad: "Barcelona", precio: "400€", rating: "5.0",
    bg: "from-[#0d0d18] via-[#007aff] to-[#ff2d55]",
  },
  {
    initials: "SM", nombre: "SolMar", generos: "Deep House · Chill",
    ciudad: "Valencia", precio: "200€", rating: "4.7",
    bg: "from-[#ffd60a] via-[#ff9500] to-[#cc5200]",
  },
  {
    initials: "RX", nombre: "Roca X", generos: "Comercial · Pop",
    ciudad: "Sevilla", precio: "280€", rating: "4.8",
    bg: "from-[#ff2d55] via-[#007aff] to-[#0d0d18]",
  },
  {
    initials: "IV", nombre: "Ivet V.", generos: "Electrónica · Minimal",
    ciudad: "Barcelona", precio: "350€", rating: "4.9",
    bg: "from-[#007aff] via-[#ffd60a] to-[#ff2d55]",
  },
];

const STEPS = [
  { n: "01", title: "Publica tu evento", desc: "Dinos qué tipo de evento, cuándo y qué presupuesto. Listo en 2 minutos.", color: "#007aff" },
  { n: "02", title: "Elige tu DJ", desc: "Escucha sus sets, lee valoraciones reales y manda solicitud directa.", color: "#ff2d55" },
  { n: "03", title: "Noche perfecta", desc: "Cerráis el trato en la app. Sin llamadas ni sorpresas.", color: "#ffd60a" },
];

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen text-[#1a1a1a]">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-md bg-[#0d0d18]/90">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <span className="text-xl font-black tracking-tight text-white">
            mi<span className="text-[#ff2d55]">bibra</span>
          </span>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/50">
            <a href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</a>
            <a href="#djs" className="hover:text-white transition-colors">DJs</a>
            <Link href="/studio" className="hover:text-[#ffd60a] transition-colors">Studio</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-white/50 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link href="/auth/register" className="px-5 py-2.5 text-sm font-bold bg-[#ff2d55] hover:bg-[#e0002d] text-white rounded-full transition-all hover:shadow-lg hover:shadow-[#ff2d55]/40">
              Empieza gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO — fondo oscuro, impacto inmediato ── */}
      <section className="relative bg-[#0d0d18] px-6 pt-24 pb-28 overflow-hidden">

        {/* Glow de fondo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #ff2d5530 0%, #007aff20 50%, transparent 80%)" }}
        />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full blur-[100px] pointer-events-none opacity-40"
          style={{ background: "#ffd60a25" }}
        />

        <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-8 relative z-10">

          <ScrollReveal delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/8 text-white/80 rounded-full text-xs font-bold uppercase tracking-widest border border-white/12">
              🎵 Ya en Barcelona
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.93] text-white">
              El DJ que<br />
              tu evento<br />
              <span
                className="inline-block"
                style={{
                  background: "linear-gradient(90deg, #ff2d55, #ffd60a, #007aff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                se merece.
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="text-lg md:text-xl text-white/55 leading-relaxed max-w-xl">
              Conecta con DJs verificados para bodas, discotecas y todo tipo de eventos.
              Sin llamadas, sin intermediarios.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={220}>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/auth/register?role=organizer"
                className="px-8 py-4 text-white rounded-full font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-2xl"
                style={{ background: "linear-gradient(135deg, #ff2d55, #ff6b35)", boxShadow: "0 0 0 0 #ff2d55" }}
              >
                Busco un DJ →
              </Link>
              <Link
                href="/auth/register?role=dj"
                className="px-8 py-4 bg-white/10 hover:bg-white/18 text-white rounded-full font-semibold text-sm transition-colors border border-white/15"
              >
                Soy DJ, quiero bolos
              </Link>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal delay={300} className="w-full">
            <div className="flex gap-10 pt-6 border-t border-white/8 justify-center">
              {[
                ["100%", "Gratis", "#007aff"],
                ["24h", "Respuesta media", "#ff2d55"],
                ["BCN", "Primera ciudad", "#ffd60a"],
              ].map(([val, label, color]) => (
                <div key={String(label)} className="flex flex-col items-center gap-1">
                  <span className="text-2xl font-black" style={{ color: String(color) }}>{val}</span>
                  <span className="text-xs text-white/35 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Visualizador de audio */}
          <ScrollReveal delay={120} className="w-full max-w-3xl">
            <div className="flex items-end justify-center gap-[3px] h-20 mt-4 opacity-60">
              {[30, 55, 40, 75, 50, 90, 65, 45, 80, 55, 95, 40, 70, 50, 85, 60, 45, 75, 35, 65, 50, 80, 45, 70].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 max-w-[18px] rounded-t-full"
                  style={{
                    height: `${h}%`,
                    background: i % 3 === 0 ? "#ff2d55" : i % 3 === 1 ? "#007aff" : "#ffd60a",
                  }}
                />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ background: "#faf8f4" }}>
        <GenreTicker />
      </div>

      {/* ── DJ GALLERY ── */}
      <section id="djs" className="px-6 py-24" style={{ background: "#faf8f4" }}>
        <div className="max-w-6xl mx-auto flex flex-col gap-12">

          <ScrollReveal>
            <div className="flex items-end justify-between">
              <div className="flex flex-col gap-2">
                <p className="text-xs font-bold text-[#1a1a1a]/35 uppercase tracking-widest">DJs destacados</p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                  Encuentra tu <span className="text-[#007aff]">sonido.</span>
                </h2>
              </div>
              <Link href="/auth/register" className="hidden md:inline-flex text-sm font-semibold text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors">
                Ver todos →
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DJS.map((dj, i) => (
              <ScrollReveal key={dj.nombre} delay={i * 80}>
                <div className="group relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer">
                  <div className={`absolute inset-0 bg-gradient-to-br ${dj.bg} transition-transform duration-500 ease-out group-hover:scale-[1.05]`} />
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)`,
                      backgroundSize: "10px 10px",
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-7xl font-black text-white/10 select-none">{dj.initials}</span>
                  </div>
                  <div className="absolute top-4 right-4 px-2.5 py-1 bg-black/30 backdrop-blur-sm rounded-full text-xs font-bold text-[#ffd60a]">
                    ★ {dj.rating}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="font-bold text-white text-lg leading-tight">{dj.nombre}</p>
                        <p className="text-white/65 text-sm mt-0.5">{dj.generos}</p>
                        <p className="text-white/45 text-xs mt-1">📍 {dj.ciudad}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 text-right">
                        <p className="text-white/55 text-xs mb-0.5">desde</p>
                        <p className="text-white font-bold text-lg">{dj.precio}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section id="como-funciona" className="px-6 py-24 bg-[#0d0d18]">
        <div className="max-w-6xl mx-auto flex flex-col gap-16">

          <ScrollReveal>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold text-[#ff2d55] uppercase tracking-widest">Cómo funciona</p>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Tan fácil como<br />pedir un taxi.
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STEPS.map(({ n, title, desc, color }, i) => (
              <ScrollReveal key={n} delay={i * 100}>
                <div
                  className="flex flex-col gap-6 p-10 rounded-2xl border h-full"
                  style={{ borderColor: `${color}25`, background: `${color}08` }}
                >
                  <span className="text-7xl font-black leading-none" style={{ color, opacity: 0.35 }}>{n}</span>
                  <div className="flex flex-col gap-3">
                    <h3 className="font-bold text-xl text-white">{title}</h3>
                    <p className="text-sm text-white/45 leading-relaxed">{desc}</p>
                  </div>
                  <div className="w-8 h-1 rounded-full mt-auto" style={{ background: color }} />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARA DJS Y ORGANIZADORES ── */}
      <section className="px-6 py-24" style={{ background: "#faf8f4" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">

          <ScrollReveal delay={0}>
            <div className="flex flex-col gap-6 p-10 rounded-3xl h-full bg-[#0d0d18]">
              <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Para DJs</span>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                Llena tu agenda<br />sin moverte<br />del sofá.
              </h2>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                Crea tu perfil, sube tus sets y deja que los eventos vengan a ti.
              </p>
              <ul className="flex flex-col gap-3 flex-1">
                {[
                  "Sets de YouTube, SoundCloud y Mixcloud",
                  "Tú pones el precio y negocias directo",
                  "Valoraciones que construyen tu reputación",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/50">
                    <span className="text-[#007aff] font-bold shrink-0 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register?role=dj" className="mt-2 inline-flex w-fit px-6 py-3 bg-[#007aff] hover:bg-[#0062d6] text-white rounded-full font-bold text-sm transition-all hover:shadow-lg hover:shadow-[#007aff]/30">
                Crear mi perfil →
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div
              className="flex flex-col gap-6 p-10 rounded-3xl h-full"
              style={{ background: "linear-gradient(145deg, #ff2d55 0%, #ff6b35 100%)" }}
            >
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Para organizadores</span>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                El DJ perfecto<br />para tu evento.<br />Garantizado.
              </h2>
              <p className="text-white/70 text-sm leading-relaxed max-w-xs">
                Filtra por género, ciudad y presupuesto. Escucha antes de contratar.
              </p>
              <ul className="flex flex-col gap-3 flex-1">
                {[
                  "DJs verificados con sets reales",
                  "Negocia el precio directo en la app",
                  "Valoraciones reales de otros eventos",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/75">
                    <span className="text-white font-bold shrink-0 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register?role=organizer" className="mt-2 inline-flex w-fit px-6 py-3 bg-white hover:bg-zinc-100 text-[#ff2d55] rounded-full font-bold text-sm transition-colors">
                Buscar DJs →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="px-6 py-32 overflow-hidden relative bg-[#0d0d18]">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 100%, #ff2d5518 0%, #007aff12 50%, transparent 80%)",
          }}
        />
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8 relative">
          <ScrollReveal>
            <h2
              className="text-5xl md:text-7xl font-black tracking-tight leading-[0.93]"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #ff2d55 50%, #ffd60a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ¿Listo para<br />empezar?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <p className="text-white/45 text-lg">Gratis. Sin tarjeta. Sin complicaciones.</p>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/auth/register?role=organizer"
                className="px-8 py-4 text-white rounded-full font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-[#ff2d55]/30"
                style={{ background: "linear-gradient(135deg, #ff2d55, #ff6b35)" }}
              >
                Busco un DJ →
              </Link>
              <Link href="/auth/register?role=dj"
                className="px-8 py-4 bg-white/10 hover:bg-white/18 text-white rounded-full font-semibold text-sm transition-colors border border-white/15"
              >
                Soy DJ
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6 py-8 border-t border-white/8 bg-[#0d0d18]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-lg font-black text-white">
            mi<span className="text-[#ff2d55]">bibra</span>
          </span>
          <span className="text-white/30 text-sm">© 2025 · Hecho en Barcelona</span>
        </div>
      </footer>

    </main>
  );
}
