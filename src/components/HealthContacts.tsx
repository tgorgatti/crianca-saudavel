import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, X, Trash2, Phone, Mail, MapPin, Stethoscope, User } from 'lucide-react';

export default function HealthContacts() {
  const { healthContacts, addHealthContact, deleteHealthContact, t } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    specialty: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addHealthContact({
      name: form.name.trim(),
      specialty: form.specialty.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      notes: form.notes.trim(),
    });
    setForm({ name: '', specialty: '', phone: '', email: '', address: '', notes: '' });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="section-title">{t.contacts.title}</h1>
          <p className="section-subtitle">{t.contacts.subtitle}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-1.5"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? t.contacts.cancel : t.contacts.newContact}
        </button>
      </div>

      {showForm && (
        <div className="card mb-5">
          <h3 className="font-semibold text-gray-700 mb-4 text-sm">{t.contacts.formTitle}</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">{t.contacts.nameLabel}</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder={t.contacts.namePlaceholder}
                  required
                />
              </div>
              <div>
                <label className="label">{t.contacts.specialtyLabel}</label>
                <input
                  type="text"
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  className="input-field"
                  placeholder={t.contacts.specialtyPlaceholder}
                />
              </div>
              <div>
                <label className="label">{t.contacts.phoneLabel}</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-field"
                  placeholder={t.contacts.phonePlaceholder}
                />
              </div>
              <div>
                <label className="label">{t.contacts.emailLabel}</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                  placeholder={t.contacts.emailPlaceholder}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">{t.contacts.addressLabel}</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="input-field"
                  placeholder={t.contacts.addressPlaceholder}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">{t.contacts.notesLabel}</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="input-field resize-none"
                  rows={2}
                  placeholder={t.contacts.notesPlaceholder}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn-primary">{t.contacts.saveButton}</button>
            </div>
          </form>
        </div>
      )}

      {healthContacts.length === 0 ? (
        <div className="card text-center py-10 text-gray-400">
          <Phone size={40} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">{t.contacts.noContacts}</p>
          <p className="text-xs mt-1 text-gray-300">{t.contacts.noContactsHint}</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-400 mb-3">
            {t.contacts.sharedHint(healthContacts.length)}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {healthContacts.map((contact) => (
              <div key={contact.id} className="card group relative">
                <button
                  onClick={() => {
                    if (confirm(t.contacts.deleteConfirm(contact.name)))
                      deleteHealthContact(contact.id);
                  }}
                  className="absolute top-3 right-3 p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center shrink-0">
                    <User size={18} className="text-violet-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-800 text-sm truncate pr-7">
                      {contact.name}
                    </h4>
                    {contact.specialty && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Stethoscope size={11} className="text-pink-400 shrink-0" />
                        <span className="text-xs text-pink-600 font-medium">{contact.specialty}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '')}`}
                      className="flex items-center gap-2 text-xs text-gray-600 hover:text-violet-600 transition-colors"
                    >
                      <Phone size={12} className="text-gray-400 shrink-0" />
                      <span>{contact.phone}</span>
                    </a>
                  )}
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-2 text-xs text-gray-600 hover:text-violet-600 transition-colors"
                    >
                      <Mail size={12} className="text-gray-400 shrink-0" />
                      <span className="truncate">{contact.email}</span>
                    </a>
                  )}
                  {contact.address && (
                    <div className="flex items-start gap-2 text-xs text-gray-600">
                      <MapPin size={12} className="text-gray-400 shrink-0 mt-0.5" />
                      <span>{contact.address}</span>
                    </div>
                  )}
                  {contact.notes && (
                    <p className="text-xs text-gray-400 italic mt-1 pt-1 border-t border-gray-50">
                      {contact.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
