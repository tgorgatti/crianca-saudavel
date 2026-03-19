import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { compressFile } from '../utils/compress';
import { Camera, Edit2, Save, X, Trash2, Baby } from 'lucide-react';

function calculateAge(birthDate: string, t: ReturnType<typeof useApp>['t']): string {
  const birth = new Date(birthDate + 'T00:00:00');
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();

  if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
    years--;
    months += 12;
  }
  if (months < 0) months += 12;

  if (years === 0 && months === 0) return t.profile.ageNewborn;
  if (years === 0) return t.profile.ageMonths(months);
  if (years < 2) return t.profile.ageYearMonths(years, months);
  return t.profile.ageYears(years);
}

function getNextBirthdayLabel(birthDate: string, t: ReturnType<typeof useApp>['t']): string {
  const birth = new Date(birthDate + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const next = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (next < now) next.setFullYear(now.getFullYear() + 1);
  const diff = Math.round((next.getTime() - now.getTime()) / 86400000);
  if (diff === 0) return t.profile.birthdayToday;
  if (diff === 1) return t.profile.birthdayTomorrow;
  if (diff <= 30) return t.profile.birthdayDays(diff);
  return '';
}

export default function ChildProfile() {
  const { childrenList, selectedChildId, updateChild, deleteChild, addChild, setSelectedChildId, t } = useApp();
  const child = childrenList.find((c) => c.id === selectedChildId);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBirth, setEditBirth] = useState('');
  const photoRef = useRef<HTMLInputElement>(null);
  const [newName, setNewName] = useState('');
  const [newBirth, setNewBirth] = useState('');

  const startEdit = () => {
    if (!child) return;
    setEditName(child.name);
    setEditBirth(child.birthDate);
    setEditing(true);
  };

  const saveEdit = () => {
    if (!child || !editName.trim() || !editBirth) return;
    updateChild(child.id, { name: editName.trim(), birthDate: editBirth });
    setEditing(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !child) return;
    try {
      const compressed = await compressFile(file);
      updateChild(child.id, { photoData: compressed.data });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao processar imagem.');
    }
  };

  const handleDelete = () => {
    if (!child) return;
    if (confirm(t.profile.deleteConfirm(child.name))) {
      deleteChild(child.id);
    }
  };

  const handleAddFirst = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newBirth) {
      addChild({ name: newName.trim(), birthDate: newBirth, photoData: null });
      setNewName('');
      setNewBirth('');
    }
  };

  const locale = t.common.locale;

  if (!child) {
    return (
      <div>
        <h1 className="section-title">{t.profile.title}</h1>
        <p className="section-subtitle">{t.profile.noChildSubtitle}</p>
        <div className="card max-w-md">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-100 to-violet-100 flex items-center justify-center mb-3 shadow-sm">
              <Baby size={36} className="text-pink-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">{t.profile.noChild}</p>
          </div>
          <form onSubmit={handleAddFirst} className="space-y-3">
            <div>
              <label className="label">{t.profile.nameLabel}</label>
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="input-field" placeholder={t.profile.namePlaceholder} required />
            </div>
            <div>
              <label className="label">{t.profile.birthDateLabel}</label>
              <input type="date" value={newBirth} onChange={(e) => setNewBirth(e.target.value)} className="input-field" required />
            </div>
            <button type="submit" className="btn-primary w-full">{t.profile.registerButton}</button>
          </form>
        </div>
      </div>
    );
  }

  const nextBirthday = getNextBirthdayLabel(child.birthDate, t);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="section-title">{t.profile.title}</h1>
          <p className="section-subtitle">{t.profile.subtitle}</p>
        </div>
        <div className="flex gap-2">
          {!editing ? (
            <>
              <button onClick={startEdit} className="btn-secondary flex items-center gap-1.5">
                <Edit2 size={14} /> {t.profile.save === 'Salvar' ? 'Editar' : t.common.edit}
              </button>
              <button onClick={handleDelete} className="btn-danger flex items-center gap-1.5">
                <Trash2 size={14} /> {t.profile.delete}
              </button>
            </>
          ) : (
            <>
              <button onClick={saveEdit} className="btn-primary flex items-center gap-1.5">
                <Save size={14} /> {t.profile.save}
              </button>
              <button onClick={() => setEditing(false)} className="btn-secondary flex items-center gap-1.5">
                <X size={14} /> {t.profile.cancel}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="card overflow-hidden mb-5 p-0">
        <div
          className="h-28 relative"
          style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 40%, #db2777 100%)' }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-pink-100 to-violet-100 ring-4 ring-white shadow-lg flex items-center justify-center">
                {child.photoData ? (
                  <img src={child.photoData} alt={child.name} className="w-full h-full object-cover" />
                ) : (
                  <Baby size={38} className="text-pink-300" />
                )}
              </div>
              <button
                onClick={() => photoRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-all shadow-md"
                style={{ background: 'linear-gradient(135deg, #f472b6, #ec4899)' }}
                title={t.profile.changePhoto}
              >
                <Camera size={14} />
              </button>
              <input ref={photoRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </div>

            <div className="flex-1 pb-1 text-center sm:text-left">
              {editing ? (
                <div className="space-y-2 mt-3">
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="input-field font-semibold text-lg" />
                  <input type="date" value={editBirth} onChange={(e) => setEditBirth(e.target.value)} className="input-field" />
                </div>
              ) : (
                <div className="mt-3">
                  <h2 className="text-xl font-bold text-gray-900">{child.name}</h2>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {new Date(child.birthDate + 'T00:00:00').toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                  <div className="flex items-center gap-2 mt-2.5 justify-center sm:justify-start flex-wrap">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-xl text-sm font-semibold text-white shadow-sm"
                      style={{ background: 'linear-gradient(135deg, #f472b6, #ec4899)' }}
                    >
                      {calculateAge(child.birthDate, t)}
                    </span>
                    {nextBirthday && (
                      <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
                        {nextBirthday}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-4 text-sm">{t.profile.summary}</h3>
          <div className="space-y-0">
            {[
              { label: t.profile.nameField, value: child.name },
              { label: t.profile.birthField, value: new Date(child.birthDate + 'T00:00:00').toLocaleDateString(locale) },
              { label: t.profile.ageField, value: calculateAge(child.birthDate, t), highlight: true },
              { label: t.profile.photoField, value: child.photoData ? t.profile.photoRegistered : t.profile.photoNotRegistered },
            ].map(({ label, value, highlight }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-400">{label}</span>
                <span className={`text-sm font-semibold ${highlight ? 'text-pink-600' : 'text-gray-800'}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {childrenList.length > 1 && (
          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-1 text-sm">{t.profile.otherChildren(childrenList.length)}</h3>
            <p className="text-xs text-gray-400 mb-4">{t.profile.switchHint}</p>
            <div className="flex flex-wrap gap-2">
              {childrenList.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedChildId(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                    c.id === selectedChildId
                      ? 'bg-pink-50 text-pink-700 ring-1 ring-pink-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {c.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
