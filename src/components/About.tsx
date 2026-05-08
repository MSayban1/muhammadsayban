import { motion } from 'motion/react';
import { usePortfolio } from '../lib/PortfolioContext';

export default function About() {
  const { data } = usePortfolio();

  if (!data) return null;

  return (
    <section id="about" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          className="relative group"
        >
          <div className="text-8xl font-bold opacity-5 absolute -top-12 -left-6 pointer-events-none">ABOUT</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
            I craft digital experiences that <span style={{ color: data.theme.primaryColor }}>resonate.</span>
          </h2>
          <p className="text-xl text-zinc-300 mb-8 leading-relaxed italic">
            "{data.about.introHighlight}"
          </p>
          <p className="text-zinc-400 mb-12 leading-relaxed">
            {data.about.bio}
          </p>
          
          <div className="flex flex-wrap gap-4">
            {data.about.achievements.map((achievement, i) => (
              <div 
                key={i}
                className="px-6 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-sm font-medium hover:border-zinc-700 transition-colors"
              >
                {achievement}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          className="relative"
        >
          <div className="aspect-square rounded-3xl overflow-hidden relative z-10 border border-white/5">
            <img 
              src={data.hero.aboutBannerUrl} 
              alt="About" 
              className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-1000 scale-110 hover:scale-100"
            />
          </div>
          {/* Decorative frame */}
          <div 
            className="absolute -bottom-6 -right-6 w-full h-full rounded-3xl border-2 z-0 opacity-20"
            style={{ borderColor: data.theme.primaryColor }}
          />
        </motion.div>
      </div>
    </section>
  );
}
