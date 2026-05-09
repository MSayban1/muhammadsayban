import { Link, useLocation } from 'react-router-dom';
import { usePortfolio } from '../lib/PortfolioContext';

export default function Footer() {
  const { data } = usePortfolio();
  const location = useLocation();

  const handleLinkClick = (id: string) => {
    if (location.pathname !== '/') return;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-3xl font-bold tracking-tighter" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              {data?.hero.name.split(' ')[0]}<span style={{ color: data?.theme.primaryColor }}>.</span>
            </Link>
            <p className="text-zinc-500 text-lg mt-6 max-w-sm leading-relaxed transition-colors duration-500">
              Transforming visionary ideas into elite digital experiences. Specializing in high-performance landing pages that scale brands.
            </p>
          </div>

          {/* Navigation */}
          <div className="col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-6 px-1">Quick Links</h4>
            <ul className="space-y-4 text-sm font-medium">
              {['Projects', 'Expertise', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  {location.pathname === '/' ? (
                    <a 
                      href={`#${item.toLowerCase()}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(item.toLowerCase());
                      }}
                      className="text-zinc-500 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  ) : (
                    <Link to={`/#${item.toLowerCase()}`} className="text-zinc-500 hover:text-white transition-colors">
                      {item}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div className="col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-6 px-1">Connect</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <a href={`mailto:${data?.contact.email}`} className="text-zinc-500 hover:text-white transition-colors uppercase tracking-tight">Direct Email</a>
              </li>
              <li>
                <a href={data?.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors uppercase tracking-tight">LinkedIn</a>
              </li>
              <li>
                <Link to="/privacy" className="text-zinc-500 hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-zinc-500 hover:text-white transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">
            {data?.footer.copyright || `© ${new Date().getFullYear()} PulseDesign.`}
          </div>
          <div className="flex gap-4">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">System Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
