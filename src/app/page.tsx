import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-white text-[#003049]">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5">
        <span className="text-2xl font-bold tracking-tight text-[#003049]">mibibra</span>
        <div className="flex gap-3 items-center">
          <Link href="/auth/login" className="px-4 py-2 text-sm text-[#003049]/60 hover:text-[#003049] font-medium transition-colors">
            Entrar
          </Link>
          <Link href="/auth/register" className="px-5 py-2.5 text-sm bg-[#D62828] hover:bg-[#b82020] text-white rounded-full font-semibold transition-colors shadow-md shadow-[#D62828]/20">
            Empieza gratis
          </Link>
        </div>
      </nav>

      {/* Hero — split layout */}
      <section className="px-6 md:px-12 pt-10 pb-20 md:pt-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Izquierda: copy */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 px-4 py-1.5 bg-[#FCBF49]/20 text-[#003049] rounded-full text-sm font-semibold border border-[#FCBF49]/60">
              🎵 Ya en Barcelona
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              El DJ que<br />
              tu evento<br />
              <span className="bg-gradient-to-r from-[#D62828] via-[#F77F00] to-[#FCBF49] bg-clip-text text-transparent">
                se merece
              </span>
            </h1>
            <p className="text-lg text-[#003049]/60 leading-relaxed max-w-md">
              mibibra conecta DJs con bodas, discotecas y todo tipo de eventos. Sin llamadas, sin intermediarios.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/auth/register?role=organizer" className="px-6 py-3.5 bg-[#D62828] hover:bg-[#b82020] text-white rounded-full font-semibold text-sm transition-colors shadow-lg shadow-[#D62828]/20 text-center">
                Busco un DJ →
              </Link>
              <Link href="/auth/register?role=dj" className="px-6 py-3.5 bg-white hover:bg-zinc-50 text-[#003049] rounded-full font-semibold text-sm transition-colors border-2 border-[#003049]/15 text-center">
                Soy DJ, quiero bolos
              </Link>
            </div>
            {/* Stats */}
            <div className="flex gap-6 pt-2">
              {[["100%", "Gratis"], ["24h", "Respuesta"], ["BCN", "Primera ciudad"]].map(([val, label]) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-xl font-bold text-[#D62828]">{val}</span>
                  <span className="text-xs text-[#003049]/50 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Derecha: mock de tarjeta DJ */}
          <div className="relative hidden md:block">
            <div className="absolute -top-4 -right-4 w-64 h-64 bg-[#FCBF49]/15 rounded-full blur-3xl" />
            <div className="relative flex flex-col gap-3">
              {/* Tarjeta DJ principal */}
              <div className="bg-white rounded-3xl shadow-2xl shadow-[#003049]/10 border border-zinc-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#003049] to-[#D62828] p-5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white text-xl font-bold border-2 border-white/30">
                    DM
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">DJ Marcos</p>
                    <p className="text-white/70 text-sm">📍 Barcelona</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-[#FCBF49] font-bold">★ 4.9</p>
                    <p className="text-white/60 text-xs">23 bolos</p>
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { g: "House", c: "#003049" },
                      { g: "Techno", c: "#1a1a2e" },
                      { g: "Deep House", c: "#0a4f7a" },
                    ].map(({ g, c }) => (
                      <span key={g} className="px-2.5 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: c }}>
                        {g}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#003049]/50">Tarifa desde</span>
                    <span className="text-lg font-bold text-[#003049]">300 – 800€</span>
                  </div>
                  <div className="w-full py-2.5 bg-[#D62828] text-white rounded-full font-semibold text-sm text-center">
                    Solicitar este DJ
                  </div>
                </div>
              </div>

              {/* Notificación flotante */}
              <div className="absolute -bottom-3 -left-6 bg-white rounded-2xl shadow-xl border border-zinc-100 px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F77F00] flex items-center justify-center text-white text-sm font-bold">
                  E
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#003049]">Nuevo evento</p>
                  <p className="text-xs text-[#003049]/50">Boda en Sitges · 600€</p>
                </div>
                <span className="w-2 h-2 bg-[#D62828] rounded-full ml-2 shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Géneros — con contexto */}
      <section className="px-6 md:px-12 py-12 bg-[#003049]/3">
        <div className="max-w-6xl mx-auto flex flex-col gap-5">
          <p className="text-xs font-bold text-[#003049]/40 uppercase tracking-widest">Todos los géneros</p>
          <div className="flex flex-wrap gap-2">
            {[
              { g: "House", c: "#003049" },
              { g: "Techno", c: "#1a1a2e" },
              { g: "Reggaeton", c: "#F77F00" },
              { g: "Hip Hop", c: "#D62828" },
              { g: "Comercial", c: "#FCBF49", dark: true },
              { g: "Deep House", c: "#0a4f7a" },
              { g: "Latino", c: "#F77F00" },
              { g: "Trap", c: "#D62828" },
              { g: "Flamenco", c: "#D62828" },
              { g: "Jazz", c: "#FCBF49", dark: true },
              { g: "R&B", c: "#D62828" },
              { g: "Electrónica", c: "#003049" },
            ].map(({ g, c, dark }) => (
              <span key={g} className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: `${c}15`, color: dark ? c : c, border: `1.5px solid ${c}25` }}>
                {g}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto flex flex-col gap-14">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold text-[#D62828] uppercase tracking-widest">Cómo funciona</p>
            <h2 className="text-4xl font-bold text-[#003049] max-w-md leading-tight">Tan fácil como pedir un taxi</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: "01", color: "#D62828", title: "Publica tu evento", desc: "Dinos qué tipo de evento es, cuándo y qué presupuesto tienes." },
              { n: "02", color: "#F77F00", title: "Elige tu DJ", desc: "Escucha sus sets, lee valoraciones y manda una solicitud directa." },
              { n: "03", color: "#FCBF49", title: "Noche perfecta", desc: "Cerráis el trato en la app. Nosotros nos aseguramos de que todo vaya bien.", dark: true },
            ].map(({ n, color, title, desc, dark }) => (
              <div key={n} className="flex flex-col gap-5 p-7 rounded-3xl border-2" style={{ borderColor: `${color}20`, backgroundColor: `${color}06` }}>
                <span className="text-5xl font-black" style={{ color: `${color}30` }}>{n}</span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-lg text-[#003049]">{title}</h3>
                  <p className="text-sm text-[#003049]/60 leading-relaxed">{desc}</p>
                </div>
                <div className="w-8 h-1 rounded-full" style={{ backgroundColor: color }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para DJs y Organizadores — dos audiencias */}
      <section className="px-6 md:px-12 py-6 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Para DJs */}
          <div className="flex flex-col gap-5 p-8 bg-[#003049] rounded-3xl">
            <span className="text-xs font-bold text-[#FCBF49] uppercase tracking-widest">Para DJs</span>
            <h2 className="text-3xl font-bold text-white leading-tight">Llena tu agenda sin moverte del sofá</h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Crea tu perfil, sube tus sets y deja que los eventos vengan a ti. Tú pones el precio.
            </p>
            <ul className="flex flex-col gap-3">
              {["Sube tus sets de YouTube, SoundCloud y Mixcloud", "Pon tu tarifa y negocia directamente", "Valoraciones que construyen tu reputación"].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-white/70">
                  <span className="text-[#FCBF49] mt-0.5 font-bold shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/auth/register?role=dj" className="mt-2 inline-flex w-fit px-5 py-3 bg-[#D62828] hover:bg-[#b82020] text-white rounded-full font-semibold text-sm transition-colors">
              Crear mi perfil →
            </Link>
          </div>

          {/* Para Organizadores */}
          <div className="flex flex-col gap-5 p-8 bg-gradient-to-br from-[#FCBF49] to-[#F77F00] rounded-3xl">
            <span className="text-xs font-bold text-[#003049]/60 uppercase tracking-widest">Para organizadores</span>
            <h2 className="text-3xl font-bold text-[#003049] leading-tight">El DJ perfecto para tu evento</h2>
            <p className="text-[#003049]/60 text-sm leading-relaxed">
              Filtra por género, ciudad y presupuesto. Escucha antes de contratar. Sin sorpresas.
            </p>
            <ul className="flex flex-col gap-3">
              {["Accede a DJs verificados con sets reales", "Habla directo y negocia el precio en la app", "Sistema de confianza y valoraciones reales"].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[#003049]/70">
                  <span className="text-[#003049] mt-0.5 font-bold shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/auth/register?role=organizer" className="mt-2 inline-flex w-fit px-5 py-3 bg-[#003049] hover:bg-[#002038] text-white rounded-full font-semibold text-sm transition-colors">
              Buscar DJs →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 md:px-12 py-20 bg-[#003049]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-4xl font-bold text-white">¿Listo para empezar?</h2>
            <p className="text-white/60 text-lg">Gratis. Sin tarjeta. Sin complicaciones.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/auth/register?role=organizer" className="px-6 py-3.5 bg-[#D62828] hover:bg-[#b82020] text-white rounded-full font-semibold text-sm transition-colors text-center">
              Busco un DJ
            </Link>
            <Link href="/auth/register?role=dj" className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold text-sm transition-colors border border-white/20 text-center">
              Soy DJ
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 border-t border-zinc-100 flex items-center justify-between">
        <span className="text-lg font-bold text-[#003049]">mibibra</span>
        <span className="text-[#003049]/40 text-sm">© 2025 · Hecho en Barcelona</span>
      </footer>
    </main>
  );
}
