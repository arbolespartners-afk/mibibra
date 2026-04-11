'use client'

import Link from "next/link"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError("Email o contraseña incorrectos")
      setLoading(false)
      return
    }

    router.push("/dashboard")
  }

  return (
    <main className="flex flex-col min-h-screen bg-white items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Link href="/" className="text-2xl font-bold tracking-tight text-[#003049]">
            mibibra
          </Link>
          <h1 className="text-xl font-semibold text-[#003049]">Bienvenido de nuevo</h1>
          <p className="text-[#003049]/50 text-sm">Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              className="px-3 py-2.5 bg-white border-2 border-[#003049]/15 rounded-xl text-sm text-[#003049] placeholder:text-[#003049]/30 focus:outline-none focus:border-[#F77F00] transition-colors"
              placeholder="••••••••"
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
            className="w-full py-3 bg-[#D62828] hover:bg-[#b82020] disabled:opacity-50 disabled:cursor-not-allowed rounded-full font-semibold text-sm text-white transition-colors"
          >
            {loading ? "Entrando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="text-center text-sm text-[#003049]/50">
          ¿No tienes cuenta?{" "}
          <Link href="/auth/register" className="text-[#D62828] hover:text-[#b82020] font-medium transition-colors">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </main>
  )
}
