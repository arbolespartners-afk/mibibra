'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, Save, Eye, Pencil, MapPin, Globe, Share2 } from "lucide-react"

const EVENT_TYPES = [
  { name: "Boda", color: "#FCBF49", textColor: "#003049" },
  { name: "Discoteca", color: "#003049", textColor: "white" },
  { name: "Evento corporativo", color: "#0a4f7a", textColor: "white" },
  { name: "Festival", color: "#D62828", textColor: "white" },
  { name: "Cumpleaños", color: "#F77F00", textColor: "white" },
  { name: "Fiesta privada", color: "#FCBF49", textColor: "#003049" },
  { name: "Bar / Restaurante", color: "#003049", textColor: "white" },
  { name: "Hotel", color: "#0a4f7a", textColor: "white" },
  { name: "Terraza", color: "#F77F00", textColor: "white" },
  { name: "Afterwork", color: "#D62828", textColor: "white" },
]

type OrgProfile = {
  name: string
  company_name: string
  city: string
  bio: string
  event_types: string[]
  website: string
  instagram_url: string
  facebook_url: string
  tiktok_url: string
}

type Tab = "edit" | "preview"

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "EV"
}

export default function OrganizerProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<OrgProfile>({
    name: "", company_name: "", city: "", bio: "",
    event_types: [], website: "",
    instagram_url: "", facebook_url: "", tiktok_url: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>("edit")

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }
      setUserId(user.id)

      const { data: p } = await supabase.from("profiles").select("name, city, bio").eq("id", user.id).single()
      const { data: org } = await supabase.from("organizer_profiles").select("*").eq("id", user.id).single()

      setProfile({
        name: p?.name ?? "", city: p?.city ?? "", bio: p?.bio ?? "",
        company_name: org?.company_name ?? "",
        event_types: org?.event_types ?? [],
        website: org?.website ?? "",
        instagram_url: org?.instagram_url ?? "",
        facebook_url: org?.facebook_url ?? "",
        tiktok_url: org?.tiktok_url ?? "",
      })
      setLoading(false)
    }
    load()
  }, [router])

  function toggleEventType(type: string) {
    setProfile(prev => ({
      ...prev,
      event_types: prev.event_types.includes(type)
        ? prev.event_types.filter(t => t !== type)
        : [...prev.event_types, type],
    }))
  }

  async function handleSave() {
    if (!userId) return
    setSaving(true)
    await supabase.from("profiles").update({ name: profile.name, city: profile.city, bio: profile.bio }).eq("id", userId)
    await supabase.from("organizer_profiles").update({
      company_name: profile.company_name || null,
      event_types: profile.event_types,
      website: profile.website || null,
      instagram_url: profile.instagram_url || null,
      facebook_url: profile.facebook_url || null,
      tiktok_url: profile.tiktok_url || null,
    }).eq("id", userId)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-white"><p className="text-[#003049]/40 text-sm">Cargando...</p></main>
  }

  const inputClass = "w-full px-3 py-2.5 bg-white border-2 border-[#003049]/15 rounded-xl text-sm text-[#003049] placeholder:text-[#003049]/30 focus:outline-none focus:border-[#F77F00] transition-colors"
  const labelClass = "text-sm font-medium text-[#003049]"

  return (
    <main className="flex flex-col min-h-screen bg-[#f9f9f7]">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white">
        <span className="text-2xl font-bold tracking-tight text-[#003049]">mibibra</span>
        <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-[#003049]/50 hover:text-[#003049] transition-colors font-medium">
          <ArrowLeft className="size-4" /> Dashboard
        </Link>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#F77F00] via-[#FCBF49] to-[#F77F00] px-6 py-10">
        <div className="max-w-2xl mx-auto flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-white/30 flex items-center justify-center text-[#003049] text-2xl font-bold shrink-0 border-2 border-white/50">
            {getInitials(profile.name)}
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-[#003049] truncate">{profile.name || "Tu nombre"}</h1>
            {profile.company_name && <p className="text-[#003049]/70 text-sm font-medium">{profile.company_name}</p>}
            {profile.city && (
              <p className="text-[#003049]/60 text-sm flex items-center gap-1">
                <MapPin className="size-3.5" /> {profile.city}
              </p>
            )}
            {profile.event_types.length > 0 && (
              <p className="text-[#003049]/60 text-sm mt-1">{profile.event_types.length} tipos de evento</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-zinc-100 px-6">
        <div className="max-w-2xl mx-auto flex gap-1">
          {([["edit", Pencil, "Editar perfil"], ["preview", Eye, "Vista previa"]] as const).map(([t, Icon, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t ? "border-[#F77F00] text-[#F77F00]" : "border-transparent text-[#003049]/40 hover:text-[#003049]"
              }`}
            >
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full flex flex-col gap-5">
        {tab === "edit" ? (
          <>
            <Section title="Información básica">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Nombre de contacto</label>
                  <input className={inputClass} value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="Tu nombre" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Empresa / local (opcional)</label>
                  <input className={inputClass} value={profile.company_name} onChange={e => setProfile(p => ({ ...p, company_name: e.target.value }))} placeholder="Nombre del local o empresa" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Ciudad</label>
                  <input className={inputClass} value={profile.city} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} placeholder="Barcelona" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Descripción</label>
                  <textarea className={`${inputClass} resize-none`} value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} placeholder="Cuéntanos qué tipo de eventos organizas, tu experiencia..." rows={4} />
                </div>
              </div>
            </Section>

            <Section title="Tipo de eventos" subtitle="¿Qué tipo de eventos organizas?">
              <div className="flex flex-wrap gap-2">
                {EVENT_TYPES.map(({ name, color, textColor }) => {
                  const selected = profile.event_types.includes(name)
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggleEventType(name)}
                      style={selected ? { backgroundColor: color, color: textColor, borderColor: color } : {}}
                      className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                        selected ? "scale-105" : "bg-white border-[#003049]/15 text-[#003049]/70 hover:border-[#003049]/30"
                      }`}
                    >
                      {name}
                    </button>
                  )
                })}
              </div>
            </Section>

            <Section title="Redes sociales y web" subtitle="Ayuda a los DJs a conocerte mejor">
              <div className="flex flex-col gap-4">
                {[
                  { key: "website", label: "Web", placeholder: "https://tuweb.com", Icon: Globe, color: "#003049" },
                  { key: "instagram_url", label: "Instagram", placeholder: "https://instagram.com/...", Icon: Share2, color: "#E1306C" },
                  { key: "facebook_url", label: "Facebook", placeholder: "https://facebook.com/...", Icon: Share2, color: "#1877F2" },
                  { key: "tiktok_url", label: "TikTok", placeholder: "https://tiktok.com/@...", Icon: Globe, color: "#000000" },
                ].map(({ key, label, placeholder, Icon, color }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium flex items-center gap-1.5" style={{ color }}>
                      <Icon className="size-4" /> {label}
                    </label>
                    <input className={inputClass} value={profile[key as keyof OrgProfile] as string} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} />
                  </div>
                ))}
              </div>
            </Section>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3.5 bg-[#F77F00] hover:bg-[#d96e00] disabled:opacity-50 text-white rounded-full font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {saving ? "Guardando..." : saved ? "✓ Cambios guardados" : <><Save className="size-4" /> Guardar perfil</>}
            </button>
          </>
        ) : (
          /* Vista previa */
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[#003049]/50 text-center">Así verán tu perfil los DJs</p>
            <div className="bg-white rounded-2xl border-2 border-zinc-100 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-[#F77F00] to-[#FCBF49] p-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white/30 flex items-center justify-center text-[#003049] text-xl font-bold border-2 border-white/50">
                  {getInitials(profile.name)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#003049]">{profile.name || "Nombre"}</h2>
                  {profile.company_name && <p className="text-[#003049]/70 text-sm font-medium">{profile.company_name}</p>}
                  {profile.city && <p className="text-[#003049]/60 text-sm flex items-center gap-1 mt-0.5"><MapPin className="size-3" /> {profile.city}</p>}
                </div>
              </div>

              <div className="p-6 flex flex-col gap-5">
                {profile.bio ? (
                  <div>
                    <p className="text-xs font-semibold text-[#003049]/40 uppercase tracking-wider mb-2">Sobre nosotros</p>
                    <p className="text-sm text-[#003049]/70 leading-relaxed">{profile.bio}</p>
                  </div>
                ) : (
                  <p className="text-sm text-[#003049]/30 italic">Sin descripción todavía</p>
                )}

                {profile.event_types.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-[#003049]/40 uppercase tracking-wider mb-2">Tipo de eventos</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.event_types.map(t => {
                        const et = EVENT_TYPES.find(x => x.name === t)
                        return (
                          <span key={t} className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: et?.color ?? "#003049", color: et?.textColor ?? "white" }}>
                            {t}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}

                {(profile.website || profile.instagram_url || profile.facebook_url || profile.tiktok_url) && (
                  <div>
                    <p className="text-xs font-semibold text-[#003049]/40 uppercase tracking-wider mb-2">Redes y web</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.website && <SocialChip label="Web" url={profile.website} color="#003049" />}
                      {profile.instagram_url && <SocialChip label="Instagram" url={profile.instagram_url} color="#E1306C" />}
                      {profile.facebook_url && <SocialChip label="Facebook" url={profile.facebook_url} color="#1877F2" />}
                      {profile.tiktok_url && <SocialChip label="TikTok" url={profile.tiktok_url} color="#000000" />}
                    </div>
                  </div>
                )}

                <Link href="/dashboard/events/new" className="w-full py-3 bg-[#F77F00] text-white rounded-full font-semibold text-sm text-center block hover:bg-[#d96e00] transition-colors">
                  + Publicar nuevo evento
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 p-6 bg-white border-2 border-zinc-100 rounded-2xl">
      <div>
        <h2 className="font-semibold text-[#003049]">{title}</h2>
        {subtitle && <p className="text-[#003049]/50 text-sm mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function SocialChip({ label, url, color }: { label: string; url: string; color: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-opacity hover:opacity-70" style={{ borderColor: `${color}40`, color }}>
      {label} →
    </a>
  )
}
