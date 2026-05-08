import { motion } from 'motion/react';
import { usePortfolio } from '../lib/PortfolioContext';

export default function Expertise() {
  const { data } = usePortfolio();

  if (!data) return null;

  return (
    <section id="expertise" className="py-24 px-6 bg-zinc-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-sm font-bold uppercase tracking-widest mb-4 transition-colors"
            style={{ color: data.theme.primaryColor }}
          >
            My Stack
          </motion.p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Core Expertise.</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
          {data.skills.length > 0 ? data.skills.map((skill, i) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: false }}
              className="group"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg group-hover:translate-x-2 transition-transform duration-300">
                   {skill.name}
                </span>
                <span 
                  className="font-mono text-sm opacity-60"
                  style={{ color: data.theme.primaryColor }}
                >
                  {skill.percentage}%
                </span>
              </div>
              
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.percentage}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  viewport={{ once: false }}
                  className="h-full rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                  style={{ backgroundColor: data.theme.primaryColor }}
                />
              </div>
            </motion.div>
          )) : (
            <div className="col-span-2 text-center py-12 border-2 border-dashed border-zinc-800 rounded-3xl text-zinc-500">
              Expertise mapping in progress... check back soon.
            </div>
          )}
        </div>

        {/* Floating background text */}
        <div className="pointer-events-none absolute left-0 right-0 py-12 flex justify-center overflow-hidden opacity-[0.02]">
          <span className="text-[20vw] font-black uppercase whitespace-nowrap">SKILLS · SKILLS · SKILLS</span>
        </div>
      </div>
    </section>
  );
}
