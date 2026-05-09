import { motion } from 'motion/react';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../lib/PortfolioContext';

export default function Projects() {
  const { data } = usePortfolio();

  if (!data) return null;

  return (
    <section id="projects" className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-sm font-bold uppercase tracking-widest mb-4"
              style={{ color: data.theme.primaryColor }}
            >
              Recent Work
            </motion.p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Featured Projects.</h2>
          </div>
          <p className="text-zinc-500 max-w-xs text-sm">
            A selection of landing pages and digital experiences built for industry leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.projects.length > 0 ? data.projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative flex flex-col bg-zinc-900 overflow-hidden rounded-[2rem] border border-zinc-800 transition-all duration-500 hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/50"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold tracking-tight">{project.title}</h3>
                  <a 
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-zinc-800 text-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                    style={{ backgroundColor: data.theme.primaryColor }}
                  >
                    <ArrowUpRight size={20} />
                  </a>
                </div>
                <p className="text-zinc-400 mb-8 line-clamp-2">
                  {project.description}
                </p>
                <div className="mt-auto flex items-center justify-between">
                   <span className="text-xs font-bold uppercase tracking-widest text-zinc-600">Case Study</span>
                  <a 
                    href={project.liveLink} 
                    className="text-sm font-semibold flex items-center gap-2 group/link"
                  >
                    View Project 
                    <ExternalLink size={14} className="group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          )) : (
            <div className="col-span-2 text-center py-20 border-2 border-dashed border-zinc-800 rounded-[2rem] text-zinc-500">
              New projects are currently being synchronized...
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
