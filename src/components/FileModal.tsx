import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Trash2 } from 'lucide-react';
import type { MedicalFile } from '../types';
import { useApp } from '../context/AppContext';

interface FileModalProps {
  file: MedicalFile | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export default function FileModal({ file, onClose, onDelete }: FileModalProps) {
  const { t } = useApp();

  if (!file) return null;

  const isImage = file.mimeType.startsWith('image/');
  const isPdf = file.mimeType === 'application/pdf';

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = file.fileData;
    const ext = file.mimeType.split('/')[1] || 'bin';
    a.download = `${file.name}.${ext}`;
    a.click();
  };

  const handleDelete = () => {
    if (confirm(t.modal.deleteConfirm(file.name))) {
      onDelete(file.id);
      onClose();
    }
  };

  const typeLabel = file.fileType === 'prescription' ? t.modal.prescription : t.modal.exam;
  const locale = t.common.locale;

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
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-800 truncate">{file.name}</h3>
              <p className="text-xs text-gray-500">
                {typeLabel} &bull;{' '}
                {new Date(file.date + 'T00:00:00').toLocaleDateString(locale)}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-3 shrink-0">
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-600 rounded-lg hover:bg-violet-100 transition-colors text-sm font-medium"
              >
                <Download size={15} />
                {t.modal.download}
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                <Trash2 size={15} />
                {t.modal.delete}
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
                  src={file.fileData}
                  alt={file.name}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
            )}
            {isPdf && (
              <iframe
                src={file.fileData}
                title={file.name}
                className="w-full h-full rounded-lg border border-gray-100"
                style={{ minHeight: '500px' }}
              />
            )}
            {!isImage && !isPdf && (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
                <span className="text-5xl">📄</span>
                <p className="text-sm">{t.modal.notAvailable}</p>
                <button onClick={handleDownload} className="btn-primary">
                  {t.modal.downloadFile}
                </button>
              </div>
            )}
          </div>
          {file.notes && (
            <div className="px-4 pb-4">
              <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                <span className="font-medium">{t.modal.notesLabel}:</span> {file.notes}
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
