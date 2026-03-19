import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, X, Trash2, UtensilsCrossed } from 'lucide-react';

const MEAL_TYPE_KEYS = [
  'breakfast',
  'morning_snack',
  'lunch',
  'afternoon_snack',
  'dinner',
  'late_snack',
] as const;

const ACCEPTANCE_KEYS = ['good', 'fair', 'poor', 'refused'] as const;

type MealTypeKey = typeof MEAL_TYPE_KEYS[number];
type AcceptanceKey = typeof ACCEPTANCE_KEYS[number];

const ACCEPTANCE_COLORS: Record<AcceptanceKey, string> = {
  good: 'bg-emerald-100 text-emerald-700',
  fair: 'bg-amber-100 text-amber-700',
  poor: 'bg-orange-100 text-orange-700',
  refused: 'bg-red-100 text-red-600',
};

const LEGACY_MEAL_MAP: Record<string, MealTypeKey> = {
  'Café da manhã': 'breakfast',
  'Lanche da manhã': 'morning_snack',
  'Almoço': 'lunch',
  'Lanche da tarde': 'afternoon_snack',
  'Jantar': 'dinner',
  'Ceia': 'late_snack',
  'Breakfast': 'breakfast',
  'Morning snack': 'morning_snack',
  'Lunch': 'lunch',
  'Afternoon snack': 'afternoon_snack',
  'Dinner': 'dinner',
  'Late snack': 'late_snack',
  'Desayuno': 'breakfast',
  'Merienda de mañana': 'morning_snack',
  'Almuerzo': 'lunch',
  'Merienda de tarde': 'afternoon_snack',
  'Cena': 'dinner',
  'Cena tardía': 'late_snack',
};

const LEGACY_ACCEPTANCE_MAP: Record<string, AcceptanceKey> = {
  'Boa': 'good',
  'Regular': 'fair',
  'Ruim': 'poor',
  'Recusou': 'refused',
  'Good': 'good',
  'Fair': 'fair',
  'Poor': 'poor',
  'Refused': 'refused',
  'Buena': 'good',
  'Mala': 'poor',
  'Rechazó': 'refused',
};

function normalizeMealKey(stored: string): MealTypeKey {
  if ((MEAL_TYPE_KEYS as readonly string[]).includes(stored)) return stored as MealTypeKey;
  return LEGACY_MEAL_MAP[stored] ?? 'lunch';
}

function normalizeAcceptanceKey(stored: string): AcceptanceKey {
  if ((ACCEPTANCE_KEYS as readonly string[]).includes(stored)) return stored as AcceptanceKey;
  return LEGACY_ACCEPTANCE_MAP[stored] ?? 'good';
}

function getMealLabel(stored: string, mealTypes: string[]): string {
  const idx = MEAL_TYPE_KEYS.indexOf(normalizeMealKey(stored));
  return idx !== -1 ? mealTypes[idx] : stored;
}

function getAcceptanceLabel(stored: string, acceptanceLabels: string[]): string {
  const idx = ACCEPTANCE_KEYS.indexOf(normalizeAcceptanceKey(stored));
  return idx !== -1 ? acceptanceLabels[idx] : stored;
}

function groupByDate(entries: ReturnType<typeof useApp>['foodEntries']) {
  const groups: Record<string, typeof entries> = {};
  for (const entry of entries) {
    if (!groups[entry.date]) groups[entry.date] = [];
    groups[entry.date].push(entry);
  }
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
}

export default function FoodRoutine() {
  const { foodEntries, addFoodEntry, deleteFoodEntry, selectedChildId, t } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    mealType: 'lunch' as MealTypeKey,
    description: '',
    acceptance: 'good' as AcceptanceKey,
    notes: '',
  });

  const locale = t.common.locale;

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
      mealType: 'lunch',
      description: '',
      acceptance: 'good',
      notes: '',
    });
    setShowForm(false);
  };

  if (!selectedChildId) {
    return (
      <div className="card text-center py-10 text-gray-400">
        {t.food.noChildSelected}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="section-title">{t.food.title}</h1>
          <p className="section-subtitle">{t.food.subtitle}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-1.5"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? t.food.cancel : t.food.newMeal}
        </button>
      </div>

      {showForm && (
        <div className="card mb-5">
          <h3 className="font-semibold text-gray-700 mb-4 text-sm">{t.food.formTitle}</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">{t.food.dateLabel}</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label">{t.food.mealTypeLabel}</label>
                <select
                  value={form.mealType}
                  onChange={(e) => setForm({ ...form, mealType: e.target.value as MealTypeKey })}
                  className="input-field"
                >
                  {MEAL_TYPE_KEYS.map((key, idx) => (
                    <option key={key} value={key}>{t.food.mealTypes[idx]}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="label">{t.food.servedLabel}</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field"
                placeholder={t.food.servedPlaceholder}
                required
              />
            </div>
            <div>
              <label className="label">{t.food.acceptanceLabel}</label>
              <div className="flex flex-wrap gap-2">
                {ACCEPTANCE_KEYS.map((key, idx) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setForm({ ...form, acceptance: key })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      form.acceptance === key
                        ? ACCEPTANCE_COLORS[key]
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {t.food.acceptance[idx]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">{t.food.notesLabel}</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="input-field resize-none"
                rows={2}
                placeholder={t.food.notesPlaceholder}
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn-primary">{t.food.saveButton}</button>
            </div>
          </form>
        </div>
      )}

      {entries.length === 0 ? (
        <div className="card text-center py-10 text-gray-400">
          <UtensilsCrossed size={40} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">{t.food.noMeals}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map(([date, dayEntries]) => (
            <div key={date} className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-700 text-sm capitalize">
                  {new Date(date + 'T00:00:00').toLocaleDateString(locale, {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </h3>
                <span className="text-[11px] font-semibold bg-pink-50 text-pink-500 px-2 py-0.5 rounded-full border border-pink-100">
                  {t.food.mealsCount(dayEntries.length)}
                </span>
              </div>
              <div className="space-y-2">
                {dayEntries
                  .sort((a, b) =>
                    MEAL_TYPE_KEYS.indexOf(normalizeMealKey(a.mealType)) -
                    MEAL_TYPE_KEYS.indexOf(normalizeMealKey(b.mealType))
                  )
                  .map((entry) => {
                    const acceptanceKey = normalizeAcceptanceKey(entry.acceptance);
                    return (
                      <div
                        key={entry.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                              {getMealLabel(entry.mealType, t.food.mealTypes)}
                            </span>
                            <span
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                ACCEPTANCE_COLORS[acceptanceKey]
                              }`}
                            >
                              {getAcceptanceLabel(entry.acceptance, t.food.acceptance)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{entry.description}</p>
                          {entry.notes && (
                            <p className="text-xs text-gray-500 mt-0.5 italic">{entry.notes}</p>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(t.food.deleteConfirm)) deleteFoodEntry(entry.id);
                          }}
                          className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
