import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, X, Trash2, CheckCircle, Clock, Syringe } from 'lucide-react';

const COMMON_VACCINES = [
  'BCG',
  'Hepatite B',
  'Pentavalente (DTP + Hib + HepB)',
  'Pneumocócica 10-valente',
  'VRH (Rotavírus)',
  'Meningocócica C',
  'Poliomielite (VIP)',
  'Febre Amarela',
  'Tríplice Viral (SCR)',
  'Varicela',
  'Hepatite A',
  'DTP (Reforço)',
  'HPV',
  'Influenza (Gripe)',
];

export default function VaccineHistory() {
  const { vaccines, addVaccine, updateVaccine, deleteVaccine, selectedChildId } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    customName: '',
    scheduledDate: '',
    appliedDate: '',
    status: 'pending' as 'applied' | 'pending',
    reactions: '',
    notes: '',
  });
  const [filterStatus, setFilterStatus] = useState<'all' | 'applied' | 'pending'>('all');

  const childVaccines = vaccines
    .filter((v) => v.childId === selectedChildId)
    .filter((v) => filterStatus === 'all' || v.status === filterStatus)
    .sort((a, b) => {
      const dateA = a.appliedDate || a.scheduledDate || '';
      const dateB = b.appliedDate || b.scheduledDate || '';
      return dateB.localeCompare(dateA);
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId) return;
    const name = form.name === '__custom__' ? form.customName.trim() : form.name;
    if (!name) return;
    addVaccine({
      childId: selectedChildId,
      name,
      scheduledDate: form.scheduledDate,
      appliedDate: form.appliedDate,
      status: form.status,
      reactions: form.reactions,
      notes: form.notes,
    });
    setForm({
      name: '',
      customName: '',
      scheduledDate: '',
      appliedDate: '',
      status: 'pending',
      reactions: '',
      notes: '',
    });
    setShowForm(false);
  };

  const toggleStatus = (id: string, current: 'applied' | 'pending') => {
    const newStatus = current === 'applied' ? 'pending' : 'applied';
    const updates: Partial<typeof vaccines[0]> = { status: newStatus };
    if (newStatus === 'applied' && !vaccines.find((v) => v.id === id)?.appliedDate) {
      updates.appliedDate = new Date().toISOString().slice(0, 10);
    }
    updateVaccine(id, updates);
  };

  if (!selectedChildId) {
    return (
      <div className="card text-center py-10 text-gray-400">
        Selecione uma criança para ver o histórico de vacinas
      </div>
    );
  }

  const allVaccines = vaccines.filter((v) => v.childId === selectedChildId);
  const appliedCount = allVaccines.filter((v) => v.status === 'applied').length;
  const pendingCount = allVaccines.filter((v) => v.status === 'pending').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="section-title">Histórico de Vacinas</h1>
          <p className="section-subtitle">Controle das vacinas aplicadas e pendentes</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-1.5"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Cancelar' : 'Adicionar vacina'}
        </button>
      </div>

      {allVaccines.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="card flex items-center gap-3 p-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle size={20} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{appliedCount}</p>
              <p className="text-xs text-gray-500">Aplicadas</p>
            </div>
          </div>
          <div className="card flex items-center gap-3 p-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock size={20} className="text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{pendingCount}</p>
              <p className="text-xs text-gray-500">Pendentes</p>
            </div>
          </div>
        </div>
      )}
      {allVaccines.length > 0 && (
        <div className="card mb-5 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Progresso de vacinação</span>
            <span className="text-sm font-bold text-emerald-600">{Math.round((appliedCount / allVaccines.length) * 100)}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(appliedCount / allVaccines.length) * 100}%`,
                background: 'linear-gradient(90deg, #34d399, #10b981)',
              }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">{appliedCount} de {allVaccines.length} vacinas aplicadas</p>
        </div>
      )}

      {showForm && (
        <div className="card mb-5">
          <h3 className="font-semibold text-gray-700 mb-4 text-sm">Nova vacina</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="label">Vacina</label>
              <select
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Selecione a vacina...</option>
                {COMMON_VACCINES.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
                <option value="__custom__">Outra (digitar)</option>
              </select>
            </div>
            {form.name === '__custom__' && (
              <div>
                <label className="label">Nome da vacina</label>
                <input
                  type="text"
                  value={form.customName}
                  onChange={(e) => setForm({ ...form, customName: e.target.value })}
                  className="input-field"
                  placeholder="Ex: Dengue"
                  required
                />
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">Data prevista</label>
                <input
                  type="date"
                  value={form.scheduledDate}
                  onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Data de aplicação</label>
                <input
                  type="date"
                  value={form.appliedDate}
                  onChange={(e) =>
                    setForm({ ...form, appliedDate: e.target.value, status: e.target.value ? 'applied' : 'pending' })
                  }
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="label">Status</label>
              <div className="flex gap-2">
                {(['applied', 'pending'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm({ ...form, status: s })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      form.status === s
                        ? s === 'applied'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-400 text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {s === 'applied' ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {s === 'applied' ? 'Aplicada' : 'Pendente'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Reações observadas</label>
              <input
                type="text"
                value={form.reactions}
                onChange={(e) => setForm({ ...form, reactions: e.target.value })}
                className="input-field"
                placeholder="Ex: Febre baixa, vermelhidão no local"
              />
            </div>
            <div>
              <label className="label">Observações</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="input-field resize-none"
                rows={2}
                placeholder="Local de aplicação, lote, etc."
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn-primary">Salvar vacina</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {(['all', 'applied', 'pending'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterStatus(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === type
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {type === 'all' ? 'Todas' : type === 'applied' ? 'Aplicadas' : 'Pendentes'}
          </button>
        ))}
      </div>

      {childVaccines.length === 0 ? (
        <div className="card text-center py-10 text-gray-400">
          <Syringe size={40} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">
            {filterStatus === 'all' ? 'Nenhuma vacina registrada' : 'Nenhum resultado para esse filtro'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {childVaccines.map((vaccine) => (
            <div
              key={vaccine.id}
              className="card flex items-start gap-3 p-4 group"
            >
              <button
                onClick={() => toggleStatus(vaccine.id, vaccine.status)}
                className={`mt-0.5 shrink-0 transition-colors ${
                  vaccine.status === 'applied'
                    ? 'text-emerald-500 hover:text-emerald-400'
                    : 'text-amber-400 hover:text-amber-300'
                }`}
                title={vaccine.status === 'applied' ? 'Marcar como pendente' : 'Marcar como aplicada'}
              >
                {vaccine.status === 'applied' ? (
                  <CheckCircle size={22} />
                ) : (
                  <Clock size={22} />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-800 text-sm">{vaccine.name}</p>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      vaccine.status === 'applied'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {vaccine.status === 'applied' ? 'Aplicada' : 'Pendente'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 mt-1">
                  {vaccine.scheduledDate && (
                    <span className="text-xs text-gray-500">
                      Prevista:{' '}
                      {new Date(vaccine.scheduledDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </span>
                  )}
                  {vaccine.appliedDate && (
                    <span className="text-xs text-emerald-600">
                      Aplicada:{' '}
                      {new Date(vaccine.appliedDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
                {vaccine.reactions && (
                  <p className="text-xs text-orange-600 mt-0.5">
                    Reação: {vaccine.reactions}
                  </p>
                )}
                {vaccine.notes && (
                  <p className="text-xs text-gray-500 mt-0.5 italic">{vaccine.notes}</p>
                )}
              </div>

              <button
                onClick={() => {
                  if (confirm(`Excluir a vacina "${vaccine.name}"?`)) deleteVaccine(vaccine.id);
                }}
                className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
