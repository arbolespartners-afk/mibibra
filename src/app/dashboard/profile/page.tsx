'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, Save, Eye, Pencil, MapPin, Euro, Star, Music } from "lucide-react"

const GENRES: { name: string; color: string; textColor?: string }[] = [
  { name: "House", color: "#003049", textColor: "white" },
  { name: "Techno", color: "#1a1a2e", textColor: "white" },
  { name: "Tech House", color: "#003049", textColor: "white" },
  { name: "Deep House", color: "#007aff", textColor: "white" },
  { name: "Electrónica", color: "#003049", textColor: "white" },
  { name: "Drum & Bass", color: "#1a1a2e", textColor: "white" },
  { name: "Trance", color: "#007aff", textColor: "white" },
  { name: "Ambient", color: "#003049", textColor: "white" },
  { name: "Reggaeton", color: "#F77F00", textColor: "white" },
  { name: "Hip Hop", color: "#ff2d55", textColor: "white" },
  { name: "R&B", color: "#ff2d55", textColor: "white" },
  { name: "Trap", color: "#F77F00", textColor: "white" },
  { name: "Comercial", color: "#ffd60a", textColor: "#003049" },
  { name: "Latino", color: "#F77F00", textColor: "white" },
  { name: "Flamenco", color: "#ff2d55", textColor: "white" },
  { name: "Jazz", color: "#ffd60a", textColor: "#003049" },
]

type DJProfile = {
  name: string
  city: string
  bio: string
  genres: string[]
  price_min: number | ""
  price_max: number | ""
  youtube_url: string
  soundcloud_url: string
  mixcloud_url: string
  rating: number
  no_show_count: number
}

type Tab = "edit" | "preview"

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "DJ"
}

export default function DJProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<DJProfile>({
    name: "", city: "", bio: "", genres: [],
    price_min: "", price_max: "",
    youtube_url: "", soundcloud_url: "", mixcloud_url: "",
    rating: 0, no_show_count: 0,
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
      const { data: dj } = await supabase.from("dj_profiles").select("*").eq("id", user.id).single()

      setProfile({
        name: p?.name ?? "", city: p?.city ?? "", bio: p?.bio ?? "",
        genres: dj?.genres ?? [],
        price_min: dj?.price_min ?? "", price_max: dj?.price_max ?? "",
        youtube_url: dj?.youtube_url ?? "", soundcloud_url: dj?.soundcloud_url ?? "", mixcloud_url: dj?.mixcloud_url ?? "",
        rating: dj?.rating ?? 0, no_show_count: dj?.no_show_count ?? 0,
      })
      setLoading(false)
    }
    load()
  }, [router])

  function toggleGenre(genre: string) {
    setProfile(prev => ({
      ...prev,
      genres: prev.genres.includes(genre) ? prev.genres.filter(g => g !== genre) : [...prev.genres, genre],
    }))
  }

  async function handleSave() {
    if (!userId) return
    setSaving(true)
    await supabase.from("profiles").update({ name: profile.name, city: profile.city, bio: profile.bio }).eq("id", userId)
    await supabase.from("dj_profiles").update({
      genres: profile.genres,
      price_min: profile.price_min || null, price_max: profile.price_max || null,
      youtube_url: profile.youtube_url || null, soundcloud_url: profile.soundcloud_url || null, mixcloud_url: profile.mixcloud_url || null,
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
    <main className="flex flex-col min-h-screen bg-[#faf8f4]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white">
        <span className="text-2xl font-bold tracking-tight text-[#1a1a2e]">mi<span className="text-[#ff2d55]">bibra</span></span>
        <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-[#003049]/50 hover:text-[#003049] transition-colors font-medium">
          <ArrowLeft className="size-4" /> Dashboard
        </Link>
      </nav>

      {/* Header del perfil */}
      <div className="bg-gradient-to-r from-[#003049] via-[#ff2d55] to-[#F77F00] px-6 py-10">
        <div className="max-w-2xl mx-auto flex items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold shrink-0 border-2 border-white/30">
            {getInitials(profile.name)}
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white truncate">{profile.name || "Tu nombre"}</h1>
            {profile.city && (
              <p className="text-white/70 text-sm flex items-center gap-1">
                <MapPin className="size-3.5" /> {profile.city}
              </p>
            )}
            {/* Stats */}
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1 text-white/80 text-sm">
                <Star className="size-3.5 fill-[#ffd60a] text-[#ffd60a]" />
                <span>{profile.rating > 0 ? profile.rating.toFixed(1) : "Nuevo"}</span>
              </div>
              {(profile.price_min || profile.price_max) && (
                <div className="flex items-center gap-1 text-white/80 text-sm">
                  <Euro className="size-3.5" />
                  <span>
                    {profile.price_min && profile.price_max
                      ? `${profile.price_min} – ${profile.price_max}`
                      : profile.price_min || profile.price_max}
                  </span>
                </div>
              )}
              {profile.genres.length > 0 && (
                <div className="flex items-center gap-1 text-white/80 text-sm">
                  <Music className="size-3.5" />
                  <span>{profile.genres.length} géneros</span>
                </div>
              )}
            </div>
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
                tab === t
                  ? "border-[#ff2d55] text-[#ff2d55]"
                  : "border-transparent text-[#003049]/40 hover:text-[#003049]"
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
            {/* Info básica */}
            <Section title="Información básica">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Nombre artístico</label>
                  <input className={inputClass} value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="DJ Nombre" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Ciudad</label>
                  <input className={inputClass} value={profile.city} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} placeholder="Barcelona" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Bio</label>
                  <textarea className={`${inputClass} resize-none`} value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} placeholder="Cuéntanos quién eres, tu experiencia, estilo..." rows={4} />
                </div>
              </div>
            </Section>

            {/* Géneros */}
            <Section title="Géneros musicales" subtitle="Selecciona los géneros que tocas">
              <div className="flex flex-wrap gap-2">
                {GENRES.map(({ name, color, textColor }) => {
                  const selected = profile.genres.includes(name)
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggleGenre(name)}
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

            {/* Precio */}
            <Section title="Tarifa" subtitle="Precio orientativo en euros. Los organizadores podrán negociar contigo.">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Desde (€)</label>
                  <input type="number" className={inputClass} value={profile.price_min} onChange={e => setProfile(p => ({ ...p, price_min: e.target.value ? Number(e.target.value) : "" }))} placeholder="200" min={0} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Hasta (€)</label>
                  <input type="number" className={inputClass} value={profile.price_max} onChange={e => setProfile(p => ({ ...p, price_max: e.target.value ? Number(e.target.value) : "" }))} placeholder="800" min={0} />
                </div>
              </div>
            </Section>

            {/* Links */}
            <Section title="Links de sets y mixes" subtitle="Comparte tus mejores sets para que los organizadores puedan escucharte">
              <div className="flex flex-col gap-4">
                {[
                  { key: "youtube_url", label: "YouTube", placeholder: "https://youtube.com/...", color: "#FF0000" },
                  { key: "soundcloud_url", label: "SoundCloud", placeholder: "https://soundcloud.com/...", color: "#F77F00" },
                  { key: "mixcloud_url", label: "Mixcloud", placeholder: "https://mixcloud.com/...", color: "#003049" },
                ].map(({ key, label, placeholder, color }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className={labelClass} style={{ color }}>{label}</label>
                    <input className={inputClass} value={profile[key as keyof DJProfile] as string} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} />
                  </div>
                ))}
              </div>
            </Section>

            {/* Guardar */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3.5 bg-[#ff2d55] hover:bg-[#e0002d] disabled:opacity-50 text-white rounded-full font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {saving ? "Guardando..." : saved ? "✓ Cambios guardados" : <><Save className="size-4" /> Guardar perfil</>}
            </button>
          </>
        ) : (
          /* Vista previa */
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[#003049]/50 text-center">Así verán tu perfil los organizadores de eventos</p>
            <div className="bg-white rounded-2xl border-2 border-zinc-100 overflow-hidden shadow-sm">
              {/* Header de la tarjeta */}
              <div className="bg-gradient-to-r from-[#003049] to-[#ff2d55] p-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-white text-xl font-bold border-2 border-white/30">
                  {getInitials(profile.name)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{profile.name || "Nombre del DJ"}</h2>
                  {profile.city && <p className="text-white/70 text-sm flex items-center gap-1 mt-0.5"><MapPin className="size-3" /> {profile.city}</p>}
                </div>
              </div>

              <div className="p-6 flex flex-col gap-5">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <StatBox label="Valoración" value={profile.rating > 0 ? `${profile.rating.toFixed(1)} ★` : "Nuevo"} color="#ffd60a" />
                  <StatBox label="Tarifa" value={profile.price_min && profile.price_max ? `${profile.price_min}–${profile.price_max}€` : "A consultar"} color="#F77F00" />
                  <StatBox label="No-shows" value={profile.no_show_count === 0 ? "Ninguno ✓" : `${profile.no_show_count}`} color={profile.no_show_count === 0 ? "#22c55e" : "#ff2d55"} />
                </div>

                {/* Bio */}
                {profile.bio ? (
                  <div>
                    <p className="text-xs font-semibold text-[#003049]/40 uppercase tracking-wider mb-2">Sobre mí</p>
                    <p className="text-sm text-[#003049]/70 leading-relaxed">{profile.bio}</p>
                  </div>
                ) : (
                  <p className="text-sm text-[#003049]/30 italic">Sin bio todavía — ¡añade una descripción!</p>
                )}

                {/* Géneros */}
                {profile.genres.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-[#003049]/40 uppercase tracking-wider mb-2">Géneros</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.genres.map(g => {
                        const genre = GENRES.find(x => x.name === g)
                        return (
                          <span
                            key={g}
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: genre?.color ?? "#003049", color: genre?.textColor ?? "white" }}
                          >
                            {g}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Links */}
                {(profile.youtube_url || profile.soundcloud_url || profile.mixcloud_url) && (
                  <div>
                    <p className="text-xs font-semibold text-[#003049]/40 uppercase tracking-wider mb-2">Sets y mixes</p>
                    <div className="flex flex-col gap-2">
                      {profile.youtube_url && <LinkChip label="YouTube" url={profile.youtube_url} color="#FF0000" />}
                      {profile.soundcloud_url && <LinkChip label="SoundCloud" url={profile.soundcloud_url} color="#F77F00" />}
                      {profile.mixcloud_url && <LinkChip label="Mixcloud" url={profile.mixcloud_url} color="#003049" />}
                    </div>
                  </div>
                )}

                <button className="w-full py-3 bg-[#ff2d55] text-white rounded-full font-semibold text-sm">
                  Solicitar este DJ
                </button>
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

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col gap-1 p-3 bg-zinc-50 rounded-xl text-center">
      <span className="text-xs text-[#003049]/40 font-medium">{label}</span>
      <span className="text-sm font-bold" style={{ color }}>{value}</span>
    </div>
  )
}

function LinkChip({ label, url, color }: { label: string; url: string; color: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-colors hover:opacity-80"
      style={{ borderColor: `${color}30`, color }}
    >
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      {label} →
    </a>
  )
}
