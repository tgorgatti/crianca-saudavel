import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Plus, Trash2, X, MapPin, Clock } from 'lucide-react';

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const DAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = firstDay.getDay();
  const days: { date: Date; current: boolean }[] = [];

  for (let i = startDow - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month, -i), current: false });
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push({ date: new Date(year, month, d), current: true });
  }
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    days.push({ date: new Date(year, month + 1, d), current: false });
  }
  return days;
}

function toDateStr(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function MedicalAgenda() {
  const { appointments, addAppointment, deleteAppointment, selectedChildId } = useApp();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    date: '',
    time: '',
    location: '',
    notes: '',
  });

  const childApts = appointments
    .filter((a) => a.childId === selectedChildId)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const calDays = getCalendarDays(viewYear, viewMonth);
  const todayStr = toDateStr(today);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId || !form.date || !form.time || !form.location.trim()) return;
    addAppointment({ ...form, childId: selectedChildId });
    setForm({ date: '', time: '', location: '', notes: '' });
    setShowForm(false);
  };

  if (!selectedChildId) {
    return (
      <div className="card text-center py-10 text-gray-400">
        Selecione uma criança para ver a agenda
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="section-title">Agenda Médica</h1>
          <p className="section-subtitle">Consultas e compromissos de saúde</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-1.5"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Cancelar' : 'Nova consulta'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-5">
          <h3 className="font-semibold text-gray-700 mb-4 text-sm">Nova Consulta</h3>
          <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
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
              <label className="label">Horário</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Local / Médico</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="input-field"
                placeholder="Ex: Dr. João - Clínica Saúde"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Observações</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="input-field resize-none"
                rows={2}
                placeholder="Sintomas, motivo da consulta..."
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button type="submit" className="btn-primary">Salvar consulta</button>
            </div>
          </form>
        </div>
      )}

      {(() => {
        const upcoming = childApts
          .filter((a) => a.date >= todayStr)
          .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
          .slice(0, 3);
        if (upcoming.length === 0) return null;
        return (
          <div className="card mb-5 p-4">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm">Próximas consultas</h3>
            <div className="space-y-2">
              {upcoming.map((apt) => (
                <div key={apt.id} className="flex items-center gap-3 p-2.5 bg-pink-50 rounded-xl border border-pink-100">
                  <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 bg-white border border-pink-100">
                    <span className="text-[9px] text-pink-500 font-bold uppercase leading-tight">
                      {new Date(apt.date + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'short' })}
                    </span>
                    <span className="text-sm font-bold text-pink-600 leading-tight">
                      {new Date(apt.date + 'T00:00:00').getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{apt.location}</p>
                    <p className="text-xs text-gray-400">{apt.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      <div className="card mb-5">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <h3 className="font-semibold text-gray-800">
            {MONTHS_PT[viewMonth]} {viewYear}
          </h3>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {DAYS_PT.map((d) => (
            <div key={d} className="text-center text-[11px] font-semibold text-gray-400 py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-lg overflow-hidden">
          {calDays.map(({ date, current }, idx) => {
            const dateStr = toDateStr(date);
            const isToday = dateStr === todayStr;
            const dayApts = childApts.filter((a) => a.date === dateStr);

            return (
              <div
                key={idx}
                className={`bg-white min-h-[60px] p-1 ${!current ? 'bg-gray-50' : ''}`}
              >
                <div className="flex justify-center mb-0.5">
                  <span
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-medium ${
                      isToday
                        ? 'bg-emerald-500 text-white'
                        : current
                        ? 'text-gray-700'
                        : 'text-gray-300'
                    }`}
                  >
                    {date.getDate()}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {dayApts.map((apt) => (
                    <div
                      key={apt.id}
                      className="bg-pink-50 border border-pink-100 rounded text-[9px] px-1 py-0.5 text-pink-700 leading-tight truncate"
                    >
                      {apt.time} {apt.location}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-700 mb-4 text-sm">
          Todas as consultas ({childApts.length})
        </h3>
        {childApts.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            Nenhuma consulta registrada
          </p>
        ) : (
          <div className="space-y-3">
            {childApts.map((apt) => (
              <div
                key={apt.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl group"
              >
                <div className="w-10 h-10 bg-pink-100 rounded-xl flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] text-pink-500 font-semibold leading-tight">
                    {new Date(apt.date + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}
                  </span>
                  <span className="text-sm font-bold text-pink-600 leading-tight">
                    {new Date(apt.date + 'T00:00:00').getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                    <MapPin size={12} className="text-gray-400 shrink-0" />
                    <span className="truncate">{apt.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <Clock size={11} className="shrink-0" />
                    <span>{apt.time}</span>
                    <span className="text-gray-300">·</span>
                    <span>{new Date(apt.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                  </div>
                  {apt.notes && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{apt.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (confirm('Excluir esta consulta?')) deleteAppointment(apt.id);
                  }}
                  className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
