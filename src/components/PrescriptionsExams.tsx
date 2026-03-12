import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import FileModal from './FileModal';
import type { MedicalFile } from '../types';
import { Plus, X, FileText, Image, Upload } from 'lucide-react';

function FileCard({ file, onClick }: { file: MedicalFile; onClick: () => void }) {
  const isImage = file.mimeType.startsWith('image/');
  return (
    <button
      onClick={onClick}
      className="card text-left hover:shadow-md transition-shadow cursor-pointer group p-4 w-full"
    >
      <div className="flex items-center justify-center h-28 bg-gray-50 rounded-xl mb-3 overflow-hidden">
        {isImage ? (
          <img
            src={file.fileData}
            alt={file.name}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-300">
            <FileText size={40} />
            <span className="text-xs">PDF</span>
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
            {file.fileType === 'prescription' ? 'Receita' : 'Exame'}
          </span>
          <span className="text-[10px] text-gray-400">
            {new Date(file.date + 'T00:00:00').toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>
    </button>
  );
}

export default function PrescriptionsExams() {
  const { medicalFiles, addMedicalFile, deleteMedicalFile, selectedChildId } = useApp();
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFileData({ data: reader.result as string, mime: file.type });
    reader.readAsDataURL(file);
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
        Selecione uma criança para ver os arquivos
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="section-title">Receitas e Exames</h1>
          <p className="section-subtitle">Documentos médicos e resultados</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-1.5"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Cancelar' : 'Adicionar'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-5">
          <h3 className="font-semibold text-gray-700 mb-4 text-sm">Novo arquivo</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">Nome do documento</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="Ex: Hemograma completo"
                  required
                />
              </div>
              <div>
                <label className="label">Tipo</label>
                <select
                  value={form.fileType}
                  onChange={(e) =>
                    setForm({ ...form, fileType: e.target.value as 'prescription' | 'exam' })
                  }
                  className="input-field"
                >
                  <option value="prescription">Receita médica</option>
                  <option value="exam">Resultado de exame</option>
                </select>
              </div>
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
                <label className="label">Arquivo (imagem ou PDF)</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className={`input-field cursor-pointer flex items-center gap-2 ${
                    fileData ? 'text-emerald-600' : 'text-gray-400'
                  }`}
                >
                  {fileData ? (
                    <>
                      {fileData.mime.startsWith('image/') ? (
                        <Image size={14} />
                      ) : (
                        <FileText size={14} />
                      )}
                      <span className="text-sm">Arquivo selecionado</span>
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      <span className="text-sm">Selecionar arquivo...</span>
                    </>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Observações</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="input-field resize-none"
                rows={2}
                placeholder="Anotações sobre o documento..."
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn-primary" disabled={!fileData}>
                Salvar arquivo
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {(['all', 'prescription', 'exam'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === type
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {type === 'all' ? 'Todos' : type === 'prescription' ? 'Receitas' : 'Exames'}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 self-center">
          {childFiles.length} documento{childFiles.length !== 1 ? 's' : ''}
        </span>
      </div>

      {childFiles.length === 0 ? (
        <div className="card text-center py-10 text-gray-400">
          <FileText size={40} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">Nenhum documento adicionado</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {childFiles.map((file) => (
            <FileCard key={file.id} file={file} onClick={() => setSelectedFile(file)} />
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
