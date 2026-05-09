import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { usePortfolio } from '../lib/PortfolioContext';

const TypedName = ({ name, color }: { name: string; color: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleTyping = () => {
      const fullText = name;
      setDisplayText(
        isDeleting 
          ? fullText.substring(0, displayText.length - 1) 
          : fullText.substring(0, displayText.length + 1)
      );

      setTypingSpeed(isDeleting ? 100 : 150);

      if (!isDeleting && displayText === fullText) {
        timer = setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500);
      } else {
        timer = setTimeout(handleTyping, typingSpeed);
      }
    };

    timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, name, typingSpeed, loopNum]);

  return (
    <div className="min-h-[1.5em] flex items-center justify-center w-full overflow-hidden">
      <span 
        className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter truncate md:whitespace-normal"
        style={{ color }}
      >
        {displayText}
        <span className="animate-pulse ml-1">|</span>
      </span>
    </div>
  );
};

const InteractiveHeading = ({ text, color }: { text: string; color: string }) => {
  return (
    <h1 className="text-3xl sm:text-6xl md:text-8xl font-bold tracking-tight mb-4 leading-[0.9] flex flex-wrap justify-center w-full overflow-hidden">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          whileHover={{ 
            scale: 1.4, 
            color: color,
            textShadow: `0 0 25px ${color}`,
            zIndex: 10
          }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
          className="inline-block cursor-default select-none transition-colors duration-300 px-[1px]"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </h1>
  );
};

export default function Hero() {
  const { data } = usePortfolio();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  if (!data) return null;

  return (
    <section ref={containerRef} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden py-12 md:py-20">
      {/* Background Banner */}
      <motion.div 
        style={{ scale, opacity: 0.5 }}
        className="absolute inset-0 z-0"
      >
        <img 
          src={data.hero.bannerUrl} 
          alt="Background"
          className="w-full h-full object-cover grayscale brightness-[0.5] contrast-[1.2]"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-zinc-950/80 to-zinc-950" />
      </motion.div>

      {/* Hero Content */}
      <motion.div 
        style={{ opacity, y }}
        className="relative z-10 text-center w-full max-w-5xl px-4 sm:px-6 md:px-10"
      >
        <InteractiveHeading 
          text={data.hero.headline} 
          color={data.theme.primaryColor} 
        />

        <div className="my-10 md:my-14">
          <TypedName name={data.hero.name} color={data.theme.primaryColor} />
        </div>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-base md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed md:px-0 px-4"
        >
          {data.hero.subHeadline}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0"
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
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] blur-[120px] rounded-full pointer-events-none"
        style={{ backgroundColor: data.theme.primaryColor }}
      />
    </section>
  );
}
