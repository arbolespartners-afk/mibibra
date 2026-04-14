'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, MessageCircle, Calendar, MapPin, Euro } from "lucide-react"

type Booking = {
  id: string
  status: string
  agreed_price: number | null
  created_at: string
  dj_id: string
  events: {
    id: string
    title: string
    event_type: string
    event_date: string
    city: string
    budget_min: number | null
    budget_max: number | null
    organizer_id: string
  }
  dj_profile: { name: string } | null
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: "Pendiente",   color: "#F77F00", bg: "#F77F00/10" },
  accepted:  { label: "Confirmado",  color: "#22c55e", bg: "#22c55e/10" },
  rejected:  { label: "Rechazado",   color: "#ff2d55", bg: "#ff2d55/10" },
  completed: { label: "Completado",  color: "#003049", bg: "#003049/10" },
  no_show:   { label: "No-show",     color: "#ff2d55", bg: "#ff2d55/10" },
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
}

export default function BookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [role, setRole] = useState<"dj" | "organizer" | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }
      setUserId(user.id)

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
      setRole(profile?.role ?? null)

      const isDJ = profile?.role === "dj"

      const BOOKING_SELECT = `
        id, status, agreed_price, created_at, dj_id,
        events(id, title, event_type, event_date, city, budget_min, budget_max, organizer_id),
        dj_profile:profiles!bookings_dj_id_fkey(name)
      `

      let bookingData = null

      if (isDJ) {
        const { data } = await supabase
          .from("bookings")
          .select(BOOKING_SELECT)
          .eq("dj_id", user.id)
          .order("created_at", { ascending: false })
        bookingData = data
      } else {
        // Para organizadores: primero obtener sus eventos, luego los bookings de esos eventos
        const { data: myEvents } = await supabase
          .from("events")
          .select("id")
          .eq("organizer_id", user.id)

        const eventIds = myEvents?.map(e => e.id) ?? []

        if (eventIds.length > 0) {
          const { data } = await supabase
            .from("bookings")
            .select(BOOKING_SELECT)
            .in("event_id", eventIds)
            .order("created_at", { ascending: false })
          bookingData = data
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setBookings((bookingData ?? []) as any)
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-white"><p className="text-[#003049]/40 text-sm">Cargando...</p></main>
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#faf8f4]">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white">
        <span className="text-2xl font-bold tracking-tight text-[#1a1a2e]">mi<span className="text-[#ff2d55]">bibra</span></span>
        <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-[#003049]/50 hover:text-[#003049] transition-colors font-medium">
          <ArrowLeft className="size-4" /> Dashboard
        </Link>
      </nav>

      <div className="bg-gradient-to-r from-[#0d0d18] to-[#007aff] px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Mis bookings</h1>
          <p className="text-white/70 text-sm mt-1">Solicitudes y contrataciones activas</p>
        </div>
      </div>

      <div className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full flex flex-col gap-4">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="text-5xl">📭</div>
            <h2 className="text-lg font-semibold text-[#003049]">Sin bookings todavía</h2>
            <p className="text-[#003049]/50 text-sm max-w-xs">
              {role === "dj"
                ? "Solicita eventos desde el listado y aparecerán aquí."
                : "Cuando un DJ solicite tu evento, lo verás aquí."}
            </p>
            {role === "dj" && (
              <Link href="/dashboard/events" className="px-5 py-2.5 bg-[#ff2d55] text-white rounded-full font-semibold text-sm hover:bg-[#e0002d] transition-colors">
                Ver eventos →
              </Link>
            )}
          </div>
        ) : (
          bookings.map(booking => {
            const status = STATUS_LABELS[booking.status] ?? STATUS_LABELS.pending
            const event = booking.events
            return (
              <div key={booking.id} className="bg-white border-2 border-zinc-100 rounded-2xl overflow-hidden hover:border-[#F77F00] transition-colors">
                <div className="h-1.5 bg-gradient-to-r from-[#0d0d18] to-[#ff2d55]" />
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-[#003049]">{event?.title}</h3>
                      {role === "organizer" && booking.dj_profile?.name && (
                        <p className="text-xs text-[#003049]/40 mt-0.5">DJ: {booking.dj_profile.name}</p>
                      )}
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold shrink-0"
                      style={{ backgroundColor: `${status.color}15`, color: status.color }}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-[#003049]/60">
                    {event?.event_date && (
                      <span className="flex items-center gap-1"><Calendar className="size-3.5" />{formatDate(event.event_date)}</span>
                    )}
                    {event?.city && (
                      <span className="flex items-center gap-1"><MapPin className="size-3.5" />{event.city}</span>
                    )}
                    {booking.agreed_price && (
                      <span className="flex items-center gap-1"><Euro className="size-3.5" />{booking.agreed_price}€ acordado</span>
                    )}
                  </div>

                  <Link
                    href={`/dashboard/chat/${booking.id}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#0d0d18] hover:bg-[#007aff] text-white rounded-full font-semibold text-sm transition-colors mt-1"
                  >
                    <MessageCircle className="size-4" /> Abrir chat
                  </Link>
                </div>
              </div>
            )
          })
        )}
      </div>
    </main>
  )
}
