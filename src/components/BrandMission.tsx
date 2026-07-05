import React from 'react';
import { Sparkles, Heart, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
// @ts-ignore
import missionBg from '../assets/images/timeline_mission_statement_bg_1783277946508.jpg';

export default function BrandMission() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section 
      id="timeline-manifesto-section" 
      className="border-y border-zinc-900 bg-zinc-950/40 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Breathtaking Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative group" 
            id="manifesto-image-container"
          >
            <div className="absolute -inset-1 rounded-sm bg-gradient-to-r from-emerald-950/20 via-zinc-900/30 to-emerald-950/10 opacity-30 blur-xl transition duration-1000 group-hover:opacity-50"></div>
            <div className="relative border border-zinc-900/80 bg-zinc-900/20 p-2 rounded-sm overflow-hidden shadow-2xl">
              <img
                src={missionBg}
                alt="Timeline Sacred Editorial Concept representing Christian Faith & Creativity"
                referrerPolicy="no-referrer"
                className="w-full h-[320px] sm:h-[400px] object-cover filter brightness-[0.85] contrast-[1.05] grayscale-[20%] transition-all duration-700 hover:scale-[1.02] rounded-xs"
              />
              <div className="absolute bottom-5 left-5 bg-black/80 backdrop-blur-md px-3.5 py-1.5 border border-zinc-800 rounded-sm">
                <span className="font-mono text-[8px] tracking-[0.25em] text-zinc-400 uppercase">
                  TIMELINE ARCHIVE // SACRED STATEMENT
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Mission Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="lg:col-span-7 space-y-8" 
            id="manifesto-text-container"
          >
            
            <div className="space-y-3">
              <motion.h2 
                variants={itemVariants}
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-tight uppercase"
              >
                EMPOWERING FAITH WITH BOLD CONVICTION
              </motion.h2>
            </div>

            {/* Core Mission Block */}
            <motion.div 
              variants={itemVariants}
              className="border-l-2 border-red-600 pl-6 py-1"
            >
              <p className="font-serif text-lg sm:text-xl text-zinc-200 italic font-light leading-relaxed">
                "Timeline is focused on Christian-inspired fashion, emphasizing faith, creativity, and an unwavering connection to <span className="text-red-500 font-medium">Jesus</span>. We aim to inspire believers to live out their faith with absolute confidence and conviction."
              </p>
            </motion.div>

            <motion.p 
              variants={itemVariants}
              className="font-mono text-[10px] sm:text-[11px] text-zinc-400 leading-relaxed uppercase tracking-wider"
            >
              Every item in our store is designed to express faith beautifully. We craft high-quality clothes with extreme attention to detail and premium fabrics so you can wear your faith comfortably.
            </motion.p>

            {/* Pillar Grid */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-zinc-900" 
              id="manifesto-pillars"
            >
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-white">
                  <span className="font-mono text-[9px] font-bold tracking-widest text-red-500 uppercase">FAITH FIRST</span>
                </div>
                <p className="font-mono text-[8.5px] text-zinc-500 leading-normal uppercase">
                  Designed as meaningful symbols to ground your daily walk in Jesus Christ.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-white">
                  <span className="font-mono text-[9px] font-bold tracking-widest uppercase">CREATIVITY</span>
                </div>
                <p className="font-mono text-[8.5px] text-zinc-500 leading-normal uppercase">
                  Modern design trends fused with thoughtful, spiritually inspiring details.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-white">
                  <span className="font-mono text-[9px] font-bold tracking-widest uppercase">CONVICTION</span>
                </div>
                <p className="font-mono text-[8.5px] text-zinc-500 leading-normal uppercase">
                  Represent your values proudly and walk with confidence.
                </p>
              </div>

            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
