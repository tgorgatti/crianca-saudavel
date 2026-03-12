import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Section } from '../types';
import {
  User,
  Calendar,
  FileText,
  TrendingUp,
  UtensilsCrossed,
  Syringe,
  Phone,
  ChevronLeft,
  ChevronRight,
  Plus,
  Menu,
  X,
  Baby,
} from 'lucide-react';

const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Perfil', icon: <User size={18} /> },
  { id: 'agenda', label: 'Agenda Médica', icon: <Calendar size={18} /> },
  { id: 'prescriptions', label: 'Receitas e Exames', icon: <FileText size={18} /> },
  { id: 'growth', label: 'Curva de Crescimento', icon: <TrendingUp size={18} /> },
  { id: 'food', label: 'Rotina Alimentar', icon: <UtensilsCrossed size={18} /> },
  { id: 'vaccines', label: 'Vacinas', icon: <Syringe size={18} /> },
  { id: 'contacts', label: 'Contatos de Saúde', icon: <Phone size={18} /> },
];

function AddChildForm({ onDone }: { onDone: () => void }) {
  const { addChild } = useApp();
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && birth) {
      addChild({ name: name.trim(), birthDate: birth, photoData: null });
      setName('');
      setBirth('');
      onDone();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-2">
      <input
        type="text"
        placeholder="Nome da criança"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-2 py-1.5 text-sm rounded-lg bg-violet-700/60 text-white placeholder-violet-300 border border-violet-600 focus:outline-none focus:border-violet-400"
        required
      />
      <input
        type="date"
        value={birth}
        onChange={(e) => setBirth(e.target.value)}
        className="w-full px-2 py-1.5 text-sm rounded-lg bg-violet-700/60 text-white border border-violet-600 focus:outline-none focus:border-violet-400"
        required
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 py-1.5 text-sm rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-medium transition-colors"
        >
          Adicionar
        </button>
        <button
          type="button"
          onClick={onDone}
          className="flex-1 py-1.5 text-sm rounded-lg bg-violet-700 hover:bg-violet-600 text-white transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default function Sidebar() {
  const { childrenList, selectedChildId, setSelectedChildId, activeSection, setActiveSection } =
    useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const navigate = (section: Section) => {
    setActiveSection(section);
    setMobileOpen(false);
  };

  const SidebarInner = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full bg-gradient-to-b from-violet-900 to-violet-800 text-white">
      <div className="flex items-center justify-between px-4 py-4 border-b border-violet-700/60">
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-pink-400 rounded-xl flex items-center justify-center">
              <Baby size={18} className="text-white" />
            </div>
            <span className="font-bold text-base tracking-tight">Criança Saudável</span>
          </div>
        )}
        {!mobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg hover:bg-violet-700 text-violet-300 transition-colors ml-auto"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        )}
        {mobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg hover:bg-violet-700 text-violet-300"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {(!collapsed || mobile) && (
        <div className="px-3 py-3 border-b border-violet-700/60">
          <p className="text-[10px] text-violet-400 uppercase tracking-widest mb-2 px-1">
            Criança
          </p>
          <div className="flex flex-wrap gap-1.5">
            {childrenList.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedChildId === child.id
                    ? 'bg-pink-500 text-white shadow-sm'
                    : 'bg-violet-700/70 text-violet-200 hover:bg-violet-600'
                }`}
              >
                {child.name.split(' ')[0]}
              </button>
            ))}
            {childrenList.length < 5 && !showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-7 h-7 rounded-full bg-violet-700/70 text-violet-200 hover:bg-violet-600 flex items-center justify-center transition-colors"
              >
                <Plus size={14} />
              </button>
            )}
          </div>
          {showAddForm && <AddChildForm onDone={() => setShowAddForm(false)} />}
          {childrenList.length === 0 && !showAddForm && (
            <p className="text-xs text-violet-400 mt-1">Nenhuma criança cadastrada</p>
          )}
        </div>
      )}

      {collapsed && !mobile && (
        <div className="flex flex-col items-center py-3 border-b border-violet-700/60 gap-1">
          {childrenList.slice(0, 5).map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              title={child.name}
              className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                selectedChildId === child.id
                  ? 'bg-pink-500 text-white'
                  : 'bg-violet-700 text-violet-200 hover:bg-violet-600'
              }`}
            >
              {child.name.charAt(0).toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <nav
        data-testid={mobile ? 'nav-mobile' : 'nav-desktop'}
        className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto"
      >
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            data-section={item.id}
            onClick={() => navigate(item.id)}
            title={collapsed && !mobile ? item.label : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              activeSection === item.id
                ? 'bg-pink-500 text-white shadow-sm'
                : 'text-violet-200 hover:bg-violet-700/60'
            } ${collapsed && !mobile ? 'justify-center' : ''}`}
          >
            <span className="shrink-0">{item.icon}</span>
            {(!collapsed || mobile) && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {(!collapsed || mobile) && (
        <div className="px-4 py-3 border-t border-violet-700/60">
          <p className="text-[10px] text-violet-400 text-center">
            Dados salvos localmente no dispositivo
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-violet-900 text-white p-2 rounded-xl shadow-lg"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full z-40 md:hidden transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '260px' }}
      >
        <SidebarInner mobile />
      </div>

      <div
        className={`hidden md:flex flex-col h-screen shrink-0 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <SidebarInner />
      </div>
    </>
  );
}
