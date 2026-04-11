'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
      if (!user) { router.push("/auth/login"); return }

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
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-[#003049]/40 text-sm">Cargando...</div>
      </main>
    )
  }

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
        <span className="text-2xl font-bold tracking-tight text-[#003049]">mibibra</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#003049]/50">{profile?.name}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-[#003049]/50 hover:text-[#D62828] transition-colors font-medium"
          >
            Salir
          </button>
        </div>
      </nav>

      <div className="flex-1 px-6 py-12 max-w-4xl mx-auto w-full">
        {/* Bienvenida */}
        <div className="flex flex-col gap-1 mb-10">
          <h1 className="text-3xl font-bold text-[#003049]">
            Hola, {profile?.name} 👋
          </h1>
          <p className="text-[#003049]/50 text-sm">
            {profile?.role === "dj" ? "Panel de DJ" : "Panel de organizador"}
            {" · "}{profile?.city}
          </p>
        </div>

        {profile?.role === "dj" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DashboardCard icon="🎧" title="Mi perfil" description="Edita tu bio, géneros y links de sets" href="/dashboard/profile" accent="#D62828" />
            <DashboardCard icon="📅" title="Eventos disponibles" description="Explora eventos que buscan DJ" href="/dashboard/events" accent="#F77F00" />
            <DashboardCard icon="💬" title="Mis bookings" description="Gestiona tus contrataciones activas" href="/dashboard/bookings" badge="Próximamente" />
            <DashboardCard icon="⭐" title="Mis valoraciones" description="Ve lo que dicen de ti los organizadores" href="/dashboard/reviews" badge="Próximamente" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DashboardCard icon="🎪" title="Mi perfil" description="Edita tu información y tipo de eventos" href="/dashboard/profile/organizer" accent="#F77F00" />
            <DashboardCard icon="📅" title="Publicar evento" description="Crea un evento y encuentra tu DJ" href="/dashboard/events/new" accent="#D62828" />
            <DashboardCard icon="📋" title="Mis eventos" description="Gestiona los eventos que has publicado" href="/dashboard/events" badge="Próximamente" />
            <DashboardCard icon="🔍" title="Buscar DJs" description="Explora perfiles de DJs disponibles" href="/dashboard/djs" badge="Próximamente" />
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
  href,
  badge,
  accent = "#F77F00",
}: {
  icon: string
  title: string
  description: string
  href: string
  badge?: string
  accent?: string
}) {
  const isDisabled = !!badge
  const content = (
    <div
      className={`flex flex-col gap-4 p-6 bg-white border-2 rounded-2xl transition-all ${
        isDisabled
          ? "border-zinc-100 opacity-50"
          : "border-zinc-100 hover:border-[#F77F00] hover:shadow-md cursor-pointer"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: isDisabled ? "#f4f4f4" : `${accent}15` }}
        >
          {icon}
        </div>
        {badge && (
          <span className="text-xs px-2.5 py-1 bg-zinc-100 text-zinc-400 rounded-full font-medium">
            {badge}
          </span>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-[#003049]">{title}</h3>
        <p className="text-[#003049]/50 text-sm mt-0.5">{description}</p>
      </div>
    </div>
  )

  if (isDisabled) return content
  return <Link href={href}>{content}</Link>
}
