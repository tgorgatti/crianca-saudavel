import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { compressFile } from '../utils/compress';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Trash2, CheckCircle, Clock, Syringe, Upload, FileText, Eye } from 'lucide-react';

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

interface CardViewerProps {
  fileData: string;
  mimeType: string;
  name: string;
  onClose: () => void;
  onDownload: () => void;
  onDelete: () => void;
  t: ReturnType<typeof useApp>['t'];
}

function CardViewer({ fileData, mimeType, name, onClose, onDownload, onDelete, t }: CardViewerProps) {
  const isImage = mimeType.startsWith('image/');
  const isPdf = mimeType === 'application/pdf';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col z-10"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">{name}</h3>
            <div className="flex items-center gap-2 ml-3 shrink-0">
              <button
                onClick={onDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-600 rounded-lg hover:bg-violet-100 transition-colors text-sm font-medium"
              >
                {t.common.download}
              </button>
              <button
                onClick={onDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                <Trash2 size={14} />
                {t.vaccines.deleteCard}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden p-4 min-h-0">
            {isImage && (
              <div className="flex items-center justify-center h-full">
                <img
                  src={fileData}
                  alt={name}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
            )}
            {isPdf && (
              <iframe
                src={fileData}
                title={name}
                className="w-full h-full rounded-lg border border-gray-100"
                style={{ minHeight: '500px' }}
              />
            )}
            {!isImage && !isPdf && (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
                <span className="text-5xl">📄</span>
                <p className="text-sm">{t.common.noPreview}</p>
                <button onClick={onDownload} className="btn-primary">
                  {t.common.downloadFile}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function VaccineHistory() {
  const { vaccines, addVaccine, updateVaccine, deleteVaccine, selectedChildId, vaccinationCards, setVaccinationCard, deleteVaccinationCard, t } = useApp();
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
  const [showCardViewer, setShowCardViewer] = useState(false);
  const cardFileRef = useRef<HTMLInputElement>(null);

  const locale = t.common.locale;

  const childVaccines = vaccines
    .filter((v) => v.childId === selectedChildId)
    .filter((v) => filterStatus === 'all' || v.status === filterStatus)
    .sort((a, b) => {
      const dateA = a.appliedDate || a.scheduledDate || '';
      const dateB = b.appliedDate || b.scheduledDate || '';
      return dateB.localeCompare(dateA);
    });

  const vaccinationCard = vaccinationCards.find((c) => c.childId === selectedChildId);

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

  const handleCardUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChildId) return;
    try {
      const compressed = await compressFile(file);
      setVaccinationCard({
        childId: selectedChildId,
        fileData: compressed.data,
        mimeType: compressed.mime,
        uploadDate: new Date().toISOString().slice(0, 10),
      });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao processar arquivo.');
    }
    if (cardFileRef.current) cardFileRef.current.value = '';
  };

  const handleCardDownload = () => {
    if (!vaccinationCard) return;
    const a = document.createElement('a');
    a.href = vaccinationCard.fileData;
    const ext = vaccinationCard.mimeType.split('/')[1] || 'bin';
    a.download = `${t.vaccines.vaccinationCardFile}.${ext}`;
    a.click();
  };

  const handleCardDelete = () => {
    if (!selectedChildId) return;
    if (confirm(t.vaccines.deleteCardConfirm)) {
      deleteVaccinationCard(selectedChildId);
      setShowCardViewer(false);
    }
  };

  if (!selectedChildId) {
    return (
      <div className="card text-center py-10 text-gray-400">
        {t.vaccines.noChildSelected}
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
          <h1 className="section-title">{t.vaccines.title}</h1>
          <p className="section-subtitle">{t.vaccines.subtitle}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-1.5"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? t.vaccines.cancel : t.vaccines.newVaccine}
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
              <p className="text-xs text-gray-500">{t.vaccines.appliedCard}</p>
            </div>
          </div>
          <div className="card flex items-center gap-3 p-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock size={20} className="text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{pendingCount}</p>
              <p className="text-xs text-gray-500">{t.vaccines.pendingCard}</p>
            </div>
          </div>
        </div>
      )}

      {allVaccines.length > 0 && (
        <div className="card mb-5 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">{t.vaccines.progressTitle}</span>
            <span className="text-sm font-bold text-emerald-600">{Math.round((appliedCount / allVaccines.length) * 100)}{t.vaccines.progressPercent}</span>
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
          <p className="text-xs text-gray-400 mt-1.5">{t.vaccines.progressCount(appliedCount, allVaccines.length)}</p>
        </div>
      )}

      {showForm && (
        <div className="card mb-5">
          <h3 className="font-semibold text-gray-700 mb-4 text-sm">{t.vaccines.formTitle}</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="label">{t.vaccines.vaccineLabel}</label>
              <select
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
                required
              >
                <option value="">{t.vaccines.selectVaccinePlaceholder}</option>
                {COMMON_VACCINES.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
                <option value="__custom__">{t.vaccines.otherOption}</option>
              </select>
            </div>
            {form.name === '__custom__' && (
              <div>
                <label className="label">{t.vaccines.customNameLabel}</label>
                <input
                  type="text"
                  value={form.customName}
                  onChange={(e) => setForm({ ...form, customName: e.target.value })}
                  className="input-field"
                  placeholder={t.vaccines.customNamePlaceholder}
                  required
                />
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">{t.vaccines.scheduledDateLabel}</label>
                <input
                  type="date"
                  value={form.scheduledDate}
                  onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">{t.vaccines.appliedDateLabel}</label>
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
              <label className="label">{t.vaccines.statusLabel}</label>
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
                    {s === 'applied' ? t.vaccines.appliedStatus : t.vaccines.pendingStatus}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">{t.vaccines.reactionsLabel}</label>
              <input
                type="text"
                value={form.reactions}
                onChange={(e) => setForm({ ...form, reactions: e.target.value })}
                className="input-field"
                placeholder={t.vaccines.reactionsPlaceholder}
              />
            </div>
            <div>
              <label className="label">{t.vaccines.notesLabel}</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="input-field resize-none"
                rows={2}
                placeholder={t.vaccines.notesPlaceholder}
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn-primary">{t.vaccines.saveButton}</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {([
          { key: 'all', label: t.vaccines.filterAll },
          { key: 'applied', label: t.vaccines.filterApplied },
          { key: 'pending', label: t.vaccines.filterPending },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === key
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {childVaccines.length === 0 ? (
        <div className="card text-center py-10 text-gray-400">
          <Syringe size={40} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">
            {filterStatus === 'all' ? t.vaccines.noVaccines : t.vaccines.noFilter}
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
                title={vaccine.status === 'applied' ? t.vaccines.appliedStatus : t.vaccines.pendingStatus}
              >
                {vaccine.status === 'applied' ? (
                  <CheckCircle size={20} />
                ) : (
                  <Clock size={20} />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{vaccine.name}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                  {vaccine.appliedDate && (
                    <span className="text-xs text-emerald-600">
                      {t.vaccines.appliedStatus}: {new Date(vaccine.appliedDate + 'T00:00:00').toLocaleDateString(locale)}
                    </span>
                  )}
                  {vaccine.scheduledDate && !vaccine.appliedDate && (
                    <span className="text-xs text-amber-500">
                      {t.vaccines.scheduledDateLabel}: {new Date(vaccine.scheduledDate + 'T00:00:00').toLocaleDateString(locale)}
                    </span>
                  )}
                </div>
                {vaccine.reactions && (
                  <p className="text-xs text-orange-500 mt-0.5">{vaccine.reactions}</p>
                )}
                {vaccine.notes && (
                  <p className="text-xs text-gray-400 mt-0.5 italic">{vaccine.notes}</p>
                )}
              </div>
              <button
                onClick={() => {
                  if (confirm(t.vaccines.deleteConfirm)) deleteVaccine(vaccine.id);
                }}
                className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="card mt-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-700 text-sm">{t.vaccines.cardTitle}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{t.vaccines.cardSubtitle}</p>
          </div>
          <div className="flex gap-2">
            {vaccinationCard && (
              <button
                onClick={() => setShowCardViewer(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-600 rounded-lg hover:bg-violet-100 transition-colors text-xs font-medium"
              >
                <Eye size={13} />
                {t.vaccines.viewCard}
              </button>
            )}
            <button
              onClick={() => cardFileRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors text-xs font-medium"
            >
              <Upload size={13} />
              {vaccinationCard ? t.vaccines.replaceCard : t.vaccines.attachCard}
            </button>
          </div>
        </div>

        {vaccinationCard ? (
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
            {vaccinationCard.mimeType.startsWith('image/') ? (
              <div
                className="w-14 h-14 rounded-lg overflow-hidden shrink-0 cursor-pointer"
                onClick={() => setShowCardViewer(true)}
              >
                <img
                  src={vaccinationCard.fileData}
                  alt={t.vaccines.cardTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-14 h-14 bg-red-50 rounded-lg border border-red-100 flex flex-col items-center justify-center shrink-0 cursor-pointer" onClick={() => setShowCardViewer(true)}>
                <FileText size={22} className="text-red-400" />
                <span className="text-[9px] font-bold text-red-400 uppercase">PDF</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">{t.vaccines.vaccinationCardFile}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {t.vaccines.uploadedOn}: {new Date(vaccinationCard.uploadDate + 'T00:00:00').toLocaleDateString(locale)}
              </p>
            </div>
            <button
              onClick={handleCardDelete}
              className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => cardFileRef.current?.click()}
            className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 cursor-pointer hover:border-violet-300 hover:bg-violet-50/30 transition-colors"
          >
            <Upload size={28} className="opacity-50" />
            <p className="text-sm font-medium">{t.vaccines.noCard}</p>
            <p className="text-xs text-center">{t.vaccines.noCardHint}</p>
          </div>
        )}

        <input
          ref={cardFileRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={handleCardUpload}
          className="hidden"
        />
      </div>

      {showCardViewer && vaccinationCard && (
        <CardViewer
          fileData={vaccinationCard.fileData}
          mimeType={vaccinationCard.mimeType}
          name={t.vaccines.vaccinationCardFile}
          onClose={() => setShowCardViewer(false)}
          onDownload={handleCardDownload}
          onDelete={handleCardDelete}
          t={t}
        />
      )}
    </div>
  );
}
