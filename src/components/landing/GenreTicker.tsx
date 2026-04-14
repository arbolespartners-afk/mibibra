"use client";

const GENRES = [
  "House", "Techno", "Reggaeton", "Hip Hop", "Comercial",
  "Deep House", "Latino", "Trap", "Flamenco", "Jazz",
  "R&B", "Electrónica", "Drum & Bass", "Minimal", "Afrobeats",
  "Salsa", "Cumbia", "EDM", "Trance", "Ambient",
];

const colors = [
  "bg-[#ff2d55] text-white",
  "bg-[#007aff] text-white",
  "bg-[#ffd60a] text-[#0d0d18]",
  "bg-[#ff2d55]/12 text-[#ff2d55] border border-[#ff2d55]/25",
  "bg-[#007aff]/12 text-[#007aff] border border-[#007aff]/25",
];

export function GenreTicker() {
  const doubled = [...GENRES, ...GENRES];

  return (
    <div className="overflow-hidden py-6 border-y border-zinc-100">
      <div
        className="flex gap-3 w-max"
        style={{
          animation: "ticker 30s linear infinite",
        }}
      >
        {doubled.map((g, i) => (
          <span
            key={i}
            className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${colors[i % colors.length]}`}
          >
            {g}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
