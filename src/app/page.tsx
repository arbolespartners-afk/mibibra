import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-white text-[#003049]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
        <span className="text-2xl font-bold tracking-tight text-[#003049]">
          mibibra
        </span>
        <div className="flex gap-3 items-center">
          <Link
            href="/auth/login"
            className="px-4 py-2 text-sm text-[#003049]/70 hover:text-[#003049] font-medium transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/auth/register"
            className="px-4 py-2 text-sm bg-[#D62828] hover:bg-[#b82020] text-white rounded-full font-medium transition-colors"
          >
            Empieza gratis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-16 gap-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FCBF49]/20 text-[#003049] rounded-full text-sm font-medium border border-[#FCBF49]">
          🎵 Ya disponible en Barcelona
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-3xl leading-[1.1] text-[#003049]">
          Tu próximo DJ,{" "}
          <span className="bg-gradient-to-r from-[#D62828] via-[#F77F00] to-[#FCBF49] bg-clip-text text-transparent">
            a un clic
          </span>
        </h1>
        <p className="text-xl text-[#003049]/60 max-w-lg leading-relaxed">
          mibibra conecta DJs con bodas, discotecas y eventos. Sin emails, sin intermediarios, sin rollos.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link
            href="/auth/register?role=organizer"
            className="px-6 py-3.5 bg-[#D62828] hover:bg-[#b82020] text-white rounded-full font-semibold text-base transition-colors shadow-lg shadow-[#D62828]/20"
          >
            Busco un DJ para mi evento
          </Link>
          <Link
            href="/auth/register?role=dj"
            className="px-6 py-3.5 bg-white hover:bg-zinc-50 text-[#003049] rounded-full font-semibold text-base transition-colors border-2 border-[#003049]/20"
          >
            Soy DJ, quiero actuaciones
          </Link>
        </div>
      </section>

      {/* Géneros */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-3">
          {["House", "Techno", "Reggaeton", "Hip Hop", "Comercial", "Deep House", "Latino", "Trap"].map((genre) => (
            <span
              key={genre}
              className="px-4 py-2 bg-[#003049]/5 border border-[#003049]/10 rounded-full text-sm font-medium text-[#003049]/70"
            >
              {genre}
            </span>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="px-6 py-16 bg-[#003049]">
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Tan fácil como pedir un taxi</h2>
            <p className="text-white/60 mt-2">Sin llamadas, sin esperas, sin sorpresas</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepCard
              number="1"
              bg="bg-[#D62828]"
              title="Publica tu evento"
              description="Dinos qué tipo de evento es, cuándo y qué presupuesto tienes."
            />
            <StepCard
              number="2"
              bg="bg-[#F77F00]"
              title="Elige tu DJ"
              description="Escucha sus sets, lee sus valoraciones y manda una solicitud."
            />
            <StepCard
              number="3"
              bg="bg-[#FCBF49]"
              title="Noche perfecta"
              description="Cerráis el trato en la app. Nosotros nos aseguramos de que todo vaya bien."
              dark
            />
          </div>
        </div>
      </section>

      {/* Para DJs */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-5">
            <span className="text-sm font-semibold text-[#D62828] uppercase tracking-wider">Para DJs</span>
            <h2 className="text-3xl font-bold leading-tight text-[#003049]">Llena tu agenda sin moverte del sofá</h2>
            <p className="text-[#003049]/60 leading-relaxed">
              Crea tu perfil, sube tus sets y deja que los eventos vengan a ti.
              Tú pones el precio, tú decides qué aceptas.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                "Perfil con tus mixes de YouTube, SoundCloud y Mixcloud",
                "Tú marcas tu tarifa y negocias directamente",
                "Valoraciones reales que construyen tu reputación",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#003049]/70">
                  <span className="text-[#F77F00] mt-0.5 font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/auth/register?role=dj"
              className="inline-flex w-fit px-5 py-2.5 bg-[#003049] hover:bg-[#003049]/80 text-white rounded-full font-medium text-sm transition-colors"
            >
              Crear mi perfil de DJ →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { genre: "House", bg: "bg-[#D62828]" },
              { genre: "Techno", bg: "bg-[#003049]" },
              { genre: "Reggaeton", bg: "bg-[#F77F00]" },
              { genre: "Hip Hop", bg: "bg-[#FCBF49]", dark: true },
            ].map((item) => (
              <div
                key={item.genre}
                className={`${item.bg} rounded-2xl p-5 flex flex-col justify-end h-28`}
              >
                <span className={`font-semibold text-sm ${item.dark ? "text-[#003049]" : "text-white"}`}>
                  {item.genre}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 py-20 bg-gradient-to-r from-[#D62828] via-[#F77F00] to-[#FCBF49]">
        <div className="max-w-2xl mx-auto text-center flex flex-col gap-6">
          <h2 className="text-4xl font-bold text-white">¿Listo para empezar?</h2>
          <p className="text-white/80 text-lg">
            Es gratis. Sin tarjeta de crédito. Sin complicaciones.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/register"
              className="px-6 py-3.5 bg-white hover:bg-zinc-100 text-[#003049] rounded-full font-semibold text-base transition-colors"
            >
              Crear cuenta gratis
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-zinc-100 flex items-center justify-between">
        <span className="text-lg font-bold text-[#003049]">mibibra</span>
        <span className="text-[#003049]/40 text-sm">© 2025 · Hecho en Barcelona</span>
      </footer>
    </main>
  );
}

function StepCard({
  number,
  bg,
  title,
  description,
  dark = false,
}: {
  number: string;
  bg: string;
  title: string;
  description: string;
  dark?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-4 p-6 ${bg} rounded-2xl`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${dark ? "bg-[#003049]/10 text-[#003049]" : "bg-white/20 text-white"}`}>
        {number}
      </div>
      <div>
        <h3 className={`font-semibold text-base ${dark ? "text-[#003049]" : "text-white"}`}>{title}</h3>
        <p className={`text-sm mt-1 leading-relaxed ${dark ? "text-[#003049]/70" : "text-white/80"}`}>{description}</p>
      </div>
    </div>
  );
}
