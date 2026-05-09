import { useEffect } from 'react';
import Layout from '../components/Layout';
import { usePortfolio } from '../lib/PortfolioContext';
import { motion } from 'motion/react';

export default function PrivacyPolicy() {
  const { data } = usePortfolio();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!data) return null;

  const renderContent = (text: string) => {
    return text.split(/(\*.*?\*)/g).map((part, i) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return <strong key={i} className="text-white">{part.slice(1, -1)}</strong>;
      }
      return part;
    });
  };

  return (
    <Layout>
      <div className="pt-32 pb-24 px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-12 tracking-tighter">
            {data.privacyPolicy.title}
          </h1>
          <div className="prose prose-invert text-zinc-400 leading-relaxed text-lg whitespace-pre-wrap">
            {renderContent(data.privacyPolicy.content)}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
