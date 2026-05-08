export interface HeroData {
  name: string;
  headline: string;
  subHeadline: string;
  whatsapp: string;
  email: string;
  googleForm?: string;
  bannerUrl: string;
}

export interface AboutData {
  introHighlight: string;
  bio: string;
  achievements: string[];
}

export interface Skill {
  id: string;
  name: string;
  percentage: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  liveLink: string;
  imageUrl: string;
}

export interface ThemeSettings {
  primaryColor: string;
  darkMode: boolean;
}

export interface ContactDetails {
  whatsapp: string;
  email: string;
  linkedin?: string;
  twitter?: string;
}

export interface LegalPage {
  title: string;
  content: string;
}

export interface PortfolioData {
  hero: HeroData;
  about: AboutData;
  skills: Skill[];
  projects: Project[];
  contact: ContactDetails;
  theme: ThemeSettings;
  privacyPolicy: LegalPage;
  terms: LegalPage;
  footer: {
    copyright: string;
  };
}
