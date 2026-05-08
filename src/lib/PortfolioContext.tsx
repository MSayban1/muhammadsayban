import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { rtdb } from './firebase';
import { PortfolioData } from '../types';

interface PortfolioContextType {
  data: PortfolioData | null;
  loading: boolean;
  refresh: () => void;
}

const PortfolioContext = createContext<PortfolioContextType>({
  data: null,
  loading: true,
  refresh: () => {},
});

export const usePortfolio = () => useContext(PortfolioContext);

const DEFAULT_DATA: PortfolioData = {
  hero: {
    name: "Muhammad Sayban",
    headline: "Transforming Ideas into High-Converting Realities",
    subHeadline: "Specializing in premium landing pages for SaaS, Agencies, and Startups. I build designs that don't just look good; they sell.",
    whatsapp: "+1234567890",
    email: "muhammadsayban1123@gmail.com",
    googleForm: "https://docs.google.com/forms/d/e/123",
    bannerUrl: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=100&w=2400",
    aboutBannerUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=100&w=2400"
  },
  about: {
    introHighlight: "I am a multi-disciplinary designer with over 8 years of experience creating digital products that bridge the gap between aesthetics and functionality.",
    bio: "Based in London, I've worked with Y-Combinator startups and Fortune 500 companies alike. My process is data-driven yet creatively uninhibited.",
    achievements: ["150+ Successful Launches", "2024 Design Excellence Award", "Awwwards Jury Member"]
  },
  skills: [
    { id: '1', name: 'UI/UX Design', percentage: 95 },
    { id: '2', name: 'Frontend React', percentage: 88 },
    { id: '3', name: 'Conversion Optimization', percentage: 92 },
    { id: '4', name: 'Motion Design', percentage: 80 }
  ],
  projects: [
    {
      id: '1',
      title: 'Venture Capital Landing Page',
      description: 'A sleek, brutalist landing page for a high-end VC firm focusing on tech startups.',
      liveLink: 'https://example.com/project1',
      imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: '2',
      title: 'SaaS Dashboard Interface',
      description: 'Complex data visualization and intuitive navigation for a cloud infrastructure provider.',
      liveLink: 'https://example.com/project2',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
    }
  ],
  contact: {
    whatsapp: "+1234567890",
    email: "design@example.com",
    linkedin: "https://linkedin.com/in/alexsterling",
    twitter: "https://twitter.com/alexsterling"
  },
  theme: {
    primaryColor: "#3b82f6",
    darkMode: true
  },
  privacyPolicy: {
    title: "Privacy Policy",
    content: "We respect your privacy. All data collected via the contact form is used solely for the purpose of communicating regarding your inquiry."
  },
  terms: {
    title: "Terms & Conditions",
    content: "By using this website, you agree to our terms of service. All content is owned by Sterling Design."
  },
  footer: {
    copyright: "© 2026 Sterling Design. All rights reserved."
  }
};

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const portfolioRef = ref(rtdb, 'portfolio');
    
    const unsubscribe = onValue(portfolioRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        // Deeply merge to ensure no missing fields cause crashes
        const mergedData = {
          ...DEFAULT_DATA,
          ...val,
          hero: { ...DEFAULT_DATA.hero, ...(val.hero || {}) },
          about: { 
            ...DEFAULT_DATA.about, 
            ...(val.about || {}),
            achievements: val.about?.achievements || []
          },
          skills: val.skills || [],
          projects: val.projects || [],
          contact: { ...DEFAULT_DATA.contact, ...(val.contact || {}) },
          theme: { ...DEFAULT_DATA.theme, ...(val.theme || {}) },
          footer: { ...DEFAULT_DATA.footer, ...(val.footer || {}) },
          privacyPolicy: { ...DEFAULT_DATA.privacyPolicy, ...(val.privacyPolicy || {}) },
          terms: { ...DEFAULT_DATA.terms, ...(val.terms || {}) }
        };
        setData(mergedData);
      } else {
        // Initialize with default data if empty
        set(portfolioRef, DEFAULT_DATA);
        setData(DEFAULT_DATA);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refresh = () => {
    // onValue handles real-time updates, but we can manually trigger if needed
  };

  return (
    <PortfolioContext.Provider value={{ data, loading, refresh }}>
      {children}
    </PortfolioContext.Provider>
  );
}
