import { useState, useEffect } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../lib/PortfolioContext';
import { ref, set, update, push, remove } from 'firebase/database';
import { rtdb, auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Save, LogOut, ChevronRight, Plus, Trash2, 
  Image as ImageIcon, Layout as LayoutIcon, User, Layers, Briefcase, Phone, Settings, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { Project, Skill, PortfolioData } from '../types';

export default function AdminDashboard() {
  const { data, loading } = usePortfolio();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hero');

  if (loading || !data) return <div className="h-screen bg-zinc-950 flex items-center justify-center text-white">Loading Terminal...</div>;

  const handleLogout = async () => {
    await signOut(auth);
    toast.info('Logged out from terminal');
    navigate('/login');
  };

  const tabs = [
    { id: 'hero', name: 'Hero & Branding', icon: LayoutIcon },
    { id: 'about', name: 'About & Bio', icon: User },
    { id: 'skills', name: 'Expertise', icon: Layers },
    { id: 'projects', name: 'Projects', icon: Briefcase },
    { id: 'contact', name: 'Contact & Links', icon: Phone },
    { id: 'legal', name: 'Theme & Legal', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 p-6 flex flex-col gap-8">
        <div>
          <div className="text-xl font-bold tracking-tighter mb-1">
            Admin<span style={{ color: data.theme.primaryColor }}>Panel</span>
          </div>
          <div className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">CMS v2.0 // RTDB</div>
        </div>

        <nav className="flex flex-col gap-2 flex-grow">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-zinc-800 text-white shadow-lg' 
                  : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'
              }`}
              style={activeTab === tab.id ? { borderLeft: `3px solid ${data.theme.primaryColor}` } : {}}
            >
              <tab.icon size={18} />
              {tab.name}
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all mt-auto"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12 overflow-y-auto max-h-screen">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                {tabs.find(t => t.id === activeTab)?.name}
              </h2>
              <p className="text-zinc-500 text-sm">Managing live production data for current session.</p>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'hero' && <HeroForm data={data.hero} themeColor={data.theme.primaryColor} />}
              {activeTab === 'about' && (
                <div className="space-y-12">
                  <AboutForm data={data.about} themeColor={data.theme.primaryColor} />
                  <AchievementsManager achievements={data.about.achievements} />
                </div>
              )}
              {activeTab === 'skills' && <SkillsManager skills={data.skills} themeColor={data.theme.primaryColor} />}
              {activeTab === 'projects' && <ProjectsManager projects={data.projects} themeColor={data.theme.primaryColor} />}
              {activeTab === 'contact' && <ContactForm data={data.contact} footer={data.footer} themeColor={data.theme.primaryColor} />}
              {activeTab === 'legal' && <LegalForm data={data} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// Subcomponents for forms

function HeroForm({ data, themeColor }: { data: any, themeColor: string }) {
  const { register, handleSubmit } = useForm({ defaultValues: data });

  const onSubmit = (formData: any) => {
    update(ref(rtdb, 'portfolio/hero'), formData)
      .then(() => toast.success('Hero section updated!'))
      .catch((e) => toast.error('Update failed: ' + e.message));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <InputField label="Public Name" register={register('name')} />
        <InputField label="Main Headline" register={register('headline')} />
      </div>
      <TextAreaField label="Sub-Headline Description" register={register('subHeadline')} />
      <div className="grid md:grid-cols-2 gap-6">
        <InputField label="WhatsApp (Intl format)" register={register('whatsapp')} />
        <InputField label="Public Email" register={register('email')} />
      </div>
      <InputField label="Google Form URL (Optional)" register={register('googleForm')} />
      <div className="grid md:grid-cols-2 gap-6">
        <InputField label="Hero Banner URL" register={register('bannerUrl')} />
        <InputField label="About Intro Image URL" register={register('aboutBannerUrl')} />
      </div>
      
      <div className="pt-6">
        <button type="submit" className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition-all">
          <Save size={18} /> Save Changes
        </button>
      </div>
    </form>
  );
}

function AboutForm({ data, themeColor }: { data: any, themeColor: string }) {
  const { register, handleSubmit } = useForm({ defaultValues: data });

  const onSubmit = (formData: any) => {
    // Achievements is an array, we handle it simply by splitting by newline if the user inputs it that way,
    // but for simplicity in UI let's keep it as is if they are already strings.
    update(ref(rtdb, 'portfolio/about'), formData)
      .then(() => toast.success('About section updated!'))
      .catch((e) => toast.error('Update failed'));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <TextAreaField label="Intro Highlight (Italicized)" register={register('introHighlight')} />
      <TextAreaField label="Professional Bio" rows={6} register={register('bio')} />
      
      <div className="pt-6">
        <button type="submit" className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition-all">
          <Save size={18} /> Save Changes
        </button>
      </div>
    </form>
  );
}

function AchievementsManager({ achievements = [] }: { achievements: string[] }) {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (!newItem) return;
    const updated = [...(achievements || []), newItem];
    update(ref(rtdb, 'portfolio/about'), { achievements: updated })
      .then(() => {
        setNewItem('');
        toast.success('Achievement added');
      });
  };

  const removeItem = (index: number) => {
    const updated = (achievements || []).filter((_, i) => i !== index);
    update(ref(rtdb, 'portfolio/about'), { achievements: updated });
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6">
      <h3 className="font-bold text-xl mb-4">Achievements & Milestones</h3>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="e.g. 150+ Successful Launches"
          className="flex-grow bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-600 transition-all font-medium"
        />
        <button 
          onClick={addItem} 
          className="bg-white text-zinc-950 font-bold px-6 rounded-xl transition-all hover:bg-zinc-200 active:scale-95 flex items-center justify-center"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="space-y-3">
        {(achievements || []).map((item, i) => (
          <div key={i} className="flex justify-between items-center bg-zinc-950 border border-zinc-800/50 p-4 rounded-2xl group transition-all hover:border-zinc-700">
            <span className="text-sm font-medium text-zinc-300">{item}</span>
            <button onClick={() => removeItem(i)} className="text-zinc-600 hover:text-red-500 transition-colors p-1">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsManager({ skills = [], themeColor }: { skills: Skill[], themeColor: string }) {
  const [newSkill, setNewSkill] = useState({ name: '', percentage: 80 });

  const addSkill = () => {
    if (!newSkill.name) return;
    const newId = Date.now().toString();
    const updatedSkills = [...(skills || []), { ...newSkill, id: newId }];
    set(ref(rtdb, 'portfolio/skills'), updatedSkills)
      .then(() => {
        setNewSkill({ name: '', percentage: 80 });
        toast.success('Skill added');
      });
  };

  const removeSkill = (id: string) => {
    const updatedSkills = (skills || []).filter(s => s.id !== id);
    set(ref(rtdb, 'portfolio/skills'), updatedSkills);
  };

  return (
    <div className="space-y-8">
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl grid md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase px-1 mb-2 block">Skill Name</label>
          <input 
            type="text" 
            value={newSkill.name}
            onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
            placeholder="e.g. Figma"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase px-1 mb-2 block">Percentage ({newSkill.percentage}%)</label>
          <input 
            type="range" 
            min="0" max="100"
            value={newSkill.percentage}
            onChange={(e) => setNewSkill({...newSkill, percentage: parseInt(e.target.value)})}
            className="w-full"
          />
        </div>
        <button 
          onClick={addSkill}
          className="bg-zinc-100 text-zinc-950 font-bold py-2 rounded-xl flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Add
        </button>
      </div>

      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill.id} className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50 group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-xs" style={{ color: themeColor }}>
                {skill.percentage}%
              </div>
              <span className="font-bold">{skill.name}</span>
            </div>
            <button onClick={() => removeSkill(skill.id)} className="text-zinc-600 hover:text-red-500 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsManager({ projects = [], themeColor }: { projects: Project[], themeColor: string }) {
  const [editing, setEditing] = useState<Project | null>(null);
  
  const resetForm = () => setEditing(null);

  const saveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    let updatedProjects;
    if (editing.id) {
      updatedProjects = (projects || []).map(p => p.id === editing.id ? editing : p);
    } else {
      const newId = Date.now().toString();
      updatedProjects = [...(projects || []), { ...editing, id: newId }];
    }

    set(ref(rtdb, 'portfolio/projects'), updatedProjects)
      .then(() => {
        toast.success('Project saved');
        resetForm();
      });
  };

  const deleteProject = (id: string) => {
    const updatedProjects = (projects || []).filter(p => p.id !== id);
    set(ref(rtdb, 'portfolio/projects'), updatedProjects);
  };

  return (
    <div className="space-y-8">
      {!editing ? (
        <button 
          onClick={() => setEditing({ id: '', title: '', description: '', liveLink: '', imageUrl: '' })}
          className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-3xl text-zinc-500 hover:border-zinc-500 hover:text-zinc-300 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Add New Project
        </button>
      ) : (
        <form onSubmit={saveProject} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-4">
          <h3 className="font-bold text-xl mb-4">{editing.id ? 'Edit Project' : 'New Project'}</h3>
          <InputField label="Title" value={editing.title} onChange={(val) => setEditing({...editing, title: val})} />
          <TextAreaField label="Description" value={editing.description} onChange={(val) => setEditing({...editing, description: val})} />
          <InputField label="Live URL" value={editing.liveLink} onChange={(val) => setEditing({...editing, liveLink: val})} />
          <InputField label="Image URL" value={editing.imageUrl} onChange={(val) => setEditing({...editing, imageUrl: val})} />
          
          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-grow bg-white text-zinc-950 font-bold py-3 rounded-xl">Save Project</button>
            <button type="button" onClick={resetForm} className="px-6 bg-zinc-800 text-white font-bold py-3 rounded-xl">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="relative group bg-zinc-900 border border-zinc-800 p-4 rounded-3xl overflow-hidden">
            <img src={project.imageUrl} alt={project.title} className="w-full h-32 object-cover rounded-2xl mb-4 brightness-75 group-hover:brightness-100 transition-all" />
            <h4 className="font-bold mb-1 truncate">{project.title}</h4>
            <div className="absolute top-6 right-6 flex gap-2">
              <button onClick={() => setEditing(project)} className="p-2 bg-zinc-800/80 backdrop-blur rounded-lg hover:bg-zinc-700"><Settings size={14} /></button>
              <button onClick={() => deleteProject(project.id)} className="p-2 bg-red-950/80 backdrop-blur text-red-500 rounded-lg hover:bg-red-500 hover:text-white"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactForm({ data, footer, themeColor }: { data: any, footer: any, themeColor: string }) {
  const { register, handleSubmit } = useForm({ defaultValues: { ...data, copyright: footer.copyright } });

  const onSubmit = (formData: any) => {
    const { copyright, ...contactData } = formData;
    Promise.all([
      update(ref(rtdb, 'portfolio/contact'), contactData),
      update(ref(rtdb, 'portfolio/footer'), { copyright })
    ]).then(() => toast.success('Contact info updated!'));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <InputField label="WhatsApp Contact" register={register('whatsapp')} />
      <InputField label="Inquiry Email" register={register('email')} />
      <div className="grid md:grid-cols-2 gap-6">
        <InputField label="LinkedIn URL" register={register('linkedin')} />
        <InputField label="Twitter URL" register={register('twitter')} />
      </div>
      <InputField label="Footer Copyright Text" register={register('copyright')} />
      
      <div className="pt-6">
        <button type="submit" className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition-all">
          <Save size={18} /> Update Access Points
        </button>
      </div>
    </form>
  );
}

function LegalForm({ data }: { data: PortfolioData }) {
  const [privacy, setPrivacy] = useState(data.privacyPolicy);
  const [terms, setTerms] = useState(data.terms);
  const [theme, setTheme] = useState(data.theme);

  const saveAll = () => {
    Promise.all([
      set(ref(rtdb, 'portfolio/privacyPolicy'), privacy),
      set(ref(rtdb, 'portfolio/terms'), terms),
      set(ref(rtdb, 'portfolio/theme'), theme)
    ]).then(() => toast.success('Settings updated!'));
  };

  return (
    <div className="space-y-12">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6">
        <h3 className="font-bold text-xl mb-4">Aesthetics</h3>
        <div className="flex items-center gap-6">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase px-1 mb-2 block">Theme Primary Color</label>
            <input 
              type="color" 
              value={theme.primaryColor}
              onChange={(e) => setTheme({...theme, primaryColor: e.target.value})}
              className="w-20 h-12 bg-transparent cursor-pointer"
            />
          </div>
          <div className="flex-grow">
            <label className="text-xs font-bold text-zinc-500 uppercase px-1 mb-2 block">Visual Mode</label>
            <div className="flex gap-4">
               <button 
                onClick={() => setTheme({...theme, darkMode: true})}
                className={`px-6 py-2 rounded-xl text-sm font-bold border ${theme.darkMode ? 'bg-white text-zinc-950 border-white' : 'border-zinc-800 text-zinc-500'}`}
               >Dark High-Contrast</button>
               <button 
                onClick={() => setTheme({...theme, darkMode: false})}
                className={`px-6 py-2 rounded-xl text-sm font-bold border ${!theme.darkMode ? 'bg-zinc-950 text-white border-zinc-950' : 'border-zinc-800 text-zinc-500'}`}
               >Light Editorial</button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="font-bold text-xl">Legal Manifests</h3>
        <div>
          <InputField label="Privacy Policy Title" value={privacy.title} onChange={(v) => setPrivacy({...privacy, title: v})} />
          <TextAreaField label="Privacy Content" value={privacy.content} onChange={(v) => setPrivacy({...privacy, content: v})} />
        </div>
        <div className="pt-6 border-t border-zinc-900">
          <InputField label="Terms & Conditions Title" value={terms.title} onChange={(v) => setTerms({...terms, title: v})} />
          <TextAreaField label="Terms Content" value={terms.content} onChange={(v) => setTerms({...terms, content: v})} />
        </div>
      </div>

      <div className="pt-6">
        <button onClick={saveAll} className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition-all">
          <Save size={18} /> Commit Changes
        </button>
      </div>
    </div>
  );
}

// Helpers

function InputField({ label, register, value, onChange }: { label: string, register?: any, value?: string, onChange?: (v: string) => void }) {
  return (
    <div className="w-full">
      <label className="text-xs font-bold text-zinc-500 uppercase px-1 mb-2 block tracking-widest">{label}</label>
      <input 
        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-600 transition-all text-sm"
        {...(register || { value: value || '', onChange: (e: any) => onChange?.(e.target.value) })}
      />
    </div>
  );
}

function TextAreaField({ label, register, value, onChange, rows = 3 }: { label: string, register?: any, value?: string, onChange?: (v: string) => void, rows?: number }) {
  return (
    <div className="w-full">
      <label className="text-xs font-bold text-zinc-500 uppercase px-1 mb-2 block tracking-widest">{label}</label>
      <textarea 
        rows={rows}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-600 transition-all text-sm resize-none"
        {...(register || { value: value || '', onChange: (e: any) => onChange?.(e.target.value) })}
      />
    </div>
  );
}
