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

export default function ChildProfile() {
  const { childrenList, selectedChildId, updateChild, deleteChild, addChild, setSelectedChildId } =
    useApp();
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
          <div className="flex flex-col items-center mb-5">
            <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center mb-3">
              <Baby size={36} className="text-pink-400" />
            </div>
            <p className="text-gray-500 text-sm">Nenhuma criança cadastrada</p>
          </div>
          <form onSubmit={handleAddFirst} className="space-y-3">
            <div>
              <label className="label">Nome completo</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="input-field"
                placeholder="Ex: Maria Silva"
                required
              />
            </div>
            <div>
              <label className="label">Data de nascimento</label>
              <input
                type="date"
                value={newBirth}
                onChange={(e) => setNewBirth(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Cadastrar criança
            </button>
          </form>
        </div>
      </div>
    );
  }

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
                <Edit2 size={14} />
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="btn-danger flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                Excluir
              </button>
            </>
          ) : (
            <>
              <button onClick={saveEdit} className="btn-primary flex items-center gap-1.5">
                <Save size={14} />
                Salvar
              </button>
              <button
                onClick={() => setEditing(false)}
                className="btn-secondary flex items-center gap-1.5"
              >
                <X size={14} />
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="card flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-pink-100 to-violet-100 flex items-center justify-center ring-4 ring-pink-100">
              {child.photoData ? (
                <img
                  src={child.photoData}
                  alt={child.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Baby size={44} className="text-pink-300" />
              )}
            </div>
            <button
              onClick={() => photoRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors shadow-md"
            >
              <Camera size={14} />
            </button>
            <input
              ref={photoRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
          <div className="text-center">
            {editing ? (
              <div className="space-y-2 w-full">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="input-field text-center font-semibold text-lg"
                />
                <input
                  type="date"
                  value={editBirth}
                  onChange={(e) => setEditBirth(e.target.value)}
                  className="input-field text-center"
                />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-800">{child.name}</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {new Date(child.birthDate + 'T00:00:00').toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-4">Resumo</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Nome</span>
              <span className="text-sm font-medium text-gray-800">{child.name}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Nascimento</span>
              <span className="text-sm font-medium text-gray-800">
                {new Date(child.birthDate + 'T00:00:00').toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Idade</span>
              <span className="text-sm font-semibold text-pink-600">
                {calculateAge(child.birthDate)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-500">Foto</span>
              <span className="text-sm text-gray-800">
                {child.photoData ? '✓ Cadastrada' : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {childrenList.length < 5 && (
        <div className="mt-5 card">
          <h3 className="font-semibold text-gray-700 mb-1 text-sm">
            Outras crianças ({childrenList.length}/5)
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            Use o seletor na barra lateral para alternar entre crianças
          </p>
          <div className="flex flex-wrap gap-2">
            {childrenList.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedChildId(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  c.id === selectedChildId
                    ? 'bg-pink-100 text-pink-700 ring-1 ring-pink-300'
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
  );
}
