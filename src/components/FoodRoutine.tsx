import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, X, Trash2, UtensilsCrossed } from 'lucide-react';

const MEAL_TYPES = [
  'Café da manhã',
  'Lanche da manhã',
  'Almoço',
  'Lanche da tarde',
  'Jantar',
  'Ceia',
];

const ACCEPTANCE_OPTIONS = ['Boa', 'Regular', 'Ruim', 'Recusou'];

const ACCEPTANCE_COLORS: Record<string, string> = {
  Boa: 'bg-emerald-100 text-emerald-700',
  Regular: 'bg-amber-100 text-amber-700',
  Ruim: 'bg-orange-100 text-orange-700',
  Recusou: 'bg-red-100 text-red-600',
};

function groupByDate(entries: ReturnType<typeof useApp>['foodEntries']) {
  const groups: Record<string, typeof entries> = {};
  for (const entry of entries) {
    if (!groups[entry.date]) groups[entry.date] = [];
    groups[entry.date].push(entry);
  }
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
}

export default function FoodRoutine() {
  const { foodEntries, addFoodEntry, deleteFoodEntry, selectedChildId } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    mealType: 'Almoço',
    description: '',
    acceptance: 'Boa',
    notes: '',
  });

  const entries = foodEntries
    .filter((e) => e.childId === selectedChildId)
    .sort((a, b) => b.date.localeCompare(a.date));

  const grouped = groupByDate(entries);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId || !form.description.trim()) return;
    addFoodEntry({ ...form, childId: selectedChildId });
    setForm({
      date: new Date().toISOString().slice(0, 10),
      mealType: 'Almoço',
      description: '',
      acceptance: 'Boa',
      notes: '',
    });
    setShowForm(false);
  };

  if (!selectedChildId) {
    return (
      <div className="card text-center py-10 text-gray-400">
        Selecione uma criança para ver a rotina alimentar
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="section-title">Rotina Alimentar</h1>
          <p className="section-subtitle">Diário de refeições e aceitação alimentar</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-1.5"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Cancelar' : 'Registrar refeição'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-5">
          <h3 className="font-semibold text-gray-700 mb-4 text-sm">Nova refeição</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">Data</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label">Tipo de refeição</label>
                <select
                  value={form.mealType}
                  onChange={(e) => setForm({ ...form, mealType: e.target.value })}
                  className="input-field"
                >
                  {MEAL_TYPES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="label">O que foi servido</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field"
                placeholder="Ex: Arroz, feijão, frango grelhado, salada"
                required
              />
            </div>
            <div>
              <label className="label">Aceitação</label>
              <div className="flex flex-wrap gap-2">
                {ACCEPTANCE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setForm({ ...form, acceptance: opt })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      form.acceptance === opt
                        ? ACCEPTANCE_COLORS[opt]
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Observações</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="input-field resize-none"
                rows={2}
                placeholder="Reações, preferências, alergias..."
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn-primary">Salvar refeição</button>
            </div>
          </form>
        </div>
      )}

      {entries.length === 0 ? (
        <div className="card text-center py-10 text-gray-400">
          <UtensilsCrossed size={40} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">Nenhuma refeição registrada</p>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map(([date, dayEntries]) => (
            <div key={date} className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-700 text-sm capitalize">
                  {new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </h3>
                <span className="text-[11px] font-semibold bg-pink-50 text-pink-500 px-2 py-0.5 rounded-full border border-pink-100">
                  {dayEntries.length} {dayEntries.length !== 1 ? 'refeições' : 'refeição'}
                </span>
              </div>
              <div className="space-y-2">
                {dayEntries
                  .sort((a, b) => MEAL_TYPES.indexOf(a.mealType) - MEAL_TYPES.indexOf(b.mealType))
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                            {entry.mealType}
                          </span>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                              ACCEPTANCE_COLORS[entry.acceptance] || 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {entry.acceptance}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{entry.description}</p>
                        {entry.notes && (
                          <p className="text-xs text-gray-500 mt-0.5 italic">{entry.notes}</p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          if (confirm('Excluir este registro?')) deleteFoodEntry(entry.id);
                        }}
                        className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
