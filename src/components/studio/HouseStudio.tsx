'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const STEPS = 16;

const TRACKS = [
  { id: 'kick',    label: 'KICK',    color: '#ff2d55', accent: '#ff6b85' },
  { id: 'snare',   label: 'SNARE',   color: '#007aff', accent: '#4da6ff' },
  { id: 'clap',    label: 'CLAP',    color: '#ff9500', accent: '#ffb84d' },
  { id: 'hihat',   label: 'HI-HAT',  color: '#ffd60a', accent: '#ffe566' },
  { id: 'openhat', label: 'OPEN HH', color: '#30d158', accent: '#70e896' },
  { id: 'bass',    label: 'BASS',    color: '#bf5af2', accent: '#d98fff' },
] as const;

type TrackId = typeof TRACKS[number]['id'];
type Pattern = Record<TrackId, boolean[]>;

const HOUSE_CHORDS: { label: string; freqs: number[] }[] = [
  { label: 'Am',  freqs: [220, 261.63, 329.63] },
  { label: 'Dm',  freqs: [146.83, 220, 293.66] },
  { label: 'F',   freqs: [174.61, 220, 261.63] },
  { label: 'G',   freqs: [196, 246.94, 293.66] },
  { label: 'Em',  freqs: [164.81, 196, 246.94] },
  { label: 'C',   freqs: [130.81, 164.81, 196] },
];

const DEFAULT_PATTERN: Pattern = {
  kick:    [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
  snare:   [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
  clap:    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false],
  hihat:   [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
  openhat: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true],
  bass:    [true, false, false, true, false, false, true, false, true, false, false, false, true, false, false, false],
};

function createKick(ctx: AudioContext, time: number, volume: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(30, time + 0.3);
  gain.gain.setValueAtTime(volume, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
  osc.start(time);
  osc.stop(time + 0.35);
}

function createSnare(ctx: AudioContext, time: number, volume: number) {
  const noise = ctx.createBufferSource();
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2000;
  filter.Q.value = 0.5;

  const gain = ctx.createGain();
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(volume * 0.8, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.frequency.value = 200;
  oscGain.gain.setValueAtTime(volume * 0.4, time);
  oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

  noise.start(time);
  osc.start(time);
  osc.stop(time + 0.15);
}

function createClap(ctx: AudioContext, time: number, volume: number) {
  for (let i = 0; i < 3; i++) {
    const noise = ctx.createBufferSource();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let j = 0; j < data.length; j++) data[j] = Math.random() * 2 - 1;
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;

    const gain = ctx.createGain();
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    const t = time + i * 0.01;
    gain.gain.setValueAtTime(volume * 0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    noise.start(t);
  }
}

function createHihat(ctx: AudioContext, time: number, open: boolean, volume: number) {
  const noise = ctx.createBufferSource();
  const duration = open ? 0.3 : 0.05;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 8000;

  const gain = ctx.createGain();
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(volume * 0.5, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
  noise.start(time);
}

function createBass(ctx: AudioContext, time: number, volume: number) {
  const osc = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 400;

  osc.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sawtooth';
  osc2.type = 'square';
  osc.frequency.value = 60;
  osc2.frequency.value = 60;
  osc2.detune.value = 7;

  gain.gain.setValueAtTime(volume * 0.7, time);
  gain.gain.setValueAtTime(volume * 0.3, time + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

  osc.start(time);
  osc2.start(time);
  osc.stop(time + 0.2);
  osc2.stop(time + 0.2);
}

function playChord(ctx: AudioContext, freqs: number[], volume: number) {
  freqs.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume * 0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.85);
  });
}

export function HouseStudio() {
  const [pattern, setPattern] = useState<Pattern>(DEFAULT_PATTERN);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(126);
  const [volume, setVolume] = useState(0.8);
  const [currentStep, setCurrentStep] = useState(-1);
  const [activeChord, setActiveChord] = useState<number | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const schedulerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextNoteTimeRef = useRef(0);
  const currentStepRef = useRef(0);
  const isPlayingRef = useRef(false);
  const bpmRef = useRef(bpm);
  const volumeRef = useRef(volume);
  const patternRef = useRef(pattern);

  useEffect(() => { bpmRef.current = bpm; }, [bpm]);
  useEffect(() => { volumeRef.current = volume; }, [volume]);
  useEffect(() => { patternRef.current = pattern; }, [pattern]);

  const getStepDuration = useCallback(() => 60 / bpmRef.current / 4, []);

  const scheduleNote = useCallback((step: number, time: number) => {
    const pat = patternRef.current;
    const vol = volumeRef.current;
    const ctx = audioCtxRef.current!;
    if (pat.kick[step])    createKick(ctx, time, vol);
    if (pat.snare[step])   createSnare(ctx, time, vol);
    if (pat.clap[step])    createClap(ctx, time, vol);
    if (pat.hihat[step])   createHihat(ctx, time, false, vol);
    if (pat.openhat[step]) createHihat(ctx, time, true, vol);
    if (pat.bass[step])    createBass(ctx, time, vol);
  }, []);

  const scheduler = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const lookahead = 0.1;
    while (nextNoteTimeRef.current < ctx.currentTime + lookahead) {
      scheduleNote(currentStepRef.current, nextNoteTimeRef.current);
      const step = currentStepRef.current;
      const noteTime = nextNoteTimeRef.current;
      // update visual step
      const delay = (noteTime - ctx.currentTime) * 1000;
      setTimeout(() => {
        if (isPlayingRef.current) setCurrentStep(step);
      }, Math.max(0, delay));

      nextNoteTimeRef.current += getStepDuration();
      currentStepRef.current = (currentStepRef.current + 1) % STEPS;
    }
  }, [scheduleNote, getStepDuration]);

  const start = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    currentStepRef.current = 0;
    nextNoteTimeRef.current = audioCtxRef.current.currentTime + 0.05;
    isPlayingRef.current = true;
    setIsPlaying(true);
    schedulerRef.current = setInterval(scheduler, 25);
  }, [scheduler]);

  const stop = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    setCurrentStep(-1);
    if (schedulerRef.current) clearInterval(schedulerRef.current);
  }, []);

  const toggleStep = (trackId: TrackId, step: number) => {
    setPattern(prev => ({
      ...prev,
      [trackId]: prev[trackId].map((v, i) => i === step ? !v : v),
    }));
  };

  const clearPattern = () => setPattern(() => {
    const empty = {} as Pattern;
    TRACKS.forEach(t => { empty[t.id] = Array(STEPS).fill(false); });
    return empty;
  });

  const resetPattern = () => setPattern(DEFAULT_PATTERN);

  const handleChord = (index: number) => {
    setActiveChord(index);
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    playChord(audioCtxRef.current, HOUSE_CHORDS[index].freqs, volume);
    setTimeout(() => setActiveChord(null), 300);
  };

  useEffect(() => () => { if (schedulerRef.current) clearInterval(schedulerRef.current); }, []);

  const stepGroups = [0, 4, 8, 12];

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white font-[family-name:var(--font-inter)] p-4 md:p-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-outfit)] tracking-tight">
              <span style={{ color: '#ff2d55' }}>HOUSE</span>{' '}
              <span style={{ color: '#007aff' }}>STUDIO</span>
            </h1>
            <p className="text-white/40 text-sm mt-1">Secuenciador de música house</p>
          </div>
          <a href="/" className="text-white/30 hover:text-white/60 text-sm transition-colors">
            ← volver
          </a>
        </div>

        {/* Transport Controls */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 mb-4 flex flex-wrap gap-4 items-center">
          <button
            onClick={isPlaying ? stop : start}
            className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all active:scale-95"
            style={{
              background: isPlaying
                ? 'linear-gradient(135deg, #ff2d55, #cc0033)'
                : 'linear-gradient(135deg, #30d158, #00a832)',
              boxShadow: isPlaying
                ? '0 0 20px #ff2d5566'
                : '0 0 20px #30d15866',
            }}
          >
            {isPlaying ? '■' : '▶'}
          </button>

          <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
            <div className="flex justify-between text-xs text-white/50">
              <span>BPM</span>
              <span className="font-bold text-white">{bpm}</span>
            </div>
            <input
              type="range" min={90} max={160} value={bpm}
              onChange={e => setBpm(Number(e.target.value))}
              className="w-full accent-[#ff2d55] h-1"
            />
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
            <div className="flex justify-between text-xs text-white/50">
              <span>VOLUMEN</span>
              <span className="font-bold text-white">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range" min={0} max={1} step={0.01} value={volume}
              onChange={e => setVolume(Number(e.target.value))}
              className="w-full accent-[#007aff] h-1"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={resetPattern}
              className="px-3 py-2 rounded-lg text-xs text-white/60 border border-white/10 hover:border-white/30 hover:text-white transition-all"
            >
              RESET
            </button>
            <button
              onClick={clearPattern}
              className="px-3 py-2 rounded-lg text-xs text-white/60 border border-white/10 hover:border-white/30 hover:text-white transition-all"
            >
              CLEAR
            </button>
          </div>
        </div>

        {/* Step Sequencer */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 mb-4">
          <div className="text-xs text-white/30 uppercase tracking-widest mb-4">Secuenciador</div>

          {/* Step numbers */}
          <div className="flex gap-1 mb-2 ml-[72px]">
            {Array.from({ length: STEPS }, (_, i) => (
              <div
                key={i}
                className="flex-1 text-center text-[10px] transition-colors"
                style={{ color: currentStep === i ? '#ffffff' : 'rgba(255,255,255,0.2)' }}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {TRACKS.map(track => (
            <div key={track.id} className="flex items-center gap-1 mb-2">
              <div
                className="w-[68px] text-[11px] font-bold tracking-wider shrink-0"
                style={{ color: track.color }}
              >
                {track.label}
              </div>
              {Array.from({ length: STEPS }, (_, step) => {
                const active = pattern[track.id][step];
                const isCurrent = currentStep === step && isPlaying;
                const isGroupStart = stepGroups.includes(step);
                return (
                  <button
                    key={step}
                    onClick={() => toggleStep(track.id, step)}
                    className="flex-1 h-8 rounded transition-all active:scale-95"
                    style={{
                      background: active
                        ? isCurrent ? track.accent : track.color
                        : isCurrent ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                      boxShadow: active && isCurrent ? `0 0 8px ${track.color}` : 'none',
                      border: isGroupStart ? `1px solid ${active ? track.color : 'rgba(255,255,255,0.12)'}` : `1px solid ${active ? track.color : 'rgba(255,255,255,0.06)'}`,
                      marginLeft: isGroupStart && step !== 0 ? '4px' : undefined,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Chord Pads */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6">
          <div className="text-xs text-white/30 uppercase tracking-widest mb-4">Acordes House</div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {HOUSE_CHORDS.map((chord, i) => (
              <button
                key={chord.label}
                onMouseDown={() => handleChord(i)}
                onTouchStart={(e) => { e.preventDefault(); handleChord(i); }}
                className="h-20 rounded-xl font-bold text-lg tracking-wide transition-all active:scale-95 select-none"
                style={{
                  background: activeChord === i
                    ? `linear-gradient(135deg, #007aff, #ff2d55)`
                    : 'rgba(255,255,255,0.06)',
                  border: activeChord === i
                    ? '1px solid #007aff'
                    : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: activeChord === i ? '0 0 20px #007aff55' : 'none',
                  color: activeChord === i ? '#fff' : 'rgba(255,255,255,0.6)',
                }}
              >
                {chord.label}
              </button>
            ))}
          </div>
          <p className="text-white/20 text-xs mt-4 text-center">
            Toca los acordes mientras el secuenciador corre para improvisar
          </p>
        </div>
      </div>
    </div>
  );
}
