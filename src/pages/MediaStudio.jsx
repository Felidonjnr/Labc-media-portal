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
  FlaskConical
} from 'lucide-react';
import { motion } from 'motion/react';

export default function MediaStudio() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center shadow-lg shadow-navy/20">
               <FlaskConical size={20} />
             </div>
             <h2 className="text-3xl font-bold text-navy tracking-tight uppercase tracking-widest italic">The Production Lab</h2>
          </div>
          <p className="text-slate-500 font-medium tracking-wide">Experimental tools for visual storytelling and media transformation.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Spotlight Placeholder */}
        <div className="premium-card p-10 flex flex-col items-center text-center space-y-6 bg-ivory/20 border-dashed border-2">
           <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-sm border border-slate-100 text-gold active:rotate-12 transition-transform duration-500">
             <Camera size={32} />
           </div>
           <div className="space-y-2">
             <h3 className="text-sm font-black text-navy uppercase tracking-[0.2em]">Member Spotlight Engine</h3>
             <p className="text-xs text-slate-400 max-w-xs leading-relaxed font-medium">
               Automatically generate inspiring captions and stories for outstanding members and anniversaries.
             </p>
           </div>
           <div className="flex items-center gap-2">
             <span className="px-3 py-1 rounded-full bg-navy text-white text-[8px] font-black uppercase tracking-widest">Status: Prototyping</span>
           </div>
        </div>

        {/* Video Placeholder */}
        <div className="premium-card p-10 flex flex-col items-center text-center space-y-6 bg-ivory/20 border-dashed border-2">
           <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-sm border border-slate-100 text-blue-500 active:-rotate-12 transition-transform duration-500">
             <Video size={32} />
           </div>
           <div className="space-y-2">
             <h3 className="text-sm font-black text-navy uppercase tracking-[0.2em]">Clip Intelligence</h3>
             <p className="text-xs text-slate-400 max-w-xs leading-relaxed font-medium">
               AI-optimized short-form scripts for Sunday highlights and testimony videos.
             </p>
           </div>
           <div className="flex items-center gap-2">
             <span className="px-3 py-1 rounded-full bg-navy text-white text-[8px] font-black uppercase tracking-widest">Status: Prototyping</span>
           </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Event Captions', icon: Sparkles },
          { label: 'Visual Prompts', icon: ImageIcon },
          { label: 'Story Hooks', icon: Layout },
          { label: 'Shorts Script', icon: Smartphone },
        ].map((item, i) => (
          <div key={i} className="premium-card p-4 flex flex-col items-center justify-center gap-3 text-slate-300 opacity-60">
            {(() => {
              const Icon = item.icon;
              return <Icon size={18} />;
            })()}
            <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Future Roadmap */}
      <div className="premium-card p-8 bg-navy text-white relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="space-y-4 max-w-lg">
             <div className="flex items-center gap-2 text-gold">
               <History size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">Lab Roadmap</span>
             </div>
             <h3 className="text-2xl font-bold italic tracking-tight uppercase tracking-widest">Expanding the Visual Horizon</h3>
             <p className="text-sm text-slate-400 leading-relaxed">
               We are developing advanced integrations with social image APIs and video analysis tools to make LAMP the absolute source for all church media.
             </p>
           </div>
           <button className="h-12 px-8 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all backdrop-blur-sm border border-white/10 flex items-center gap-2 shrink-0">
             Subscribe to Updates
             <ChevronRight size={14} />
           </button>
        </div>
        <div className="absolute top-0 right-0 h-40 w-40 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:scale-150 transition-transform duration-700" />
      </div>
    </div>
  );
}
