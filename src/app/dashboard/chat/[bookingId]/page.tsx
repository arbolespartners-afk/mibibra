'use client'

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, Send, Check, X } from "lucide-react"

type Message = {
  id: string
  content: string
  sender_id: string
  created_at: string
}

type BookingDetail = {
  id: string
  status: string
  agreed_price: number | null
  dj_id: string
  events: {
    title: string
    event_date: string
    city: string
    budget_min: number | null
    budget_max: number | null
    organizer_id: string
  }
  dj_name: string
  organizer_name: string
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-ES", { day: "numeric", month: "short" })
}

export default function ChatPage() {
  const router = useRouter()
  const { bookingId } = useParams<{ bookingId: string }>()
  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [role, setRole] = useState<"dj" | "organizer" | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [agreedPrice, setAgreedPrice] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }
      setUserId(user.id)

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
      setRole(profile?.role ?? null)

      const { data: b } = await supabase
        .from("bookings")
        .select(`id, status, agreed_price, dj_id, events(title, event_date, city, budget_min, budget_max, organizer_id)`)
        .eq("id", bookingId)
        .single()

      if (!b) { router.push("/dashboard/bookings"); return }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const events = (Array.isArray(b.events) ? b.events[0] : b.events) as any

      const { data: djProfile } = await supabase.from("profiles").select("name").eq("id", b.dj_id).single()
      const { data: orgProfile } = await supabase.from("profiles").select("name").eq("id", events.organizer_id).single()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setBooking({ ...(b as any), events, dj_name: djProfile?.name ?? "DJ", organizer_name: orgProfile?.name ?? "Organizador" })

      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .eq("booking_id", bookingId)
        .order("created_at", { ascending: true })

      setMessages(msgs ?? [])
      setLoading(false)
    }
    load()
  }, [bookingId, router])

  // Realtime: escuchar mensajes nuevos
  useEffect(() => {
    if (!bookingId) return
    const channel = supabase
      .channel(`chat-${bookingId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `booking_id=eq.${bookingId}`,
      }, payload => {
        setMessages(prev => [...prev, payload.new as Message])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [bookingId])

  // Scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || !userId || sending) return
    setSending(true)
    const content = input.trim()
    setInput("")
    await supabase.from("messages").insert({ booking_id: bookingId, sender_id: userId, content })
    setSending(false)
  }

  async function updateStatus(status: "accepted" | "rejected") {
    const price = status === "accepted" && agreedPrice ? Number(agreedPrice) : null
    await supabase.from("bookings").update({
      status,
      ...(price ? { agreed_price: price } : {}),
    }).eq("id", bookingId)
    setBooking(prev => prev ? { ...prev, status, agreed_price: price ?? prev.agreed_price } : prev)

    const msg = status === "accepted"
      ? `✅ He aceptado la solicitud.${price ? ` Precio acordado: ${price}€.` : ""} ¡Nos vemos en el evento!`
      : "❌ He rechazado la solicitud. Gracias por tu interés."
    await supabase.from("messages").insert({ booking_id: bookingId, sender_id: userId!, content: msg })
  }

  if (loading || !booking) {
    return <main className="flex min-h-screen items-center justify-center bg-white"><p className="text-[#003049]/40 text-sm">Cargando...</p></main>
  }

  const isOrganizer = role === "organizer"
  const isPending = booking.status === "pending"
  const otherName = isOrganizer ? booking.dj_name : booking.organizer_name

  const STATUS_COLOR: Record<string, string> = {
    pending: "#F77F00", accepted: "#22c55e", rejected: "#ff2d55", completed: "#007aff"
  }
  const STATUS_LABEL: Record<string, string> = {
    pending: "Pendiente", accepted: "Confirmado", rejected: "Rechazado", completed: "Completado"
  }

  return (
    <main className="flex flex-col h-screen bg-[#faf8f4]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white shrink-0">
        <span className="text-2xl font-bold tracking-tight text-[#1a1a2e]">mi<span className="text-[#ff2d55]">bibra</span></span>
        <Link href="/dashboard/bookings" className="flex items-center gap-1.5 text-sm text-[#003049]/50 hover:text-[#003049] transition-colors font-medium">
          <ArrowLeft className="size-4" /> Bookings
        </Link>
      </nav>

      {/* Info del evento */}
      <div className="bg-white border-b border-zinc-100 px-6 py-4 shrink-0">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="font-semibold text-[#003049] truncate">{booking.events.title}</h1>
            <p className="text-xs text-[#003049]/50">
              {formatDate(booking.events.event_date)} · {booking.events.city} · con {otherName}
            </p>
          </div>
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold shrink-0"
            style={{ backgroundColor: `${STATUS_COLOR[booking.status]}15`, color: STATUS_COLOR[booking.status] }}
          >
            {STATUS_LABEL[booking.status]}
          </span>
        </div>

        {/* Botones aceptar/rechazar (solo organizador, solo si pending) */}
        {isOrganizer && isPending && (
          <div className="max-w-2xl mx-auto flex flex-col gap-2 mt-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={agreedPrice}
                onChange={e => setAgreedPrice(e.target.value)}
                placeholder="Precio acordado (€) — opcional"
                className="flex-1 px-3 py-2 bg-zinc-50 border-2 border-zinc-100 rounded-full text-sm text-[#003049] placeholder:text-[#003049]/30 focus:outline-none focus:border-[#22c55e] transition-colors"
                min={0}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => updateStatus("accepted")}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-full font-semibold text-sm transition-colors"
              >
                <Check className="size-4" /> Aceptar DJ
              </button>
              <button
                onClick={() => updateStatus("rejected")}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#ff2d55] hover:bg-[#e0002d] text-white rounded-full font-semibold text-sm transition-colors"
              >
                <X className="size-4" /> Rechazar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          {messages.length === 0 && (
            <div className="text-center py-10">
              <p className="text-[#003049]/40 text-sm">Empieza la conversación 👋</p>
            </div>
          )}
          {messages.map(msg => {
            const isMe = msg.sender_id === userId
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? "bg-[#0d0d18] text-white rounded-br-sm"
                      : "bg-white border-2 border-zinc-100 text-[#003049] rounded-bl-sm"
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className={`text-xs mt-1 ${isMe ? "text-white/50" : "text-[#003049]/30"}`}>
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-zinc-100 px-6 py-4 shrink-0">
        <form onSubmit={sendMessage} className="max-w-2xl mx-auto flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2.5 bg-zinc-50 border-2 border-zinc-100 rounded-full text-sm text-[#003049] placeholder:text-[#003049]/30 focus:outline-none focus:border-[#F77F00] transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="w-11 h-11 bg-[#ff2d55] hover:bg-[#e0002d] disabled:opacity-40 text-white rounded-full flex items-center justify-center transition-colors shrink-0"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </main>
  )
}
