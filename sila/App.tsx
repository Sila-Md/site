/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Globe, 
  Shield, 
  Cloud, 
  Database, 
  Layout,
  Zap, 
  Github, 
  Linkedin, 
  Mail, 
  MessageSquare,
  Sun,
  Moon,
  Youtube,
  Instagram,
  Facebook,
  Music,
  MessageCircle,
  Plus,
  Trash2,
  Save,
  Lock,
  Eye,
  Settings,
  Users,
  GripVertical
} from 'lucide-react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  increment,
  getDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';

/* --- Types --- */
interface Subdomain {
  id: string;
  title: string;
  subdomain: string;
  desc: string;
  iconName: string;
  color: string;
  bg: string;
  order: number;
}

/* --- Icons Mapping --- */
const IconMap: Record<string, any> = {
  MessageSquare, Cloud, Database, Globe, Shield, Cpu, Zap, MessageCircle
};

/* --- Global Components --- */

const Navbar = ({ isLight, toggleTheme }: { isLight: boolean; toggleTheme: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border-app)] bg-[var(--bg-app)]/80 backdrop-blur-md" aria-label="Main Navigation">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-brand-dark" aria-hidden="true">
          <Cpu size={20} />
        </div>
        <span className="font-display font-bold text-xl tracking-tight">SILA TECH</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-muted)]">
        <a href="/" className="hover:text-brand-primary transition-colors">Home</a>
        <a href="/#subdomains" className="hover:text-brand-primary transition-colors">Subdomains</a>
        <a href="/#contact" className="hover:text-brand-primary transition-colors">Contact</a>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-black/5 transition-colors border border-[var(--border-app)]"
          aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
        >
          {isLight ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </div>
  </nav>
);

/* --- Home Sub-components --- */

const Hero = () => (
  <section className="relative pt-32 pb-20 overflow-hidden" id="home">
    <div className="absolute inset-0 tech-grid opacity-20" aria-hidden="true" />
    <div className="max-w-7xl mx-auto px-4 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-brand-primary text-xs font-mono mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
          Now Online: silatech.site
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-[0.9]">
          Digital <span className="text-brand-primary">Ecosystem</span> <br />
          for Today & Tomorrow.
        </h1>
        
        <p className="text-lg text-[var(--text-muted)] mb-10 max-w-xl leading-relaxed">
          Building a smart framework for business, technology, and future services. 
          Silatech is your central hub for everything digital.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-20 relative"
      >
        <div className="aspect-[16/9] bg-gradient-to-br from-[var(--text-app)]/10 to-[var(--text-app)]/5 border border-[var(--border-app)] rounded-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-40 group-hover:scale-105 transition-transform duration-1000" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-10 border border-[var(--border-app)] backdrop-blur-xl bg-[var(--bg-app)]/30 rounded-2xl max-w-md text-brand-primary">
              <div className="font-mono text-sm space-y-2">
                <p>$ silatech --init</p>
                <p className="text-[var(--text-muted)]">Initializing ecosystem...</p>
                <p>$ status: <span className="text-brand-secondary">Ready</span></p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const SubdomainGrid = ({ items }: { items: Subdomain[] }) => (
  <section className="py-24 bg-[var(--text-app)]/[0.02]" id="subdomains">
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-16">
        <p className="text-[var(--text-muted)] max-w-xl">
          Explore our specialized services through our ecosystem of subdomains.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => {
          const Icon = IconMap[item.iconName] || Globe;
          return (
            <motion.a
              href={`https://${item.subdomain}`}
              target="_blank"
              rel="noopener noreferrer"
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 bg-[var(--bg-card)] border border-[var(--border-app)] rounded-2xl hover:border-brand-primary/30 transition-all cursor-pointer relative overflow-hidden focus-visible:outline-2 focus-visible:outline-brand-primary block shadow-lg hover:shadow-brand-primary/5"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity" aria-hidden="true">
                <Icon size={120} strokeWidth={1} />
              </div>
              
              <div className={`w-12 h-12 rounded-lg ${item.bg || 'bg-brand-primary/10'} ${item.color || 'text-brand-primary'} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner`} aria-hidden="true">
                <Icon size={24} />
              </div>
              
              <h3 className="text-xl font-display font-bold tracking-tighter mb-4 group-hover:text-brand-primary transition-colors">{item.title}</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed font-mono opacity-75 group-hover:opacity-100 transition-opacity">{item.desc}</p>
              
              <div className="mt-6 flex items-center text-xs font-bold text-[var(--text-muted)] group-hover:text-brand-primary transition-colors">
                VISIT SITE <Zap size={14} className="ml-2" />
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-20 border-t border-[var(--border-app)]" id="contact">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-brand-dark">
              <Cpu size={24} />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">SILA TECH</span>
          </div>
          <p className="text-[var(--text-muted)] max-w-sm leading-relaxed">
            Silatech is a technology company focused on providing smart solutions to current problems using tomorrow's tools.
          </p>
          <p className="text-brand-primary text-sm font-mono mt-4">Developed by Sila</p>
          <div className="flex flex-wrap gap-4 mt-8">
            <a href="https://youtube.com/@silatrix22" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[var(--border-app)] flex items-center justify-center hover:bg-brand-primary hover:text-brand-dark transition-all">
              <Youtube size={18} />
            </a>
            <a href="https://github.com/Sila-Md" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[var(--border-app)] flex items-center justify-center hover:bg-brand-primary hover:text-brand-dark transition-all">
              <Github size={18} />
            </a>
            <a href="https://linkedin.com/in/sila-tech-b38760408" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[var(--border-app)] flex items-center justify-center hover:bg-brand-primary hover:text-brand-dark transition-all">
              <Linkedin size={18} />
            </a>
            <a href="https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[var(--border-app)] flex items-center justify-center hover:bg-brand-primary hover:text-brand-dark transition-all text-emerald-500">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
        <nav aria-label="Footer Quick Links">
          <h4 className="font-display font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-[var(--text-muted)] text-sm">
            <li><a href="https://silatrix22.blogspot.com/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition-colors">Blog</a></li>
          </ul>
        </nav>
        <div>
          <h4 className="font-display font-bold mb-6">Contact</h4>
          <div className="space-y-4 text-[var(--text-muted)] text-sm font-mono">
            <p className="flex items-center gap-2">
              <Mail size={16} className="text-brand-primary" />
              silatrix22@gmail.com
            </p>
            <p>Dar es Salaam, Tanzania</p>
            <p>+255637351031</p>
          </div>
        </div>
      </div>
      <div className="pt-8 border-t border-[var(--border-app)] flex justify-between items-center text-xs font-mono text-[var(--text-muted)]/40">
        <p>© 2026 SILA TECH ECOSYSTEM. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

/* --- Admin Panel --- */

const SortableSubdomain = ({ sub, onRemove }: { sub: Subdomain, onRemove: (id: string) => any, key?: any }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: sub.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between group"
    >
      <div className="flex items-center gap-4">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/10 rounded text-white/30 hover:text-white/60">
          <GripVertical size={20} />
        </div>
        <div>
          <p className="font-bold">{sub.title}</p>
          <p className="text-xs text-brand-primary">{sub.subdomain}</p>
        </div>
      </div>
      <button onClick={() => onRemove(sub.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded">
        <Trash2 size={18} />
      </button>
    </div>
  );
};

const AdminPanel = ({ subdomains, stats, config }: { subdomains: Subdomain[], stats: any, config: any }) => {
  const [pin, setPin] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [newSubdomain, setNewSubdomain] = useState({ title: '', subdomain: '', desc: '', iconName: 'Globe', color: 'text-brand-primary', bg: 'bg-brand-primary/10' });
  const [editingPin, setEditingPin] = useState('');

  const colors = [
    { label: 'Emerald', text: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Blue', text: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Purple', text: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Amber', text: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Rose', text: 'text-rose-400', bg: 'bg-rose-400/10' },
    { label: 'Cyan', text: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { label: 'Indigo', text: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { label: 'Fuchsia', text: 'text-fuchsia-400', bg: 'bg-fuchsia-400/10' },
    { label: 'Lime', text: 'text-lime-400', bg: 'bg-lime-400/10' },
    { label: 'Sky', text: 'text-sky-400', bg: 'bg-sky-400/10' },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleLogin = () => {
    if (pin === (config?.adminPin || 'sila0022')) {
      setIsAuthorized(true);
    } else {
      alert('Wrong PIN!');
    }
  };

  const addSubdomain = async () => {
    if (!newSubdomain.title || !newSubdomain.subdomain) return;
    const id = Date.now().toString();
    await setDoc(doc(db, 'subdomains', id), {
      ...newSubdomain,
      id,
      order: subdomains.length
    });
    setNewSubdomain({ title: '', subdomain: '', desc: '', iconName: 'Globe', color: 'text-brand-primary', bg: 'bg-brand-primary/10' });
  };

  const removeSubdomain = async (id: string) => {
    await deleteDoc(doc(db, 'subdomains', id));
  };

  const updatePin = async () => {
    if (!editingPin) return;
    await setDoc(doc(db, 'configs', 'global'), { adminPin: editingPin });
    alert('PIN updated!');
    setEditingPin('');
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = subdomains.findIndex((item) => item.id === active.id);
      const newIndex = subdomains.findIndex((item) => item.id === over.id);
      
      const newOrder = arrayMove(subdomains, oldIndex, newIndex);
      
      // Update Firestore in real-time
      const updates = newOrder.map((item, index) => {
        return updateDoc(doc(db, 'subdomains', item.id), { order: index });
      });
      await Promise.all(updates);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-8 bg-white/5 border border-white/10 rounded-2xl w-full max-w-md text-center">
          <Lock className="mx-auto mb-6 text-brand-primary" size={48} />
          <h2 className="text-2xl font-bold mb-6">Admin Access</h2>
          <input 
            type="password" 
            placeholder="Enter PIN" 
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg mb-4 text-center focus:outline-brand-primary"
          />
          <button onClick={handleLogin} className="w-full py-3 bg-brand-primary text-brand-dark font-bold rounded-lg hover:scale-[1.02] transition-transform">
            Unlock
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 flex items-center gap-4">
          <Settings className="text-brand-primary" /> Admin Panel
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <Users className="text-brand-primary mb-2" />
            <p className="text-sm text-white/50">Total Visitors</p>
            <p className="text-3xl font-bold">{stats?.totalVisits || 0}</p>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <Layout className="text-brand-secondary mb-2" />
            <p className="text-sm text-white/50">Active Subdomains</p>
            <p className="text-3xl font-bold">{subdomains.length}</p>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <Lock className="text-purple-400 mb-2" />
            <p className="text-sm text-white/50">Change Admin PIN</p>
            <div className="flex gap-2 mt-2">
              <input 
                type="text" 
                placeholder="New PIN" 
                value={editingPin}
                onChange={(e) => setEditingPin(e.target.value)}
                className="flex-1 bg-white/10 border border-white/10 p-2 rounded text-xs"
              />
              <button onClick={updatePin} className="p-2 bg-brand-primary text-brand-dark rounded">
                <Save size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 bg-white/5 border border-white/10 rounded-2xl mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus size={20} /> Add Subdomain</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input placeholder="Title" value={newSubdomain.title} onChange={e => setNewSubdomain({...newSubdomain, title: e.target.value})} className="bg-white/5 border border-white/10 p-3 rounded-lg text-sm" />
            <input placeholder="URL (e.g. site.silatech.site)" value={newSubdomain.subdomain} onChange={e => setNewSubdomain({...newSubdomain, subdomain: e.target.value})} className="bg-white/5 border border-white/10 p-3 rounded-lg text-sm" />
            <input placeholder="Description" value={newSubdomain.desc} onChange={e => setNewSubdomain({...newSubdomain, desc: e.target.value})} className="bg-white/5 border border-white/10 p-3 rounded-lg text-sm" />
            <select value={newSubdomain.iconName} onChange={e => setNewSubdomain({...newSubdomain, iconName: e.target.value})} className="bg-white/5 border border-white/10 p-3 rounded-lg text-sm">
              {Object.keys(IconMap).map(icon => <option key={icon} value={icon}>{icon}</option>)}
            </select>
            <select 
              value={`${newSubdomain.color}|${newSubdomain.bg}`} 
              onChange={e => {
                const [color, bg] = e.target.value.split('|');
                setNewSubdomain({...newSubdomain, color, bg});
              }} 
              className="bg-white/5 border border-white/10 p-3 rounded-lg text-sm"
            >
              {colors.map(c => <option key={c.label} value={`${c.text}|${c.bg}`}>{c.label} Theme</option>)}
            </select>
          </div>
          <button onClick={addSubdomain} className="mt-4 px-6 py-3 bg-brand-primary text-brand-dark font-bold rounded-lg">Add to Ecosystem</button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Manage Content</h2>
          <p className="text-xs text-white/30 mb-4 flex items-center gap-2">
            <GripVertical size={14} /> Drag the icons to reorder subdomains on the home page.
          </p>
          
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={subdomains.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {subdomains.map(sub => (
                  <SortableSubdomain key={sub.id} sub={sub} onRemove={removeSubdomain} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

/* --- Main App --- */

export default function App() {
  const [isLight, setIsLight] = useState(false);
  const [subdomains, setSubdomains] = useState<Subdomain[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    // Analytics: Track visit (simple logic: increment on mount of the app)
    const trackVisit = async () => {
      const visited = sessionStorage.getItem('silatech_visited');
      if (!visited) {
        await updateDoc(doc(db, 'stats', 'visitors'), {
          totalVisits: increment(1)
        }).catch(async () => {
          // If doc doesn't exist
          await setDoc(doc(db, 'stats', 'visitors'), { totalVisits: 1 });
        });
        sessionStorage.setItem('silatech_visited', 'true');
      }
    };
    trackVisit();

    // Listeners
    const subQuery = query(collection(db, 'subdomains'), orderBy('order', 'asc'));
    const unsubSub = onSnapshot(subQuery, (snap) => {
      setSubdomains(snap.docs.map(d => d.data() as Subdomain));
    });

    const unsubStats = onSnapshot(doc(db, 'stats', 'visitors'), (doc) => {
      setStats(doc.data());
    });

    const unsubConfig = onSnapshot(doc(db, 'configs', 'global'), (doc) => {
      setConfig(doc.data());
    });

    return () => { unsubSub(); unsubStats(); unsubConfig(); };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('light', isLight);
  }, [isLight]);

  return (
    <BrowserRouter>
      <div className="min-h-screen selection:bg-brand-primary selection:text-brand-dark transition-colors duration-300 bg-[var(--bg-app)] text-[var(--text-app)]">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-primary focus:text-brand-dark focus:font-bold focus:rounded-md">
          Skip to main content
        </a>
        
        <Routes>
          <Route path="/" element={
            <>
              <Navbar isLight={isLight} toggleTheme={() => setIsLight(!isLight)} />
              <main id="main-content">
                <Hero />
                <SubdomainGrid items={subdomains} />
              </main>
              <Footer />
            </>
          } />
          <Route path="/admin" element={
            <AdminPanel subdomains={subdomains} stats={stats} config={config} />
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
