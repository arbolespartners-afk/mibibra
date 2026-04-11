'use client'

import Link from "next/link"
import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

type Role = "dj" | "organizer" | null

const DJ_BENEFITS = [
  { icon: "🎧", title: "Muestra tu estilo", text: "Sube tus sets de YouTube, SoundCloud o Mixcloud para que te descubran." },
  { icon: "💰", title: "Tú pones el precio", text: "Define tu tarifa y negocia directamente. Sin comisiones ocultas." },
  { icon: "📅", title: "Llena tu agenda", text: "Recibe solicitudes de bodas, clubs y eventos sin mover un dedo." },
  { icon: "⭐", title: "Construye tu reputación", text: "Acumula valoraciones reales que te abren más puertas." },
]

const ORGANIZER_BENEFITS = [
  { icon: "🔍", title: "Encuentra el DJ perfecto", text: "Filtra por género, ciudad y presupuesto. Escucha antes de contratar." },
  { icon: "💬", title: "Habla directamente", text: "Sin intermediarios. Negocia el precio y cierra el trato en la app." },
  { icon: "✅", title: "Contratación segura", text: "Sistema de valoraciones y penalizaciones para no-shows." },
  { icon: "⚡", title: "Rápido y gratis", text: "Publica tu evento en minutos. Sin costes hasta que hagas match." },
]

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}

function RegisterForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialRole = searchParams.get("role") as Role

  const [role, setRole] = useState<Role>(initialRole)
  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!role) return
    setError("")
    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        role,
        name,
        city,
      })

      if (profileError) {
        setError("Error al crear el perfil. Inténtalo de nuevo.")
        setLoading(false)
        return
      }

      if (role === "dj") {
        await supabase.from("dj_profiles").insert({ id: data.user.id })
      } else {
        await supabase.from("organizer_profiles").insert({ id: data.user.id })
      }
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <main className="flex flex-col min-h-screen bg-white items-center justify-center px-6">
        <div className="w-full max-w-sm flex flex-col gap-6 text-center">
          <div className="text-6xl">🎉</div>
          <h1 className="text-2xl font-bold text-[#003049]">¡Cuenta creada!</h1>
          <p className="text-[#003049]/50 text-sm">
            Hemos enviado un email de confirmación a{" "}
            <strong className="text-[#003049]">{email}</strong>.
            Confírmalo para activar tu cuenta.
          </p>
          <Link
            href="/auth/login"
            className="w-full py-3 bg-[#D62828] hover:bg-[#b82020] rounded-full font-semibold text-sm text-white transition-colors text-center"
          >
            Ir al inicio de sesión
          </Link>
        </div>
      </main>
    )
  }

  const benefits = role === "dj" ? DJ_BENEFITS : role === "organizer" ? ORGANIZER_BENEFITS : DJ_BENEFITS
  const panelBg = role === "organizer"
    ? "from-[#F77F00] to-[#FCBF49]"
    : "from-[#003049] to-[#D62828]"
  const panelTitle = role === "organizer"
    ? "Encuentra el DJ que tu evento merece"
    : "Consigue más bolos. Muestra tu talento."
  const panelSub = role === "organizer"
    ? "Miles de DJs listos para hacer vibrar tu evento"
    : "La plataforma donde los eventos te encuentran a ti"

  return (
    <main className="flex min-h-screen bg-white">
      {/* Columna izquierda — formulario */}
      <div className="flex flex-col justify-center px-8 py-12 w-full md:w-1/2 max-w-lg mx-auto md:mx-0">
        <div className="flex flex-col gap-8 w-full max-w-sm mx-auto">
          <div className="flex flex-col gap-2">
            <Link href="/" className="text-2xl font-bold tracking-tight text-[#003049]">
              mibibra
            </Link>
            <h1 className="text-2xl font-bold text-[#003049]">Crea tu cuenta</h1>
            <p className="text-[#003049]/50 text-sm">Es gratis, sin tarjeta de crédito</p>
          </div>

          {/* Selector de rol */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-[#003049]">Soy...</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("dj")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  role === "dj"
                    ? "border-[#D62828] bg-[#D62828]/5 scale-[1.02]"
                    : "border-[#003049]/15 bg-white hover:border-[#003049]/30"
                }`}
              >
                <span className="text-2xl">🎧</span>
                <span className={`text-sm font-semibold ${role === "dj" ? "text-[#D62828]" : "text-[#003049]"}`}>DJ</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("organizer")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  role === "organizer"
                    ? "border-[#F77F00] bg-[#F77F00]/5 scale-[1.02]"
                    : "border-[#003049]/15 bg-white hover:border-[#003049]/30"
                }`}
              >
                <span className="text-2xl">🎪</span>
                <span className={`text-sm font-semibold ${role === "organizer" ? "text-[#F77F00]" : "text-[#003049]"}`}>Organizador</span>
              </button>
            </div>
          </div>

          {role && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-[#003049]">
                  {role === "dj" ? "Nombre artístico" : "Nombre / empresa"}
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="px-3 py-2.5 bg-white border-2 border-[#003049]/15 rounded-xl text-sm text-[#003049] placeholder:text-[#003049]/30 focus:outline-none focus:border-[#F77F00] transition-colors"
                  placeholder={role === "dj" ? "DJ Nombre" : "Nombre del negocio"}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="city" className="text-sm font-medium text-[#003049]">
                  Ciudad
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="px-3 py-2.5 bg-white border-2 border-[#003049]/15 rounded-xl text-sm text-[#003049] placeholder:text-[#003049]/30 focus:outline-none focus:border-[#F77F00] transition-colors"
                  placeholder="Barcelona"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-[#003049]">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="px-3 py-2.5 bg-white border-2 border-[#003049]/15 rounded-xl text-sm text-[#003049] placeholder:text-[#003049]/30 focus:outline-none focus:border-[#F77F00] transition-colors"
                  placeholder="tu@email.com"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-[#003049]">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="px-3 py-2.5 bg-white border-2 border-[#003049]/15 rounded-xl text-sm text-[#003049] placeholder:text-[#003049]/30 focus:outline-none focus:border-[#F77F00] transition-colors"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              {error && (
                <p className="text-sm text-[#D62828] bg-[#D62828]/5 border border-[#D62828]/20 rounded-xl px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#D62828] hover:bg-[#b82020] disabled:opacity-50 disabled:cursor-not-allowed rounded-full font-semibold text-sm text-white transition-colors mt-1"
              >
                {loading ? "Creando cuenta..." : "Crear cuenta gratis →"}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-[#003049]/50">
            ¿Ya tienes cuenta?{" "}
            <Link href="/auth/login" className="text-[#D62828] hover:text-[#b82020] font-medium transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>

      {/* Columna derecha — panel de beneficios (solo desktop) */}
      <div className={`hidden md:flex flex-col justify-center flex-1 bg-gradient-to-br ${panelBg} px-12 py-12 transition-all duration-500`}>
        <div className="flex flex-col gap-10 max-w-sm">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-bold text-white leading-tight">{panelTitle}</h2>
            <p className="text-white/70 text-sm">{panelSub}</p>
          </div>
          <div className="flex flex-col gap-5">
            {benefits.map((b) => (
              <div key={b.title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-xl shrink-0">
                  {b.icon}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{b.title}</p>
                  <p className="text-white/65 text-sm mt-0.5 leading-relaxed">{b.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
