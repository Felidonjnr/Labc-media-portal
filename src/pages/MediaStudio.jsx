// src/pages/MediaStudio.jsx
import { useState } from 'react';
import { useToast } from '../hooks/useToast';
import { 
  Camera, 
  Video, 
  Image as ImageIcon, 
  Sparkles, 
  History, 
  Clock, 
  Layout, 
  Smartphone,
  ChevronRight,
  FlaskConical,
  Zap,
  Layers,
  Monitor,
  Dribbble,
  Palette,
  Wand2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function MediaStudio() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 pt-4 px-4 leading-tight">
      {/* Dynamic Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-navy text-gold flex items-center justify-center shadow-lg shadow-navy/20">
            <FlaskConical size={20} />
          </div>
          <h2 className="text-3xl font-display font-bold text-navy tracking-tighter uppercase">Production Lab</h2>
        </div>
        <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.3em] pl-1">Experimental Media Architecture & Visual Intelligence</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Featured Engine: Spotlight */}
        <div className="lg:col-span-2 premium-card p-10 flex flex-col md:flex-row items-center gap-10 bg-white border-slate-100 shadow-2xl shadow-navy/5 relative group overflow-hidden">
           <div className="w-full md:w-1/2 space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-gold/10 text-gold rounded-full text-[9px] font-black uppercase tracking-widest border border-gold/10 flex items-center gap-2">
                   <Activity size={10} className="animate-pulse" />
                   Alpha Release
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-display font-bold text-navy tracking-tight uppercase italic leading-none mb-4">Member Spotlight Architecture</h3>
                <p className="text-[12px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter max-w-sm">
                  Autonomous story generation for exceptional members, anniversaries, and community impact narratives.
                </p>
              </div>
              <button className="btn-primary h-14 px-10 italic text-[11px] tracking-[0.2em]">
                 ACCESS ENGINE
              </button>
           </div>
           
           <div className="w-full md:w-1/2 relative">
              <div className="aspect-square rounded-3xl bg-offwhite flex items-center justify-center relative group-hover:scale-[1.02] transition-transform duration-700">
                 <Camera size={80} strokeWidth={1} className="text-navy/5 group-hover:text-gold/20 transition-colors" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full border-4 border-dashed border-gold/20 animate-spin-slow" />
                 </div>
              </div>
           </div>

           <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
              <Layers size={240} />
           </div>
        </div>

        {/* Video Intelligence Card */}
        <div className="premium-card p-10 flex flex-col justify-between space-y-10 bg-navy text-white border-none shadow-2xl shadow-navy/20 group relative overflow-hidden">
           <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gold">
                 <Video size={24} />
              </div>
              <h3 className="text-2xl font-display font-bold italic tracking-tight uppercase leading-tight">Clip Logic Generation</h3>
              <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                Neuro-scripts for Sunday highlights, testimonies, and short-form dissemination.
              </p>
           </div>
           
           <div className="pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-gold" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Neural Sync: 88%</span>
              </div>
              <button className="text-[10px] font-bold text-gold hover:text-white transition-colors uppercase tracking-[0.2em]">
                 CONNECT
              </button>
           </div>

           <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-gold/5 to-transparent pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Event Captions', icon: Sparkles, color: '#D4AF37' },
          { label: 'Visual Prompts', icon: ImageIcon, color: '#3B82F6' },
          { label: 'Dynamic Hooks', icon: Layout, color: '#10B981' },
          { label: 'Shorts Synthesis', icon: Smartphone, color: '#F43F5E' },
        ].map((item, i) => (
          <div key={i} className="premium-card p-8 bg-white border-slate-50 flex flex-col items-center justify-center gap-6 group hover:shadow-xl hover:shadow-navy/5 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-offwhite flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:text-gold transition-all duration-500">
              <item.icon size={28} strokeWidth={1.5} />
            </div>
            <div className="text-center space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-navy">{item.label}</div>
              <div className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-300 italic">Core Module v1.0</div>
            </div>
          </div>
        ))}
      </div>

      {/* Roadmap Architecture */}
      <div className="premium-card p-14 bg-white border-slate-100 shadow-2xl shadow-navy/5 relative overflow-hidden group">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
           <div className="space-y-6 max-w-2xl px-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center text-gold">
                   <Clock size={16} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-navy">Development Roadmap</span>
              </div>
              <h3 className="text-4xl font-display font-bold italic tracking-tighter uppercase text-navy leading-[0.9]">Expanding the Visual Intelligence Horizon</h3>
              <p className="text-[13px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">
                We are developing direct-to-cloud visual processing units. By Q4, LAMP will support autonomous multi-platform asset deployment and automated video color-grading presets based on church brand intelligence.
              </p>
           </div>
           <div className="flex flex-col gap-4 shrink-0 w-full lg:w-auto">
              <button className="btn-primary h-16 px-12 italic text-[11px] tracking-[0.2em] shadow-xl shadow-navy/10">
                SUBSCRIBE TO LAB FEED
              </button>
              <button className="h-16 px-12 bg-offwhite hover:bg-white border border-slate-100 text-navy rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3">
                VIEW CHANGELOG
                <ChevronRight size={14} />
              </button>
           </div>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 pointer-events-none transition-transform duration-1000 group-hover:scale-[1.6]">
           <Monitor size={300} />
        </div>
      </div>
    </div>
  );
}

function Activity({ className, size }) {
  return (
     <svg 
       width={size} 
       height={size} 
       viewBox="0 0 24 24" 
       fill="none" 
       stroke="currentColor" 
       strokeWidth="3" 
       strokeLinecap="round" 
       strokeLinejoin="round"
       className={className}
     >
       <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
     </svg>
  )
}

