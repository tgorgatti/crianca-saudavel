import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { compressFile } from '../utils/compress';
import FileModal from './FileModal';
import type { MedicalFile } from '../types';
import { Plus, X, FileText, Upload } from 'lucide-react';

function FileCard({ file, onClick, typeLabel }: { file: MedicalFile; onClick: () => void; typeLabel: string }) {
  const isImage = file.mimeType.startsWith('image/');
  return (
    <button
      onClick={onClick}
      className="card text-left hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer group p-4 w-full"
    >
      <div className="flex items-center justify-center h-28 bg-gray-50 rounded-xl mb-3 overflow-hidden">
        {isImage ? (
          <img
            src={file.fileData}
            alt={file.name}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-12 h-14 bg-red-50 rounded-lg border border-red-100 flex items-center justify-center">
              <FileText size={28} className="text-red-400" />
            </div>
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">PDF</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
        <div className="flex items-center justify-between mt-1">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              file.fileType === 'prescription'
                ? 'bg-violet-100 text-violet-600'
                : 'bg-blue-100 text-blue-600'
            }`}
          >
            {typeLabel}
          </span>
          <span className="text-[10px] text-gray-400">
            {new Date(file.date + 'T00:00:00').toLocaleDateString()}
          </span>
        </div>
      </div>
    </button>
  );
}

export default function PrescriptionsExams() {
  const { medicalFiles, addMedicalFile, deleteMedicalFile, selectedChildId, t } = useApp();
  const [selectedFile, setSelectedFile] = useState<MedicalFile | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    fileType: 'prescription' as 'prescription' | 'exam',
    date: '',
    notes: '',
  });
  const [fileData, setFileData] = useState<{ data: string; mime: string } | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'prescription' | 'exam'>('all');
  const fileRef = useRef<HTMLInputElement>(null);

  const childFiles = medicalFiles
    .filter((f) => f.childId === selectedChildId)
    .filter((f) => filterType === 'all' || f.fileType === filterType)
    .sort((a, b) => b.date.localeCompare(a.date));

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressFile(file);
      setFileData({ data: compressed.data, mime: compressed.mime });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao processar arquivo.');
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId || !fileData || !form.name.trim() || !form.date) return;
    addMedicalFile({
      childId: selectedChildId,
      name: form.name.trim(),
      fileType: form.fileType,
      fileData: fileData.data,
      mimeType: fileData.mime,
      date: form.date,
      notes: form.notes,
    });
    setForm({ name: '', fileType: 'prescription', date: '', notes: '' });
    setFileData(null);
    if (fileRef.current) fileRef.current.value = '';
    setShowForm(false);
  };

  if (!selectedChildId) {
    return (
      <div className="card text-center py-10 text-gray-400">
        {t.prescriptions.noChildSelected}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="section-title">{t.prescriptions.title}</h1>
          <p className="section-subtitle">{t.prescriptions.subtitle}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-1.5"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? t.prescriptions.cancel : t.prescriptions.newFile}
        </button>
      </div>

      {showForm && (
        <div className="card mb-5">
          <h3 className="font-semibold text-gray-700 mb-4 text-sm">{t.prescriptions.formTitle}</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">{t.prescriptions.nameLabel}</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder={t.prescriptions.namePlaceholder}
                  required
                />
              </div>
              <div>
                <label className="label">{t.prescriptions.typeLabel}</label>
                <div className="flex gap-2 mt-1">
                  {(['prescription', 'exam'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, fileType: type })}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                        form.fileType === type
                          ? type === 'prescription'
                            ? 'bg-violet-500 text-white'
                            : 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {type === 'prescription' ? t.prescriptions.prescription : t.prescriptions.exam}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">{t.prescriptions.dateLabel}</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label">{t.prescriptions.notesLabel}</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="input-field"
                  placeholder={t.prescriptions.notesPlaceholder}
                />
              </div>
            </div>
            <div>
              <label className="label">{t.common.uploadFile}</label>
              <div
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  fileData ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 hover:border-violet-300 hover:bg-violet-50/30'
                }`}
              >
                {fileData ? (
                  <p className="text-sm text-emerald-600 font-medium">✓ {t.common.uploadFile}</p>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={24} className="text-gray-400" />
                    <p className="text-sm text-gray-500">{t.prescriptions.selectFileButton}</p>
                    <p className="text-xs text-gray-400">PDF, JPG, PNG</p>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn-primary" disabled={!fileData}>
                {t.prescriptions.saveButton}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {([
          { key: 'all', label: t.prescriptions.filterAll },
          { key: 'prescription', label: t.prescriptions.filterPrescriptions },
          { key: 'exam', label: t.prescriptions.filterExams },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilterType(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === key
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {childFiles.length === 0 ? (
        <div className="card text-center py-10 text-gray-400">
          <FileText size={40} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">{t.prescriptions.noFiles}</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {childFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              typeLabel={file.fileType === 'prescription' ? t.prescriptions.prescription : t.prescriptions.exam}
              onClick={() => setSelectedFile(file)}
            />
          ))}
        </div>
      )}

      <FileModal
        file={selectedFile}
        onClose={() => setSelectedFile(null)}
        onDelete={(id) => {
          deleteMedicalFile(id);
          setSelectedFile(null);
        }}
      />
    </div>
  );
}
