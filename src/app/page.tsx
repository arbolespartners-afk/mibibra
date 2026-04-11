import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <span className="text-2xl font-bold tracking-tight">mibibra</span>
        <div className="flex gap-4">
          <Link
            href="/auth/login"
            className="px-4 py-2 text-sm text-zinc-300 hover:text-white transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/auth/register"
            className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-500 rounded-lg font-medium transition-colors"
          >
            Registrarse
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-6 py-24 gap-8">
        <div className="inline-block px-3 py-1 text-xs font-medium bg-violet-900/40 text-violet-300 rounded-full border border-violet-700/50">
          Ahora en Barcelona
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-3xl leading-tight">
          El DJ que buscas{" "}
          <span className="text-violet-400">está aquí</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-xl">
          mibibra conecta DJs de cualquier género con bodas, discotecas y eventos.
          Encuentra tu match perfecto en minutos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/auth/register?role=organizer"
            className="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold text-lg transition-colors"
          >
            Busco un DJ
          </Link>
          <Link
            href="/auth/register?role=dj"
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-semibold text-lg transition-colors"
          >
            Soy DJ
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-3">
            <div className="w-10 h-10 bg-violet-900/50 rounded-lg flex items-center justify-center text-violet-400 text-xl">
              🎧
            </div>
            <h3 className="font-semibold text-lg">Perfiles verificados</h3>
            <p className="text-zinc-400 text-sm">
              Escucha mixes y sets de cada DJ antes de contratar. Sin sorpresas.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="w-10 h-10 bg-violet-900/50 rounded-lg flex items-center justify-center text-violet-400 text-xl">
              💬
            </div>
            <h3 className="font-semibold text-lg">Negociación directa</h3>
            <p className="text-zinc-400 text-sm">
              Habla directamente con el DJ, ajusta el precio y cierra el trato sin intermediarios.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="w-10 h-10 bg-violet-900/50 rounded-lg flex items-center justify-center text-violet-400 text-xl">
              ⭐
            </div>
            <h3 className="font-semibold text-lg">Sistema de confianza</h3>
            <p className="text-zinc-400 text-sm">
              Valoraciones reales y penalizaciones para no-shows. Tranquilidad garantizada.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-zinc-800 text-center text-zinc-500 text-sm">
        © 2025 mibibra. Hecho en Barcelona.
      </footer>
    </main>
  );
}
