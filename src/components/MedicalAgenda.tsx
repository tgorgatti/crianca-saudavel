import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import type { Appointment } from '../types';
import { ChevronLeft, ChevronRight, Plus, Trash2, X, MapPin, Clock, Edit2, Save, CalendarDays, History } from 'lucide-react';

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

function getStatus(dateStr: string, todayStr: string): 'past' | 'today' | 'future' {
  if (dateStr < todayStr) return 'past';
  if (dateStr === todayStr) return 'today';
  return 'future';
}

interface EditModalProps {
  appointment: Appointment;
  onClose: () => void;
  todayStr: string;
  t: ReturnType<typeof useApp>['t'];
  onSave: (id: string, updates: Partial<Omit<Appointment, 'id' | 'childId'>>) => void;
  onDelete: (id: string) => void;
}

function EditModal({ appointment, onClose, todayStr, t, onSave, onDelete }: EditModalProps) {
  const locale = t.common.locale;
  const [draft, setDraft] = useState({
    date: appointment.date,
    time: appointment.time,
    location: appointment.location,
    notes: appointment.notes,
  });
  const [saved, setSaved] = useState(false);

  const status = getStatus(draft.date, todayStr);

  const statusConfig = {
    past: { label: t.agenda.statusPast, color: 'bg-gray-100 text-gray-500' },
    today: { label: t.agenda.statusToday, color: 'bg-emerald-100 text-emerald-700' },
    future: { label: t.agenda.statusFuture, color: 'bg-blue-100 text-blue-700' },
  };

  const handleSave = () => {
    onSave(appointment.id, draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = () => {
    if (confirm(t.agenda.deleteConfirm)) {
      onDelete(appointment.id);
      onClose();
    }
  };

  const hasChanges =
    draft.date !== appointment.date ||
    draft.time !== appointment.time ||
    draft.location !== appointment.location ||
    draft.notes !== appointment.notes;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden"
        initial={{ scale: 0.93, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 24 }}
        transition={{ type: 'spring', damping: 22, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-5 pt-5 pb-4"
          style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #db2777 100%)' }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-white font-bold text-lg">{t.agenda.editAppointment}</h2>
              <p className="text-violet-200 text-xs mt-0.5">
                {new Date(appointment.date + 'T00:00:00').toLocaleDateString(locale, {
                  weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusConfig[status].color}`}>
                {statusConfig[status].label}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">{t.agenda.dateLabel}</label>
              <input
                type="date"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">{t.agenda.timeLabel}</label>
              <input
                type="time"
                value={draft.time}
                onChange={(e) => setDraft({ ...draft, time: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label">{t.agenda.locationLabel}</label>
            <input
              type="text"
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              className="input-field"
              placeholder={t.agenda.locationPlaceholder}
            />
          </div>

          <div>
            <label className="label">{t.agenda.notesLabel}</label>
            <textarea
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              className="input-field resize-none"
              rows={5}
              placeholder={t.agenda.notesPlaceholder}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-5 pb-5">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={14} />
            {t.common.delete}
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges && !saved}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
              saved
                ? 'bg-emerald-500 text-white'
                : hasChanges
                ? 'text-white shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            style={hasChanges && !saved ? { background: 'linear-gradient(135deg, #6d28d9, #db2777)' } : {}}
          >
            <Save size={14} />
            {saved ? '✓ Salvo' : t.agenda.saveChanges}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface AppointmentCardProps {
  apt: Appointment;
  todayStr: string;
  locale: string;
  onClick: () => void;
  t: ReturnType<typeof useApp>['t'];
}

function AppointmentCard({ apt, todayStr, locale, onClick, t }: AppointmentCardProps) {
  const status = getStatus(apt.date, todayStr);
  const dateObj = new Date(apt.date + 'T00:00:00');

  const borderColor = {
    past: 'border-l-gray-300',
    today: 'border-l-emerald-400',
    future: 'border-l-violet-400',
  }[status];

  const monthColor = {
    past: 'text-gray-400',
    today: 'text-emerald-500',
    future: 'text-pink-500',
  }[status];

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border-l-4 ${borderColor} group hover:bg-violet-50/40 hover:border-l-violet-400 transition-all text-left`}
    >
      <div className="w-10 h-10 bg-white rounded-xl flex flex-col items-center justify-center shrink-0 border border-gray-100 shadow-sm">
        <span className={`text-[9px] font-bold uppercase leading-tight ${monthColor}`}>
          {dateObj.toLocaleDateString(locale, { month: 'short' })}
        </span>
        <span className="text-sm font-bold text-gray-700 leading-tight">
          {dateObj.getDate()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <MapPin size={12} className="text-gray-400 shrink-0" />
          <span className="text-sm font-semibold text-gray-800 truncate">{apt.location}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Clock size={11} className="text-gray-400 shrink-0" />
          <span className="text-xs text-gray-500">{apt.time}</span>
          {apt.notes && (
            <>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-400 truncate italic">{apt.notes}</span>
            </>
          )}
        </div>
      </div>
      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Edit2 size={14} className="text-violet-400" />
      </div>
    </button>
  );
}

export default function MedicalAgenda() {
  const { appointments, addAppointment, updateAppointment, deleteAppointment, selectedChildId, t } = useApp();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [showForm, setShowForm] = useState(false);
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [form, setForm] = useState({ date: '', time: '', location: '', notes: '' });

  const todayStr = toDateStr(today);
  const locale = t.common.locale;

  const childApts = appointments
    .filter((a) => a.childId === selectedChildId)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const upcomingApts = childApts.filter((a) => a.date >= todayStr);
  const pastApts = [...childApts.filter((a) => a.date < todayStr)].reverse();

  const calDays = getCalendarDays(viewYear, viewMonth);

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

  const handleCardClick = (apt: Appointment) => {
    setEditingApt(apt);
  };

  if (!selectedChildId) {
    return (
      <div className="card text-center py-10 text-gray-400">
        {t.agenda.noChildSelected}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="section-title">{t.agenda.title}</h1>
          <p className="section-subtitle">{t.agenda.subtitle}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-1.5"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? t.agenda.cancel : t.agenda.newAppointment}
        </button>
      </div>

      {showForm && (
        <div className="card mb-5">
          <h3 className="font-semibold text-gray-700 mb-4 text-sm">{t.agenda.formTitle}</h3>
          <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">{t.agenda.dateLabel}</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="label">{t.agenda.timeLabel}</label>
              <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="input-field" required />
            </div>
            <div className="sm:col-span-2">
              <label className="label">{t.agenda.locationLabel}</label>
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" placeholder={t.agenda.locationPlaceholder} required />
            </div>
            <div className="sm:col-span-2">
              <label className="label">{t.agenda.notesLabel}</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field resize-none" rows={3} placeholder={t.agenda.notesPlaceholder} />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button type="submit" className="btn-primary">{t.agenda.saveButton}</button>
            </div>
          </form>
        </div>
      )}

      <div className="card mb-5">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <h3 className="font-semibold text-gray-800">
            {t.agenda.months[viewMonth]} {viewYear}
          </h3>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="grid grid-cols-7 mb-1">
          {t.agenda.days.map((d) => (
            <div key={d} className="text-center text-[11px] font-semibold text-gray-400 py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-lg overflow-hidden">
          {calDays.map(({ date, current }, idx) => {
            const dateStr = toDateStr(date);
            const isToday = dateStr === todayStr;
            const dayApts = childApts.filter((a) => a.date === dateStr);
            return (
              <div key={idx} className={`min-h-[60px] p-1 ${current ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="flex justify-center mb-0.5">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-medium ${isToday ? 'bg-emerald-500 text-white' : current ? 'text-gray-700' : 'text-gray-300'}`}>
                    {date.getDate()}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {dayApts.map((apt) => (
                    <button
                      key={apt.id}
                      onClick={() => handleCardClick(apt)}
                      className="w-full bg-pink-50 border border-pink-100 rounded text-[9px] px-1 py-0.5 text-pink-700 leading-tight truncate hover:bg-pink-100 transition-colors text-left"
                    >
                      {apt.time} {apt.location}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'upcoming'
                ? 'bg-white text-violet-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <CalendarDays size={14} />
            {t.agenda.upcomingTitle}
            {upcomingApts.length > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === 'upcoming' ? 'bg-violet-100 text-violet-600' : 'bg-gray-200 text-gray-500'}`}>
                {upcomingApts.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'past'
                ? 'bg-white text-gray-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <History size={14} />
            {t.agenda.pastTitle}
            {pastApts.length > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === 'past' ? 'bg-gray-100 text-gray-600' : 'bg-gray-200 text-gray-500'}`}>
                {pastApts.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'upcoming' && (
          upcomingApts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <CalendarDays size={36} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">{t.agenda.noUpcomingAppointments}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingApts.map((apt) => (
                <AppointmentCard
                  key={apt.id}
                  apt={apt}
                  todayStr={todayStr}
                  locale={locale}
                  onClick={() => handleCardClick(apt)}
                  t={t}
                />
              ))}
            </div>
          )
        )}

        {activeTab === 'past' && (
          pastApts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <History size={36} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">{t.agenda.noPastAppointments}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pastApts.map((apt) => (
                <AppointmentCard
                  key={apt.id}
                  apt={apt}
                  todayStr={todayStr}
                  locale={locale}
                  onClick={() => handleCardClick(apt)}
                  t={t}
                />
              ))}
            </div>
          )
        )}
      </div>

      <AnimatePresence>
        {editingApt && (
          <EditModal
            appointment={editingApt}
            onClose={() => setEditingApt(null)}
            todayStr={todayStr}
            t={t}
            onSave={(id, updates) => {
              updateAppointment(id, updates);
              setEditingApt((prev) => prev ? { ...prev, ...updates } : null);
            }}
            onDelete={(id) => {
              deleteAppointment(id);
              setEditingApt(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
