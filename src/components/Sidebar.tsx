import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Section } from '../types';
import {
  User, Calendar, FileText, TrendingUp, UtensilsCrossed, Syringe, Phone,
  ChevronLeft, ChevronRight, Plus, Menu, X, Baby,
} from 'lucide-react';

const CHILD_COLORS = ['#f472b6', '#a78bfa', '#34d399', '#fb923c', '#38bdf8'];

const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Perfil', icon: <User size={16} /> },
  { id: 'agenda', label: 'Agenda Médica', icon: <Calendar size={16} /> },
  { id: 'prescriptions', label: 'Receitas e Exames', icon: <FileText size={16} /> },
  { id: 'growth', label: 'Curva de Crescimento', icon: <TrendingUp size={16} /> },
  { id: 'food', label: 'Rotina Alimentar', icon: <UtensilsCrossed size={16} /> },
  { id: 'vaccines', label: 'Vacinas', icon: <Syringe size={16} /> },
  { id: 'contacts', label: 'Contatos de Saúde', icon: <Phone size={16} /> },
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
    <form onSubmit={handleSubmit} className="mt-3 space-y-2">
      <input
        type="text"
        placeholder="Nome da criança"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded-xl bg-white/10 text-white placeholder-violet-300 border border-white/20 focus:outline-none focus:border-white/40 transition-all"
        required
      />
      <input
        type="date"
        value={birth}
        onChange={(e) => setBirth(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/40 transition-all"
        required
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 py-2 text-sm rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-semibold transition-all active:scale-95"
        >
          Adicionar
        </button>
        <button
          type="button"
          onClick={onDone}
          className="flex-1 py-2 text-sm rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default function Sidebar() {
  const { childrenList, selectedChildId, setSelectedChildId, activeSection, setActiveSection } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const navigate = (section: Section) => {
    setActiveSection(section);
    setMobileOpen(false);
  };

  const SidebarInner = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full text-white" style={{ background: 'linear-gradient(180deg, #3b0764 0%, #4c1d95 40%, #3b0764 100%)' }}>
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md shrink-0"
              style={{ background: 'linear-gradient(135deg, #f472b6, #ec4899)' }}
            >
              <Baby size={17} className="text-white" />
            </div>
            <div className="leading-tight">
              <span className="font-bold text-sm block">Criança</span>
              <span className="font-bold text-sm text-pink-300">Saudável</span>
            </div>
          </div>
        )}
        {collapsed && !mobile && (
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md mx-auto"
            style={{ background: 'linear-gradient(135deg, #f472b6, #ec4899)' }}
          >
            <Baby size={17} className="text-white" />
          </div>
        )}
        {!mobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-violet-300 hover:text-white transition-all ml-auto shrink-0"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
        {mobile && (
          <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-violet-300">
            <X size={18} />
          </button>
        )}
      </div>

      {(!collapsed || mobile) && (
        <div className="px-3 py-3 border-b border-white/10">
          <p className="text-[10px] text-violet-400 uppercase tracking-widest mb-2.5 px-1 font-semibold">Criança</p>
          <div className="flex flex-wrap gap-1.5">
            {childrenList.map((child, idx) => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedChildId === child.id
                    ? 'bg-white/20 text-white shadow-sm ring-1 ring-white/25'
                    : 'text-violet-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span
                  className="rounded-full flex items-center justify-center text-white font-bold shrink-0"
                  style={{
                    backgroundColor: CHILD_COLORS[idx % CHILD_COLORS.length],
                    width: 18, height: 18, fontSize: 9,
                  }}
                >
                  {child.name.charAt(0).toUpperCase()}
                </span>
                {child.name.split(' ')[0]}
              </button>
            ))}
            {childrenList.length < 5 && !showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-8 h-8 rounded-xl bg-white/10 text-violet-300 hover:bg-white/20 hover:text-white flex items-center justify-center transition-all"
              >
                <Plus size={14} />
              </button>
            )}
          </div>
          {showAddForm && <AddChildForm onDone={() => setShowAddForm(false)} />}
          {childrenList.length === 0 && !showAddForm && (
            <p className="text-xs text-violet-400 mt-1 px-1">Nenhuma criança cadastrada</p>
          )}
        </div>
      )}

      {collapsed && !mobile && (
        <div className="flex flex-col items-center py-3 border-b border-white/10 gap-1.5">
          {childrenList.slice(0, 5).map((child, idx) => (
            <button
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              title={child.name}
              className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                selectedChildId === child.id
                  ? 'ring-2 ring-white/40 scale-110'
                  : 'hover:scale-105 opacity-75 hover:opacity-100'
              }`}
              style={{ backgroundColor: CHILD_COLORS[idx % CHILD_COLORS.length] }}
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
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              data-section={item.id}
              onClick={() => navigate(item.id)}
              title={collapsed && !mobile ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-violet-300 hover:bg-white/8 hover:text-white'
              } ${collapsed && !mobile ? 'justify-center' : ''}`}
            >
              <span
                className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-lg transition-all ${
                  isActive
                    ? 'text-white'
                    : 'text-violet-400 bg-white/5'
                }`}
                style={isActive ? { background: 'linear-gradient(135deg, #f472b6, #ec4899)', boxShadow: '0 2px 8px rgba(236,72,153,0.4)' } : {}}
              >
                {item.icon}
              </span>
              {(!collapsed || mobile) && (
                <span className={`font-medium text-sm ${isActive ? 'text-white' : ''}`}>{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {(!collapsed || mobile) && (
        <div className="px-4 py-3 border-t border-white/10">
          <p className="text-[10px] text-violet-500 text-center">Dados salvos localmente</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 md:hidden text-white p-2 rounded-xl shadow-lg"
        style={{ background: 'linear-gradient(135deg, #3b0764, #4c1d95)' }}
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
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
          collapsed ? 'w-[68px]' : 'w-64'
        }`}
      >
        <SidebarInner />
      </div>
    </>
  );
}
