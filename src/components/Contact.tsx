import { useState, useRef } from 'react';
import React from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, MessageCircle, Mail, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { usePortfolio } from '../lib/PortfolioContext';

export default function Contact() {
  const { data } = usePortfolio();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!data) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);
    const formData = new FormData(formRef.current);
    const name = formData.get('user_name');
    const email = formData.get('user_email');
    const message = formData.get('message');
    const date = new Date().toLocaleString();

    // Constructing the mailto link with structured data
    const subject = `New Inquiry from ${name} via Portfolio`;
    const body = `
Name: ${name}
Email: ${email}
Date: ${date}

Message:
${message}
    `.trim();

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${data.contact.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Fallback for non-gmail users or mobile
    const mailtoUrl = `mailto:${data.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    toast.success('Opening your email client...');
    
    setTimeout(() => {
      // Try to open Gmail compose in new tab, or fallback to standard mailto
      if (window.innerWidth > 768) {
        window.open(gmailUrl, '_blank');
      } else {
        window.location.href = mailtoUrl;
      }
      setIsSubmitting(false);
      if (formRef.current) formRef.current.reset();
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 px-6 overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left Side: Info */}
          <div>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              className="text-sm font-bold uppercase tracking-widest mb-4"
              style={{ color: data.theme.primaryColor }}
            >
              Get In Touch
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 italic"
            >
              Let's build something <span className="text-zinc-500">extraordinary.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
              className="text-zinc-400 text-lg mb-12 max-w-md"
            >
              Have a visionary project in mind? I'm currently available for new collaborations. Let's make it happen.
            </motion.p>

            <div className="space-y-6">
              {[
                { icon: MessageCircle, label: 'WhatsApp', value: data.contact.whatsapp, link: `https://wa.me/${data.contact.whatsapp.replace(/\D/g, '')}`, color: 'green' },
                { icon: Mail, label: 'Email', value: data.contact.email, link: `mailto:${data.contact.email}`, color: 'blue' }
              ].map((item, i) => (
                <motion.a 
                  key={item.label}
                  href={item.link}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 group p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all"
                >
                  <div className={`p-3 rounded-xl bg-${item.color}-500/10 text-${item.color}-500`}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{item.label}</div>
                    <div className="font-bold">{item.value}</div>
                  </div>
                </motion.a>
              ))}

              {data.hero.googleForm && (
                <motion.a 
                  href={data.hero.googleForm} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-4 group p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all text-purple-400"
                >
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                    <FileText size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Inquiry Form</div>
                    <div className="font-bold text-sm">Direct Redirect</div>
                  </div>
                </motion.a>
              )}
            </div>
          </div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, rotateY: 20, x: 50 }}
            whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
            viewport={{ once: false }}
            className="p-8 md:p-12 rounded-[2.5rem] bg-zinc-900 border border-zinc-800 relative shadow-2xl overflow-hidden"
          >
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">Your Name</label>
                <input 
                  type="text" 
                  name="user_name"
                  required
                  placeholder="John Doe"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 transition-all"
                  style={{ '--tw-ring-color': data.theme.primaryColor } as any}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">Email Address</label>
                <input 
                  type="email" 
                  name="user_email"
                  required
                  placeholder="john@example.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 transition-all"
                  style={{ '--tw-ring-color': data.theme.primaryColor } as any}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">Your Message</label>
                <textarea 
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell me about your project..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 transition-all resize-none"
                  style={{ '--tw-ring-color': data.theme.primaryColor } as any}
                ></textarea>
              </div>
              
              <button 
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 group relative overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: data.theme.primaryColor, color: '#fff' }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? 'Preparing...' : 'Send Message'}
                  <Send size={18} className="translate-y-[-2px]" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-500" />
              </button>
              
              <p className="text-[10px] text-zinc-600 text-center uppercase tracking-[0.2em]">
                Securely processed to your pre-verified gmail
              </p>
            </form>

            {/* Subtile background pulse decorative */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-[-20%] right-[-20%] w-64 h-64 blur-[100px] rounded-full pointer-events-none"
              style={{ backgroundColor: data.theme.primaryColor }}
            />
          </motion.div>
        </div>
      </div>

      {/* Repeating background text animated loop */}
      <div className="absolute bottom-10 left-0 w-full overflow-hidden opacity-[0.03] pointer-events-none select-none">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap text-[15vw] font-black uppercase"
        >
          CONNECT · WORK · INNOVATE · BUILD · CONNECT · WORK · INNOVATE · BUILD ·
        </motion.div>
      </div>
    </section>
  );
}
