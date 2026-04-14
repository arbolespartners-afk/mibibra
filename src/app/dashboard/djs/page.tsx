'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, Search, MapPin, Euro, Star, Music, ExternalLink, SlidersHorizontal, X } from "lucide-react"

type DJ = {
  id: string
  name: string
  city: string
  bio: string
  genres: string[]
  price_min: number | null
  price_max: number | null
  youtube_url: string | null
  soundcloud_url: string | null
  mixcloud_url: string | null
  rating: number
  no_show_count: number
}

const GENRE_COLORS: Record<string, { bg: string; text: string }> = {
  "House": { bg: "#003049", text: "white" },
  "Techno": { bg: "#1a1a2e", text: "white" },
  "Tech House": { bg: "#003049", text: "white" },
  "Deep House": { bg: "#007aff", text: "white" },
  "Electrónica": { bg: "#003049", text: "white" },
  "Drum & Bass": { bg: "#1a1a2e", text: "white" },
  "Trance": { bg: "#007aff", text: "white" },
  "Ambient": { bg: "#003049", text: "white" },
  "Reggaeton": { bg: "#F77F00", text: "white" },
  "Hip Hop": { bg: "#ff2d55", text: "white" },
  "R&B": { bg: "#ff2d55", text: "white" },
  "Trap": { bg: "#F77F00", text: "white" },
  "Comercial": { bg: "#ffd60a", text: "#003049" },
  "Latino": { bg: "#F77F00", text: "white" },
  "Flamenco": { bg: "#ff2d55", text: "white" },
  "Jazz": { bg: "#ffd60a", text: "#003049" },
}

const ALL_GENRES = Object.keys(GENRE_COLORS)

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "DJ"
}

const AVATAR_GRADIENTS = [
  "from-[#0d0d18] to-[#ff2d55]",
  "from-[#ff2d55] to-[#F77F00]",
  "from-[#F77F00] to-[#ffd60a]",
  "from-[#003049] to-[#F77F00]",
  "from-[#ff2d55] to-[#003049]",
]

export default function DJsPage() {
  const router = useRouter()
  const [djs, setDjs] = useState<DJ[]>([])
  const [filtered, setFiltered] = useState<DJ[]>([])
  const [search, setSearch] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }

      const { data } = await supabase
        .from("dj_profiles")
        .select(`
          id, genres, price_min, price_max, youtube_url, soundcloud_url, mixcloud_url, rating, no_show_count,
          profiles!inner(name, city, bio)
        `)
        .order("rating", { ascending: false })

      const djList: DJ[] = (data ?? []).map((d: any) => ({
        id: d.id,
        name: d.profiles?.name ?? "",
        city: d.profiles?.city ?? "",
        bio: d.profiles?.bio ?? "",
        genres: d.genres ?? [],
        price_min: d.price_min,
        price_max: d.price_max,
        youtube_url: d.youtube_url,
        soundcloud_url: d.soundcloud_url,
        mixcloud_url: d.mixcloud_url,
        rating: d.rating ?? 0,
        no_show_count: d.no_show_count ?? 0,
      }))

      setDjs(djList)
      setFiltered(djList)
      setLoading(false)
    }
    load()
  }, [router])

  useEffect(() => {
    let result = djs

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(dj =>
        dj.name.toLowerCase().includes(q) ||
        dj.city.toLowerCase().includes(q) ||
        dj.bio.toLowerCase().includes(q)
      )
    }

    if (selectedGenres.length > 0) {
      result = result.filter(dj => selectedGenres.some(g => dj.genres.includes(g)))
    }

    if (maxPrice) {
      result = result.filter(dj => !dj.price_min || dj.price_min <= Number(maxPrice))
    }

    setFiltered(result)
  }, [search, selectedGenres, maxPrice, djs])

  function toggleGenre(genre: string) {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    )
  }

  function clearFilters() {
    setSearch("")
    setSelectedGenres([])
    setMaxPrice("")
  }

  const hasFilters = search || selectedGenres.length > 0 || maxPrice

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
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Buscar DJs</h1>
            <p className="text-white/70 text-sm mt-1">{filtered.length} DJs disponibles</p>
          </div>
          {/* Buscador */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#003049]/40" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Busca por nombre o ciudad..."
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl text-sm text-[#003049] placeholder:text-[#003049]/30 focus:outline-none focus:ring-2 focus:ring-[#ffd60a]"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                showFilters || selectedGenres.length > 0 || maxPrice
                  ? "bg-[#ffd60a] text-[#003049]"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              <SlidersHorizontal className="size-4" />
              Filtros {selectedGenres.length > 0 && `(${selectedGenres.length})`}
            </button>
          </div>
        </div>
      </div>

      {/* Filtros expandibles */}
      {showFilters && (
        <div className="bg-white border-b border-zinc-100 px-6 py-5">
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#003049]">Filtrar por género</p>
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-[#ff2d55] font-medium hover:opacity-70">
                  <X className="size-3" /> Limpiar filtros
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {ALL_GENRES.map(genre => {
                const selected = selectedGenres.includes(genre)
                const colors = GENRE_COLORS[genre]
                return (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    style={selected ? { backgroundColor: colors.bg, color: colors.text, borderColor: colors.bg } : {}}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                      selected ? "" : "bg-white border-[#003049]/15 text-[#003049]/70 hover:border-[#003049]/30"
                    }`}
                  >
                    {genre}
                  </button>
                )
              })}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#003049]">Precio máximo (€)</label>
              <input
                type="number"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                placeholder="Ej: 500"
                className="w-48 px-3 py-2 bg-white border-2 border-[#003049]/15 rounded-xl text-sm text-[#003049] placeholder:text-[#003049]/30 focus:outline-none focus:border-[#F77F00] transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      {/* Lista de DJs */}
      <div className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="text-5xl">🎧</div>
            <h2 className="text-lg font-semibold text-[#003049]">No hay DJs con esos filtros</h2>
            <p className="text-[#003049]/50 text-sm">Prueba con otros géneros o ciudad</p>
            <button onClick={clearFilters} className="px-5 py-2.5 bg-[#ff2d55] text-white rounded-full font-semibold text-sm hover:bg-[#e0002d] transition-colors">
              Quitar filtros
            </button>
          </div>
        ) : (
          filtered.map((dj, i) => {
            const gradient = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]
            const hasMedia = dj.youtube_url || dj.soundcloud_url || dj.mixcloud_url
            return (
              <div key={dj.id} className="bg-white border-2 border-zinc-100 rounded-2xl overflow-hidden hover:border-[#F77F00] hover:shadow-md transition-all">
                <div className="p-5 flex flex-col gap-4">
                  {/* Top: avatar + info */}
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-lg font-bold shrink-0`}>
                      {getInitials(dj.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-[#003049] text-base">{dj.name}</h3>
                        {dj.rating > 0 && (
                          <div className="flex items-center gap-1 shrink-0">
                            <Star className="size-3.5 fill-[#ffd60a] text-[#ffd60a]" />
                            <span className="text-sm font-semibold text-[#003049]">{dj.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-[#003049]/50">
                        {dj.city && (
                          <span className="flex items-center gap-1"><MapPin className="size-3" />{dj.city}</span>
                        )}
                        {(dj.price_min || dj.price_max) && (
                          <span className="flex items-center gap-1">
                            <Euro className="size-3" />
                            {dj.price_min && dj.price_max ? `${dj.price_min} – ${dj.price_max}€` : `desde ${dj.price_min || dj.price_max}€`}
                          </span>
                        )}
                        {dj.no_show_count === 0 && (
                          <span className="text-green-600 font-medium">✓ Sin no-shows</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {dj.bio && (
                    <p className="text-sm text-[#003049]/60 leading-relaxed line-clamp-2">{dj.bio}</p>
                  )}

                  {/* Géneros */}
                  {dj.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {dj.genres.slice(0, 5).map(g => {
                        const colors = GENRE_COLORS[g] ?? { bg: "#003049", text: "white" }
                        return (
                          <span key={g} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${colors.bg}15`, color: colors.bg }}>
                            {g}
                          </span>
                        )
                      })}
                      {dj.genres.length > 5 && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-500">
                          +{dj.genres.length - 5}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Links + CTA */}
                  <div className="flex items-center gap-3 pt-1">
                    {hasMedia && (
                      <div className="flex gap-2">
                        {dj.youtube_url && (
                          <a href={dj.youtube_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border-2 border-[#FF0000]/20 text-[#FF0000] hover:bg-[#FF0000]/5 transition-colors">
                            <ExternalLink className="size-3" /> YT
                          </a>
                        )}
                        {dj.soundcloud_url && (
                          <a href={dj.soundcloud_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border-2 border-[#F77F00]/20 text-[#F77F00] hover:bg-[#F77F00]/5 transition-colors">
                            <ExternalLink className="size-3" /> SC
                          </a>
                        )}
                        {dj.mixcloud_url && (
                          <a href={dj.mixcloud_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border-2 border-[#003049]/20 text-[#003049] hover:bg-[#003049]/5 transition-colors">
                            <ExternalLink className="size-3" /> MC
                          </a>
                        )}
                      </div>
                    )}
                    <Link
                      href={`/dashboard/events/new?dj=${dj.id}`}
                      className="ml-auto flex items-center gap-2 px-4 py-2 bg-[#ff2d55] hover:bg-[#e0002d] text-white rounded-full text-xs font-semibold transition-colors"
                    >
                      <Music className="size-3.5" /> Contactar DJ
                    </Link>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </main>
  )
}
