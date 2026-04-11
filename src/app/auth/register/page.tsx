'use client'

import Link from "next/link"
import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

type Role = "dj" | "organizer" | null

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
      <main className="flex flex-col min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-sm flex flex-col gap-6 text-center">
          <div className="text-5xl">🎉</div>
          <h1 className="text-2xl font-bold">¡Cuenta creada!</h1>
          <p className="text-zinc-400 text-sm">
            Hemos enviado un email de confirmación a <strong className="text-white">{email}</strong>.
            Confírmalo para activar tu cuenta.
          </p>
          <Link
            href="/auth/login"
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 rounded-lg font-medium text-sm transition-colors text-center"
          >
            Ir al inicio de sesión
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-col min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            mibibra
          </Link>
          <h1 className="text-xl font-semibold">Crea tu cuenta</h1>
          <p className="text-zinc-400 text-sm">Es gratis</p>
        </div>

        {/* Selector de rol */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-zinc-300">Soy...</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("dj")}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                role === "dj"
                  ? "border-violet-500 bg-violet-900/30"
                  : "border-zinc-700 bg-zinc-900 hover:border-zinc-600"
              }`}
            >
              <span className="text-2xl">🎧</span>
              <span className="text-sm font-medium">DJ</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("organizer")}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                role === "organizer"
                  ? "border-violet-500 bg-violet-900/30"
                  : "border-zinc-700 bg-zinc-900 hover:border-zinc-600"
              }`}
            >
              <span className="text-2xl">🎪</span>
              <span className="text-sm font-medium">Organizador</span>
            </button>
          </div>
        </div>

        {role && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium text-zinc-300">
                {role === "dj" ? "Nombre artístico" : "Nombre / empresa"}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-colors"
                placeholder={role === "dj" ? "DJ Nombre" : "Nombre del negocio"}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="city" className="text-sm font-medium text-zinc-300">
                Ciudad
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="Barcelona"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="tu@email.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-sm transition-colors"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta gratis"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-zinc-500">
          ¿Ya tienes cuenta?{" "}
          <Link href="/auth/login" className="text-violet-400 hover:text-violet-300 transition-colors">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  )
}
