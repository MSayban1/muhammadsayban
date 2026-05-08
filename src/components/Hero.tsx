import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { usePortfolio } from '../lib/PortfolioContext';

export default function Hero() {
  const { data } = usePortfolio();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const blur = useTransform(scrollYProgress, [0, 0.5], [0, 10]);

  if (!data) return null;

  return (
    <section ref={containerRef} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Banner */}
      <motion.div 
        style={{ scale, opacity: 0.4 }}
        className="absolute inset-0 z-0"
      >
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${data.hero.bannerUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-zinc-950/60 to-zinc-950" />
      </motion.div>

      {/* Hero Content */}
      <motion.div 
        style={{ opacity, y, filter: `blur(${blur}px)` }}
        className="relative z-10 text-center max-w-4xl px-6"
      >
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.2 }}
          className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase border border-white/10 bg-white/5 backdrop-blur-sm mb-6"
          style={{ color: data.theme.primaryColor }}
        >
          {data.hero.name}
        </motion.span>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.4 }}
          className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-[0.9]"
        >
          {data.hero.headline.split(' ').map((word, i) => (
            <span key={i} className="inline-block mr-[0.2em] last:mr-0">
              {word}
            </span>
          ))}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.6 }}
          className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          {data.hero.subHeadline}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a 
            href={`https://wa.me/${data.hero.whatsapp.replace(/\D/g, '')}`}
            className="group px-8 py-4 rounded-full flex items-center gap-3 font-semibold transition-all hover:scale-105 active:scale-95 w-full sm:w-auto justify-center"
            style={{ backgroundColor: data.theme.primaryColor, color: '#fff' }}
          >
            Start a Project
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
          
          <a 
            href="#contact"
            className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold flex items-center gap-3 backdrop-blur-md hover:bg-white/10 transition-all w-full sm:w-auto justify-center"
          >
            <MessageSquare size={18} />
            Get in Touch
          </a>
        </motion.div>
      </motion.div>

      {/* Decorative Blob */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] blur-[120px] rounded-full opacity-20 pointer-events-none"
        style={{ backgroundColor: data.theme.primaryColor }}
      />
    </section>
  );
}
