import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, X, Trash2, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export default function GrowthCurve() {
  const { growthRecords, addGrowthRecord, deleteGrowthRecord, selectedChildId, t } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: '', weight: '', height: '' });

  const locale = t.common.locale;

  const records = growthRecords
    .filter((r) => r.childId === selectedChildId)
    .sort((a, b) => a.date.localeCompare(b.date));

  const weightData = records
    .filter((r) => r.weight !== null)
    .map((r) => ({
      date: new Date(r.date + 'T00:00:00').toLocaleDateString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }),
      Peso: r.weight,
    }));

  const heightData = records
    .filter((r) => r.height !== null)
    .map((r) => ({
      date: new Date(r.date + 'T00:00:00').toLocaleDateString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }),
      Altura: r.height,
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId || !form.date) return;
    const weight = form.weight ? parseFloat(form.weight) : null;
    const height = form.height ? parseFloat(form.height) : null;
    if (weight === null && height === null) return;
    addGrowthRecord({ childId: selectedChildId, date: form.date, weight, height });
    setForm({ date: '', weight: '', height: '' });
    setShowForm(false);
  };

  if (!selectedChildId) {
    return (
      <div className="card text-center py-10 text-gray-400">
        {t.growth.noChildSelected}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="section-title">{t.growth.title}</h1>
          <p className="section-subtitle">{t.growth.subtitle}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-1.5"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? t.growth.cancel : t.growth.newMeasurement}
        </button>
      </div>

      {showForm && (
        <div className="card mb-5">
          <h3 className="font-semibold text-gray-700 mb-4 text-sm">{t.growth.formTitle}</h3>
          <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="label">{t.growth.dateLabel}</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">{t.growth.weightLabel}</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="200"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className="input-field"
                placeholder={t.growth.weightPlaceholder}
              />
            </div>
            <div>
              <label className="label">{t.growth.heightLabel}</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="250"
                value={form.height}
                onChange={(e) => setForm({ ...form, height: e.target.value })}
                className="input-field"
                placeholder={t.growth.heightPlaceholder}
              />
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <button type="submit" className="btn-primary">
                {t.growth.saveButton}
              </button>
            </div>
          </form>
        </div>
      )}

      {records.length === 0 ? (
        <div className="card text-center py-10 text-gray-400">
          <TrendingUp size={40} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">{t.growth.noMeasurements}</p>
        </div>
      ) : (
        <>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {(() => {
            const lastWeight = [...records].filter(r => r.weight !== null).pop();
            const lastHeight = [...records].filter(r => r.height !== null).pop();
            return (
              <>
                <div className="card stat-mini">
                  <p className="label text-center mb-1">{t.growth.lastWeight}</p>
                  {lastWeight ? (
                    <><p className="text-2xl font-bold text-pink-600">{lastWeight.weight}</p><p className="text-xs text-gray-400">{t.growth.weightUnit}</p></>
                  ) : <p className="text-lg text-gray-300">—</p>}
                </div>
                <div className="card stat-mini">
                  <p className="label text-center mb-1">{t.growth.lastHeight}</p>
                  {lastHeight ? (
                    <><p className="text-2xl font-bold text-violet-600">{lastHeight.height}</p><p className="text-xs text-gray-400">{t.growth.heightUnit}</p></>
                  ) : <p className="text-lg text-gray-300">—</p>}
                </div>
                <div className="card stat-mini">
                  <p className="label text-center mb-1">{t.growth.measurementsLabel}</p>
                  <p className="text-2xl font-bold text-gray-700">{records.length}</p>
                  <p className="text-xs text-gray-400">{t.growth.records}</p>
                </div>
              </>
            );
          })()}
        </div>
        <div className="space-y-5">
          {weightData.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-700 mb-4 text-sm flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-pink-400 inline-block" />
                {t.growth.weightChartTitle}
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={weightData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    tickLine={false}
                    axisLine={false}
                    domain={['auto', 'auto']}
                    unit={` ${t.growth.weightUnit}`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #f3f4f6',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [`${value} ${t.growth.weightUnit}`, t.growth.weightTooltip]}
                  />
                  <Line
                    type="monotone"
                    dataKey="Peso"
                    stroke="#f472b6"
                    strokeWidth={2.5}
                    dot={{ fill: '#f472b6', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {heightData.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-700 mb-4 text-sm flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-violet-400 inline-block" />
                {t.growth.heightChartTitle}
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={heightData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    tickLine={false}
                    axisLine={false}
                    domain={['auto', 'auto']}
                    unit={` ${t.growth.heightUnit}`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #f3f4f6',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [`${value} ${t.growth.heightUnit}`, t.growth.heightTooltip]}
                  />
                  <Line
                    type="monotone"
                    dataKey="Altura"
                    stroke="#a78bfa"
                    strokeWidth={2.5}
                    dot={{ fill: '#a78bfa', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-4 text-sm">
              {t.growth.historyTitle}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">{t.growth.dateLabel}</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500">{t.growth.weightLabel}</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500">{t.growth.heightLabel}</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody>
                  {[...records].reverse().map((record) => (
                    <tr key={record.id} className="border-b border-gray-50 group hover:bg-gray-50">
                      <td className="py-2 px-3 text-gray-700">
                        {new Date(record.date + 'T00:00:00').toLocaleDateString(locale)}
                      </td>
                      <td className="py-2 px-3 text-center font-medium text-pink-600">
                        {record.weight !== null ? record.weight : '—'}
                      </td>
                      <td className="py-2 px-3 text-center font-medium text-violet-600">
                        {record.height !== null ? record.height : '—'}
                      </td>
                      <td className="py-2 px-2">
                        <button
                          onClick={() => {
                            if (confirm(t.growth.deleteConfirm)) deleteGrowthRecord(record.id);
                          }}
                          className="p-1 text-gray-300 hover:text-red-400 rounded transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
}
