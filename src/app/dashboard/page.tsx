'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { User, CalendarDays, MessageCircle, Star, Plus, ChevronRight, Music, MapPin, LogOut } from "lucide-react"

type Profile = {
  name: string
  role: "dj" | "organizer"
  city: string
}

type Stats = {
  pendingBookings: number
  totalBookings: number
  upcomingEvents: number
}

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?"
}

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState<Stats>({ pendingBookings: 0, totalBookings: 0, upcomingEvents: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }

      const { data: p } = await supabase.from("profiles").select("name, role, city").eq("id", user.id).single()
      setProfile(p)

      if (p?.role === "dj") {
        const { data: bookings } = await supabase.from("bookings").select("status").eq("dj_id", user.id)
        const pending = bookings?.filter(b => b.status === "pending").length ?? 0
        const total = bookings?.length ?? 0
        const { data: events } = await supabase.from("events").select("id").eq("status", "open")
        setStats({ pendingBookings: pending, totalBookings: total, upcomingEvents: events?.length ?? 0 })
      } else {
        const { data: events } = await supabase.from("events").select("id, bookings(status)").eq("organizer_id", user.id)
        const upcoming = events?.length ?? 0
        const pending = events?.flatMap(e => e.bookings).filter((b: { status: string }) => b.status === "pending").length ?? 0
        setStats({ pendingBookings: pending, totalBookings: 0, upcomingEvents: upcoming })
      }

      setLoading(false)
    }
    load()
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#D62828] border-t-transparent animate-spin" />
          <p className="text-[#003049]/40 text-sm">Cargando...</p>
        </div>
      </main>
    )
  }

  const isDJ = profile?.role === "dj"

  return (
    <main className="flex flex-col min-h-screen bg-[#f9f9f7]">
      {/* Header */}
      <div className={`bg-gradient-to-br ${isDJ ? "from-[#003049] via-[#D62828] to-[#F77F00]" : "from-[#F77F00] via-[#FCBF49] to-[#F77F00]"} px-6 pt-6 pb-20`}>
        <div className="max-w-3xl mx-auto">
          {/* Topbar */}
          <div className="flex items-center justify-between mb-10">
            <span className="text-2xl font-bold text-white">mibibra</span>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium transition-colors">
              <LogOut className="size-4" /> Salir
            </button>
          </div>

          {/* Perfil */}
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold border-2 border-white/30 shrink-0 ${isDJ ? "bg-white/20 text-white" : "bg-white/40 text-[#003049]"}`}>
              {getInitials(profile?.name ?? "")}
            </div>
            <div className="flex flex-col gap-1">
              <p className={`text-sm font-medium ${isDJ ? "text-white/70" : "text-[#003049]/70"}`}>
                {isDJ ? "Panel de DJ" : "Panel de organizador"}
              </p>
              <h1 className={`text-2xl font-bold ${isDJ ? "text-white" : "text-[#003049]"}`}>
                Hola, {profile?.name?.split(" ")[0]} 👋
              </h1>
              {profile?.city && (
                <p className={`text-sm flex items-center gap-1 ${isDJ ? "text-white/60" : "text-[#003049]/60"}`}>
                  <MapPin className="size-3.5" /> {profile.city}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats flotantes */}
      <div className="px-6 -mt-10">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-3">
          <StatCard
            value={stats.pendingBookings}
            label={isDJ ? "Solicitudes" : "Peticiones"}
            color="#D62828"
            highlight={stats.pendingBookings > 0}
          />
          <StatCard
            value={stats.upcomingEvents}
            label={isDJ ? "Eventos abiertos" : "Mis eventos"}
            color="#F77F00"
          />
          <StatCard
            value={stats.totalBookings}
            label={isDJ ? "Total bolos" : "Confirmados"}
            color="#003049"
          />
        </div>
      </div>

      <div className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full flex flex-col gap-6">

        {/* Acción principal */}
        {isDJ ? (
          <Link href="/dashboard/events" className="flex items-center justify-between p-5 bg-gradient-to-r from-[#D62828] to-[#F77F00] rounded-2xl shadow-lg shadow-[#D62828]/20 hover:opacity-95 transition-opacity">
            <div className="flex flex-col gap-1">
              <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Acción rápida</p>
              <p className="text-white font-bold text-lg">Ver eventos disponibles</p>
              <p className="text-white/70 text-sm">Solicita bolos en tu ciudad</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Music className="size-6 text-white" />
            </div>
          </Link>
        ) : (
          <Link href="/dashboard/events/new" className="flex items-center justify-between p-5 bg-gradient-to-r from-[#D62828] to-[#F77F00] rounded-2xl shadow-lg shadow-[#D62828]/20 hover:opacity-95 transition-opacity">
            <div className="flex flex-col gap-1">
              <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Acción rápida</p>
              <p className="text-white font-bold text-lg">Publicar nuevo evento</p>
              <p className="text-white/70 text-sm">Los DJs podrán solicitarlo</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Plus className="size-6 text-white" />
            </div>
          </Link>
        )}

        {/* Navegación */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-[#003049]/40 uppercase tracking-wider px-1">Mi espacio</p>
          <div className="bg-white rounded-2xl border-2 border-zinc-100 overflow-hidden divide-y divide-zinc-100">
            {isDJ ? (
              <>
                <NavRow icon={<User className="size-5" />} iconBg="#D62828" label="Mi perfil" desc="Bio, géneros, sets y tarifa" href="/dashboard/profile" />
                <NavRow icon={<CalendarDays className="size-5" />} iconBg="#F77F00" label="Eventos disponibles" desc="Encuentra tu próximo bolo" href="/dashboard/events" badge={stats.upcomingEvents > 0 ? `${stats.upcomingEvents} abiertos` : undefined} />
                <NavRow icon={<MessageCircle className="size-5" />} iconBg="#003049" label="Mis bookings y chats" desc="Solicitudes y conversaciones" href="/dashboard/bookings" badge={stats.pendingBookings > 0 ? `${stats.pendingBookings} nuevas` : undefined} badgeColor="#D62828" />
                <NavRow icon={<Star className="size-5" />} iconBg="#FCBF49" label="Mis valoraciones" desc="Lo que dicen de ti" href="/dashboard/reviews" disabled />
              </>
            ) : (
              <>
                <NavRow icon={<User className="size-5" />} iconBg="#F77F00" label="Mi perfil" desc="Información y tipo de eventos" href="/dashboard/profile/organizer" />
                <NavRow icon={<Plus className="size-5" />} iconBg="#D62828" label="Publicar evento" desc="Crea un evento y encuentra DJ" href="/dashboard/events/new" />
                <NavRow icon={<CalendarDays className="size-5" />} iconBg="#003049" label="Mis eventos" desc="Gestiona lo que has publicado" href="/dashboard/events" badge={stats.upcomingEvents > 0 ? `${stats.upcomingEvents}` : undefined} />
                <NavRow icon={<MessageCircle className="size-5" />} iconBg="#F77F00" label="Bookings y chats" desc="Solicitudes de DJs y conversaciones" href="/dashboard/bookings" badge={stats.pendingBookings > 0 ? `${stats.pendingBookings} nuevas` : undefined} badgeColor="#D62828" />
                <NavRow icon={<Star className="size-5" />} iconBg="#D62828" label="Buscar DJs" desc="Explora perfiles y contacta directamente" href="/dashboard/djs" />
              </>
            )}
          </div>
        </div>

        {/* Tip */}
        <div className="flex items-start gap-3 p-4 bg-[#FCBF49]/10 border-2 border-[#FCBF49]/30 rounded-2xl">
          <span className="text-xl shrink-0">💡</span>
          <p className="text-sm text-[#003049]/70 leading-relaxed">
            {isDJ
              ? "Completa tu perfil con sets y géneros para que los organizadores te encuentren más fácilmente."
              : "Publica tu evento con cuanta más info mejor — los DJs con mejor match te contactarán antes."}
          </p>
        </div>
      </div>
    </main>
  )
}

function StatCard({ value, label, color, highlight }: { value: number; label: string; color: string; highlight?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 p-4 bg-white rounded-2xl shadow-sm border-2 transition-all ${highlight ? "border-[#D62828]/30 shadow-[#D62828]/10" : "border-zinc-100"}`}>
      <span className="text-2xl font-bold" style={{ color }}>{value}</span>
      <span className="text-xs text-[#003049]/50 text-center leading-tight font-medium">{label}</span>
    </div>
  )
}

function NavRow({
  icon, iconBg, label, desc, href, badge, badgeColor, disabled
}: {
  icon: React.ReactNode
  iconBg: string
  label: string
  desc: string
  href: string
  badge?: string
  badgeColor?: string
  disabled?: boolean
}) {
  const content = (
    <div className={`flex items-center gap-4 px-5 py-4 transition-colors ${disabled ? "opacity-40" : "hover:bg-zinc-50 cursor-pointer"}`}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ backgroundColor: iconBg }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#003049] text-sm">{label}</p>
        <p className="text-xs text-[#003049]/50 mt-0.5">{desc}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {badge && (
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-white" style={{ backgroundColor: badgeColor ?? "#F77F00" }}>
            {badge}
          </span>
        )}
        {disabled ? (
          <span className="text-xs px-2 py-0.5 bg-zinc-100 text-zinc-400 rounded-full font-medium">Pronto</span>
        ) : (
          <ChevronRight className="size-4 text-[#003049]/30" />
        )}
      </div>
    </div>
  )

  if (disabled) return content
  return <Link href={href}>{content}</Link>
}
