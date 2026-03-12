import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Camera, Edit2, Save, X, Trash2, Baby } from 'lucide-react';

function calculateAge(birthDate: string): string {
  const birth = new Date(birthDate + 'T00:00:00');
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();

  if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
    years--;
    months += 12;
  }
  if (months < 0) months += 12;

  if (years === 0 && months === 0) return 'Recém-nascido';
  if (years === 0) return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  if (years < 2) return `${years} ano e ${months} ${months === 1 ? 'mês' : 'meses'}`;
  return `${years} anos`;
}

function getNextBirthdayLabel(birthDate: string): string {
  const birth = new Date(birthDate + 'T00:00:00');
  const now = new Date();
  const next = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (next < now) next.setFullYear(now.getFullYear() + 1);
  const diff = Math.ceil((next.getTime() - now.getTime()) / 86400000);
  if (diff === 0) return 'Hoje é aniversário!';
  if (diff === 1) return 'Amanhã é aniversário!';
  if (diff <= 30) return `Aniversário em ${diff} dias`;
  return '';
}

export default function ChildProfile() {
  const { childrenList, selectedChildId, updateChild, deleteChild, addChild, setSelectedChildId } = useApp();
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !child) return;
    const reader = new FileReader();
    reader.onload = () => updateChild(child.id, { photoData: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleDelete = () => {
    if (!child) return;
    if (confirm(`Excluir o perfil de ${child.name}? Todos os dados serão removidos.`)) {
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

  if (!child) {
    return (
      <div>
        <h1 className="section-title">Perfil da Criança</h1>
        <p className="section-subtitle">Cadastre a primeira criança para começar</p>
        <div className="card max-w-md">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-100 to-violet-100 flex items-center justify-center mb-3 shadow-sm">
              <Baby size={36} className="text-pink-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">Nenhuma criança cadastrada</p>
          </div>
          <form onSubmit={handleAddFirst} className="space-y-3">
            <div>
              <label className="label">Nome completo</label>
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="input-field" placeholder="Ex: Maria Silva" required />
            </div>
            <div>
              <label className="label">Data de nascimento</label>
              <input type="date" value={newBirth} onChange={(e) => setNewBirth(e.target.value)} className="input-field" required />
            </div>
            <button type="submit" className="btn-primary w-full">Cadastrar criança</button>
          </form>
        </div>
      </div>
    );
  }

  const nextBirthday = getNextBirthdayLabel(child.birthDate);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="section-title">Perfil da Criança</h1>
          <p className="section-subtitle">Informações pessoais e foto</p>
        </div>
        <div className="flex gap-2">
          {!editing ? (
            <>
              <button onClick={startEdit} className="btn-secondary flex items-center gap-1.5">
                <Edit2 size={14} /> Editar
              </button>
              <button onClick={handleDelete} className="btn-danger flex items-center gap-1.5">
                <Trash2 size={14} /> Excluir
              </button>
            </>
          ) : (
            <>
              <button onClick={saveEdit} className="btn-primary flex items-center gap-1.5">
                <Save size={14} /> Salvar
              </button>
              <button onClick={() => setEditing(false)} className="btn-secondary flex items-center gap-1.5">
                <X size={14} /> Cancelar
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
                    {new Date(child.birthDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                  <div className="flex items-center gap-2 mt-2.5 justify-center sm:justify-start flex-wrap">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-xl text-sm font-semibold text-white shadow-sm"
                      style={{ background: 'linear-gradient(135deg, #f472b6, #ec4899)' }}
                    >
                      {calculateAge(child.birthDate)}
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
          <h3 className="font-semibold text-gray-700 mb-4 text-sm">Resumo</h3>
          <div className="space-y-0">
            {[
              { label: 'Nome', value: child.name },
              { label: 'Nascimento', value: new Date(child.birthDate + 'T00:00:00').toLocaleDateString('pt-BR') },
              { label: 'Idade', value: calculateAge(child.birthDate), highlight: true },
              { label: 'Foto', value: child.photoData ? 'Cadastrada' : 'Não cadastrada' },
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
            <h3 className="font-semibold text-gray-700 mb-1 text-sm">Outras crianças ({childrenList.length}/5)</h3>
            <p className="text-xs text-gray-400 mb-4">Use o seletor na barra lateral para alternar</p>
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
