'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

type Profile = {
  name: string
  role: "dj" | "organizer"
  city: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data } = await supabase
        .from("profiles")
        .select("name, role, city")
        .eq("id", user.id)
        .single()

      setProfile(data)
      setLoading(false)
    }

    loadProfile()
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-500 text-sm">Cargando...</div>
      </main>
    )
  }

  return (
    <main className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <span className="text-2xl font-bold tracking-tight">mibibra</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400">{profile?.name}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Salir
          </button>
        </div>
      </nav>

      <div className="flex-1 px-6 py-12 max-w-4xl mx-auto w-full">
        {/* Bienvenida */}
        <div className="flex flex-col gap-2 mb-10">
          <h1 className="text-3xl font-bold">
            Hola, {profile?.name} 👋
          </h1>
          <p className="text-zinc-400">
            {profile?.role === "dj"
              ? "Bienvenido a tu panel de DJ"
              : "Bienvenido a tu panel de organizador"}
            {" · "}{profile?.city}
          </p>
        </div>

        {/* Cards de acciones */}
        {profile?.role === "dj" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DashboardCard
              icon="🎧"
              title="Mi perfil"
              description="Edita tu bio, géneros y links de sets"
              href="/dashboard/profile"
              badge="Próximamente"
            />
            <DashboardCard
              icon="📅"
              title="Eventos disponibles"
              description="Explora eventos que buscan DJ"
              href="/dashboard/events"
              badge="Próximamente"
            />
            <DashboardCard
              icon="💬"
              title="Mis bookings"
              description="Gestiona tus contrataciones activas"
              href="/dashboard/bookings"
              badge="Próximamente"
            />
            <DashboardCard
              icon="⭐"
              title="Mis valoraciones"
              description="Ve lo que dicen de ti los organizadores"
              href="/dashboard/reviews"
              badge="Próximamente"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DashboardCard
              icon="🎪"
              title="Publicar evento"
              description="Crea un nuevo evento y encuentra tu DJ"
              href="/dashboard/events/new"
              badge="Próximamente"
            />
            <DashboardCard
              icon="📋"
              title="Mis eventos"
              description="Gestiona los eventos que has publicado"
              href="/dashboard/events"
              badge="Próximamente"
            />
            <DashboardCard
              icon="💬"
              title="Mis bookings"
              description="Sigue el estado de tus contrataciones"
              href="/dashboard/bookings"
              badge="Próximamente"
            />
            <DashboardCard
              icon="🔍"
              title="Buscar DJs"
              description="Explora perfiles de DJs disponibles"
              href="/dashboard/djs"
              badge="Próximamente"
            />
          </div>
        )}
      </div>
    </main>
  )
}

function DashboardCard({
  icon,
  title,
  description,
  badge,
}: {
  icon: string
  title: string
  description: string
  href: string
  badge?: string
}) {
  return (
    <div className="flex flex-col gap-3 p-5 bg-zinc-900 border border-zinc-800 rounded-xl opacity-70">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        {badge && (
          <span className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-zinc-400 text-sm mt-0.5">{description}</p>
      </div>
    </div>
  )
}
