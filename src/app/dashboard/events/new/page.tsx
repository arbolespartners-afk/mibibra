'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, Calendar, MapPin, Euro, Clock } from "lucide-react"

const EVENT_TYPES = [
  "Boda", "Discoteca", "Evento corporativo", "Festival",
  "Cumpleaños", "Fiesta privada", "Bar / Restaurante",
  "Hotel", "Terraza", "Afterwork",
]

const EVENT_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  "Boda": { bg: "#FCBF49", text: "#003049" },
  "Discoteca": { bg: "#003049", text: "white" },
  "Evento corporativo": { bg: "#0a4f7a", text: "white" },
  "Festival": { bg: "#D62828", text: "white" },
  "Cumpleaños": { bg: "#F77F00", text: "white" },
  "Fiesta privada": { bg: "#FCBF49", text: "#003049" },
  "Bar / Restaurante": { bg: "#003049", text: "white" },
  "Hotel": { bg: "#0a4f7a", text: "white" },
  "Terraza": { bg: "#F77F00", text: "white" },
  "Afterwork": { bg: "#D62828", text: "white" },
}

export default function NewEventPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: "",
    event_type: "",
    event_date: "",
    start_time: "",
    end_time: "",
    city: "",
    budget_min: "",
    budget_max: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.event_type) { setError("Selecciona el tipo de evento"); return }
    setError("")
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/auth/login"); return }

    const { error: insertError } = await supabase.from("events").insert({
      organizer_id: user.id,
      title: form.title,
      event_type: form.event_type,
      event_date: form.event_date,
      start_time: form.start_time || null,
      end_time: form.end_time || null,
      city: form.city,
      budget_min: form.budget_min ? Number(form.budget_min) : null,
      budget_max: form.budget_max ? Number(form.budget_max) : null,
      description: form.description,
      status: "open",
    })

    if (insertError) {
      setError("Error al publicar el evento. Inténtalo de nuevo.")
      setLoading(false)
      return
    }

    router.push("/dashboard/events")
  }

  const inputClass = "w-full px-3 py-2.5 bg-white border-2 border-[#003049]/15 rounded-xl text-sm text-[#003049] placeholder:text-[#003049]/30 focus:outline-none focus:border-[#F77F00] transition-colors"
  const labelClass = "text-sm font-medium text-[#003049] flex items-center gap-1.5"

  return (
    <main className="flex flex-col min-h-screen bg-[#f9f9f7]">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white">
        <span className="text-2xl font-bold tracking-tight text-[#003049]">mibibra</span>
        <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-[#003049]/50 hover:text-[#003049] transition-colors font-medium">
          <ArrowLeft className="size-4" /> Dashboard
        </Link>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#D62828] to-[#F77F00] px-6 py-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Publicar evento</h1>
          <p className="text-white/70 text-sm mt-1">Los DJs disponibles podrán ver tu evento y solicitar el bolo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full flex flex-col gap-5">

        {/* Tipo de evento */}
        <div className="flex flex-col gap-4 p-6 bg-white border-2 border-zinc-100 rounded-2xl">
          <div>
            <h2 className="font-semibold text-[#003049]">Tipo de evento</h2>
            <p className="text-[#003049]/50 text-sm mt-0.5">¿Qué tipo de evento es?</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {EVENT_TYPES.map(type => {
              const selected = form.event_type === type
              const colors = EVENT_TYPE_COLORS[type]
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, event_type: type }))}
                  style={selected ? { backgroundColor: colors.bg, color: colors.text, borderColor: colors.bg } : {}}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                    selected ? "scale-105" : "bg-white border-[#003049]/15 text-[#003049]/70 hover:border-[#003049]/30"
                  }`}
                >
                  {type}
                </button>
              )
            })}
          </div>
        </div>

        {/* Info del evento */}
        <div className="flex flex-col gap-4 p-6 bg-white border-2 border-zinc-100 rounded-2xl">
          <h2 className="font-semibold text-[#003049]">Detalles del evento</h2>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Título del evento</label>
            <input
              className={inputClass}
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder='Ej: "DJ para boda en el Poble Nou"'
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}><MapPin className="size-4 text-[#003049]/40" /> Ciudad</label>
            <input className={inputClass} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Barcelona" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}><Calendar className="size-4 text-[#003049]/40" /> Fecha</label>
            <input type="date" className={inputClass} value={form.event_date} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))} required min={new Date().toISOString().split("T")[0]} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}><Clock className="size-4 text-[#003049]/40" /> Hora inicio</label>
              <input type="time" className={inputClass} value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}><Clock className="size-4 text-[#003049]/40" /> Hora fin</label>
              <input type="time" className={inputClass} value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Descripción</label>
            <textarea
              className={`${inputClass} resize-none`}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Cuéntanos más sobre el evento: tipo de música que buscas, ambiente, número de personas..."
              rows={4}
            />
          </div>
        </div>

        {/* Presupuesto */}
        <div className="flex flex-col gap-4 p-6 bg-white border-2 border-zinc-100 rounded-2xl">
          <div>
            <h2 className="font-semibold text-[#003049]">Presupuesto</h2>
            <p className="text-[#003049]/50 text-sm mt-0.5">El DJ podrá negociar contigo dentro de este rango</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}><Euro className="size-4 text-[#003049]/40" /> Desde (€)</label>
              <input type="number" className={inputClass} value={form.budget_min} onChange={e => setForm(f => ({ ...f, budget_min: e.target.value }))} placeholder="200" min={0} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}><Euro className="size-4 text-[#003049]/40" /> Hasta (€)</label>
              <input type="number" className={inputClass} value={form.budget_max} onChange={e => setForm(f => ({ ...f, budget_max: e.target.value }))} placeholder="600" min={0} />
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-[#D62828] bg-[#D62828]/5 border border-[#D62828]/20 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#D62828] hover:bg-[#b82020] disabled:opacity-50 text-white rounded-full font-semibold text-sm transition-colors"
        >
          {loading ? "Publicando..." : "Publicar evento →"}
        </button>
      </form>
    </main>
  )
}
