'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, MapPin, Calendar, Euro, Clock, Plus, MessageCircle } from "lucide-react"

type Event = {
  id: string
  title: string
  event_type: string
  event_date: string
  start_time: string | null
  end_time: string | null
  city: string
  budget_min: number | null
  budget_max: number | null
  description: string
  status: string
  organizer_id: string
  profiles: { name: string; city: string } | null
}

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  "Boda": { bg: "#ffd60a", text: "#003049" },
  "Discoteca": { bg: "#003049", text: "white" },
  "Evento corporativo": { bg: "#007aff", text: "white" },
  "Festival": { bg: "#ff2d55", text: "white" },
  "Cumpleaños": { bg: "#F77F00", text: "white" },
  "Fiesta privada": { bg: "#ffd60a", text: "#003049" },
  "Bar / Restaurante": { bg: "#003049", text: "white" },
  "Hotel": { bg: "#007aff", text: "white" },
  "Terraza": { bg: "#F77F00", text: "white" },
  "Afterwork": { bg: "#ff2d55", text: "white" },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
}

function formatTime(time: string) {
  return time.slice(0, 5)
}

export default function EventsPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [role, setRole] = useState<"dj" | "organizer" | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [requesting, setRequesting] = useState<string | null>(null)
  const [requested, setRequested] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }
      setUserId(user.id)

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
      setRole(profile?.role ?? null)

      // Cargar bookings ya solicitados por este DJ
      if (profile?.role === "dj") {
        const { data: myBookings } = await supabase.from("bookings").select("event_id").eq("dj_id", user.id)
        setRequested(new Set(myBookings?.map(b => b.event_id) ?? []))
      }

      let query = supabase
        .from("events")
        .select("*, profiles(name, city)")
        .eq("status", "open")
        .order("event_date", { ascending: true })

      if (profile?.role === "organizer") {
        query = query.eq("organizer_id", user.id)
      }

      const { data } = await query
      setEvents(data ?? [])
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

      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d0d18] to-[#ff2d55] px-6 py-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {role === "organizer" ? "Mis eventos" : "Eventos disponibles"}
            </h1>
            <p className="text-white/70 text-sm mt-1">
              {role === "organizer"
                ? "Eventos que has publicado"
                : "Eventos que buscan DJ — solicita los que te interesen"}
            </p>
          </div>
          {role === "organizer" && (
            <Link
              href="/dashboard/events/new"
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#003049] rounded-full font-semibold text-sm hover:bg-zinc-100 transition-colors"
            >
              <Plus className="size-4" /> Nuevo evento
            </Link>
          )}
        </div>
      </div>

      <div className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full flex flex-col gap-4">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="text-5xl">📭</div>
            <h2 className="text-lg font-semibold text-[#003049]">
              {role === "organizer" ? "Todavía no has publicado ningún evento" : "No hay eventos disponibles aún"}
            </h2>
            <p className="text-[#003049]/50 text-sm max-w-xs">
              {role === "organizer"
                ? "Publica tu primer evento y los DJs podrán solicitarlo."
                : "Vuelve pronto, los organizadores están añadiendo eventos."}
            </p>
            {role === "organizer" && (
              <Link href="/dashboard/events/new" className="px-5 py-2.5 bg-[#ff2d55] text-white rounded-full font-semibold text-sm hover:bg-[#e0002d] transition-colors">
                Publicar evento →
              </Link>
            )}
          </div>
        ) : (
          events.map(event => {
            const colors = TYPE_COLORS[event.event_type] ?? { bg: "#003049", text: "white" }
            return (
              <div key={event.id} className="bg-white border-2 border-zinc-100 rounded-2xl overflow-hidden hover:border-[#F77F00] transition-colors">
                {/* Top bar de color */}
                <div className="h-1.5" style={{ backgroundColor: colors.bg }} />
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-semibold text-[#003049] text-base">{event.title}</h3>
                      {role === "dj" && event.profiles && (
                        <p className="text-xs text-[#003049]/40">por {event.profiles.name}</p>
                      )}
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold shrink-0"
                      style={{ backgroundColor: `${colors.bg}20`, color: colors.bg }}
                    >
                      {event.event_type}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-[#003049]/60">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5" />
                      {formatDate(event.event_date)}
                    </span>
                    {(event.start_time || event.end_time) && (
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {event.start_time && formatTime(event.start_time)}
                        {event.start_time && event.end_time && " – "}
                        {event.end_time && formatTime(event.end_time)}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {event.city}
                    </span>
                    {(event.budget_min || event.budget_max) && (
                      <span className="flex items-center gap-1">
                        <Euro className="size-3.5" />
                        {event.budget_min && event.budget_max
                          ? `${event.budget_min} – ${event.budget_max}€`
                          : `${event.budget_min || event.budget_max}€`}
                      </span>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-sm text-[#003049]/60 leading-relaxed line-clamp-2">{event.description}</p>
                  )}

                  {role === "dj" && (
                    requested.has(event.id) ? (
                      <Link
                        href="/dashboard/bookings"
                        className="w-full py-2.5 bg-[#003049] text-white rounded-full font-semibold text-sm transition-colors mt-1 flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="size-4" /> Ver chat →
                      </Link>
                    ) : (
                      <button
                        disabled={requesting === event.id}
                        onClick={async () => {
                          if (!userId) return
                          setRequesting(event.id)
                          const { data } = await supabase.from("bookings").insert({
                            dj_id: userId,
                            event_id: event.id,
                            status: "pending",
                          }).select("id").single()
                          if (data) {
                            await supabase.from("messages").insert({
                              booking_id: data.id,
                              sender_id: userId,
                              content: "¡Hola! Me interesa este evento. ¿Podemos hablar?",
                            })
                            setRequested(prev => new Set([...prev, event.id]))
                          }
                          setRequesting(null)
                        }}
                        className="w-full py-2.5 bg-[#ff2d55] hover:bg-[#e0002d] disabled:opacity-50 text-white rounded-full font-semibold text-sm transition-colors mt-1"
                      >
                        {requesting === event.id ? "Enviando..." : "Solicitar este bolo →"}
                      </button>
                    )
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </main>
  )
}
