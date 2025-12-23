
import React, { useState, useRef } from 'react';
import { useStore } from '../store';
import { AppPhase, Gesture } from '../types';
import { Play, Pause, Music, Snowflake, Image as ImageIcon } from 'lucide-react';

const UI: React.FC = () => {
  const phase = useStore(state => state.phase);
  const gesture = useStore(state => state.gesture);
  const setCustomPhotos = useStore(state => (state as any).setCustomPhotos);
  const customPhotos = useStore(state => (state as any).customPhotos);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(e => console.error("Playback failed", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      setCustomPhotos(urls);
    }
  };

  const getInstruction = () => {
    if (phase === AppPhase.TREE) return "Use 'Open Palm' to bloom the tree";
    if (phase === AppPhase.NEBULA) return "Use 'Open Palm' to rotate, 'Closed Fist' to reset";
    return "The Winter magic is unfolding...";
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex flex-col justify-between p-10 select-none">
      {/* Top Left: Status & Upload */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="bg-sky-950/20 backdrop-blur-xl border border-sky-400/20 px-4 py-2 rounded-2xl self-start shadow-2xl">
            <p className="text-[10px] uppercase tracking-widest text-sky-300/60 mb-1 font-bold">Winter Phase</p>
            <p className="text-xl font-light tracking-wide text-sky-50 capitalize">{phase}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-400/10 backdrop-blur border border-sky-400/20 rounded-full self-start">
            <div className={`w-2 h-2 rounded-full ${gesture !== Gesture.NONE ? 'bg-sky-400 animate-ping' : 'bg-white/10'}`} />
            <span className="text-[10px] uppercase tracking-tighter text-sky-100/80 font-semibold">{getInstruction()}</span>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-6 py-3 bg-sky-600/20 hover:bg-sky-600/40 backdrop-blur-2xl border border-sky-400/30 rounded-full transition-all text-[11px] font-bold tracking-[0.2em] uppercase text-white shadow-[0_0_30px_rgba(14,165,233,0.3)] group"
          >
            <ImageIcon size={16} className="text-sky-300 group-hover:rotate-12 transition-transform" />
            {customPhotos.length > 0 ? `${customPhotos.length} Memories Shared` : 'Personalize Photo Wall'}
          </button>
          <input 
            ref={fileInputRef}
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Center: Hero Title */}
      <div className={`text-center transition-all duration-1000 ${phase === AppPhase.TREE ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <h1 className="font-cursive text-8xl md:text-[10rem] text-transparent bg-clip-text bg-gradient-to-b from-white via-sky-100 to-sky-400 drop-shadow-[0_0_50px_rgba(125,211,252,0.6)]">
          Merry Christmas
        </h1>
        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="h-px w-10 bg-sky-500/30" />
          <p className="text-sky-300/60 tracking-[0.6em] uppercase text-[10px] font-bold italic">Winter's First Snow</p>
          <div className="h-px w-10 bg-sky-500/30" />
        </div>
      </div>

      {/* Bottom: Music Player */}
      <div className="flex flex-col items-center gap-6">
        <div className="pointer-events-auto flex flex-col items-center bg-sky-950/40 backdrop-blur-3xl border border-sky-400/10 rounded-[2.5rem] px-12 py-6 shadow-[0_40px_80px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-8">
            <button onClick={toggleMusic} className="w-16 h-16 flex items-center justify-center rounded-full bg-sky-500/20 hover:bg-sky-500/40 text-white transition-all ring-1 ring-sky-400/30 group relative">
              <div className="absolute inset-0 rounded-full bg-sky-400/10 animate-pulse" />
              {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} className="ml-1" fill="white" />}
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <Music size={16} className="text-sky-400 animate-pulse" />
                <span className="text-sm font-bold tracking-widest text-white/95 uppercase">첫 눈 (First Snow)</span>
                <span className="text-[10px] text-sky-400/60 font-medium px-2 py-0.5 bg-sky-400/10 rounded-md">EXO</span>
              </div>
              <div className="h-1.5 w-64 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r from-sky-500 to-blue-400 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.8)] ${isPlaying ? 'animate-[progress_240s_linear_infinite]' : 'w-0'}`} />
              </div>
            </div>
            <div className={`${isPlaying ? 'animate-spin-slow' : ''} text-sky-400/40 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]`}>
              <Snowflake size={32} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 text-[10px] text-sky-300/30 uppercase tracking-[0.4em] font-black">
          <span>Crystal Blue Edition</span>
          <div className="w-1.5 h-1.5 bg-sky-500/40 rotate-45" />
          <span>Interactive Winter Wonderland</span>
        </div>
      </div>

      <audio 
        ref={audioRef} 
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" 
        loop 
      />
      
      <style>{`
        @keyframes progress { from { width: 0%; } to { width: 100%; } }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default UI;
