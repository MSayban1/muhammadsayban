import Layout from '../components/Layout';
import { usePortfolio } from '../lib/PortfolioContext';
import { motion } from 'motion/react';

export default function PrivacyPolicy() {
  const { data } = usePortfolio();

  if (!data) return null;

  return (
    <Layout>
      <div className="pt-32 pb-24 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-12 tracking-tighter">
            {data.privacyPolicy.title}
          </h1>
          <div className="prose prose-invert text-zinc-400 leading-relaxed text-lg whitespace-pre-wrap">
            {data.privacyPolicy.content}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
