import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  Child,
  Appointment,
  MedicalFile,
  GrowthRecord,
  FoodEntry,
  Vaccine,
  HealthContact,
  VaccinationCard,
  Section,
  Language,
} from '../types';
import { translations } from '../i18n/translations';
import type { AppTranslations } from '../i18n/translations';

interface AppContextType {
  childrenList: Child[];
  selectedChildId: string | null;
  setSelectedChildId: (id: string | null) => void;
  addChild: (child: Omit<Child, 'id'>) => void;
  updateChild: (id: string, updates: Partial<Child>) => void;
  deleteChild: (id: string) => void;

  activeSection: Section;
  setActiveSection: (section: Section) => void;

  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Omit<Appointment, 'id' | 'childId'>>) => void;
  deleteAppointment: (id: string) => void;

  medicalFiles: MedicalFile[];
  addMedicalFile: (file: Omit<MedicalFile, 'id'>) => void;
  deleteMedicalFile: (id: string) => void;

  growthRecords: GrowthRecord[];
  addGrowthRecord: (record: Omit<GrowthRecord, 'id'>) => void;
  deleteGrowthRecord: (id: string) => void;

  foodEntries: FoodEntry[];
  addFoodEntry: (entry: Omit<FoodEntry, 'id'>) => void;
  deleteFoodEntry: (id: string) => void;

  vaccines: Vaccine[];
  addVaccine: (vaccine: Omit<Vaccine, 'id'>) => void;
  updateVaccine: (id: string, updates: Partial<Vaccine>) => void;
  deleteVaccine: (id: string) => void;

  healthContacts: HealthContact[];
  addHealthContact: (contact: Omit<HealthContact, 'id'>) => void;
  deleteHealthContact: (id: string) => void;

  vaccinationCards: VaccinationCard[];
  setVaccinationCard: (card: VaccinationCard) => void;
  deleteVaccinationCard: (childId: string) => void;

  language: Language;
  setLanguage: (lang: Language) => void;
  t: AppTranslations;
}

const AppContext = createContext<AppContextType | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('localStorage error:', e);
  }
}

export function AppProvider({ children: reactChildren }: { children: React.ReactNode }) {
  const [childrenList, setChildrenList] = useState<Child[]>(() => load('cs_children', []));
  const [selectedChildId, setSelectedChildId] = useState<string | null>(() =>
    load<string | null>('cs_selectedChildId', null)
  );
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [appointments, setAppointments] = useState<Appointment[]>(() => load('cs_appointments', []));
  const [medicalFiles, setMedicalFiles] = useState<MedicalFile[]>(() => load('cs_medicalFiles', []));
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>(() => load('cs_growthRecords', []));
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>(() => load('cs_foodEntries', []));
  const [vaccines, setVaccines] = useState<Vaccine[]>(() => load('cs_vaccines', []));
  const [healthContacts, setHealthContacts] = useState<HealthContact[]>(() => load('cs_healthContacts', []));
  const [vaccinationCards, setVaccinationCards] = useState<VaccinationCard[]>(() => load('cs_vaccinationCards', []));
  const [language, setLanguageState] = useState<Language>(() => load<Language>('cs_language', 'pt-BR'));

  useEffect(() => {
    if (
      childrenList.length > 0 &&
      (!selectedChildId || !childrenList.find((c) => c.id === selectedChildId))
    ) {
      setSelectedChildId(childrenList[0].id);
    } else if (childrenList.length === 0) {
      setSelectedChildId(null);
    }
  }, [childrenList]);

  useEffect(() => { save('cs_children', childrenList); }, [childrenList]);
  useEffect(() => { save('cs_selectedChildId', selectedChildId); }, [selectedChildId]);
  useEffect(() => { save('cs_appointments', appointments); }, [appointments]);
  useEffect(() => { save('cs_medicalFiles', medicalFiles); }, [medicalFiles]);
  useEffect(() => { save('cs_growthRecords', growthRecords); }, [growthRecords]);
  useEffect(() => { save('cs_foodEntries', foodEntries); }, [foodEntries]);
  useEffect(() => { save('cs_vaccines', vaccines); }, [vaccines]);
  useEffect(() => { save('cs_healthContacts', healthContacts); }, [healthContacts]);
  useEffect(() => { save('cs_vaccinationCards', vaccinationCards); }, [vaccinationCards]);
  useEffect(() => { save('cs_language', language); }, [language]);

  const setLanguage = (lang: Language) => setLanguageState(lang);

  const addChild = (child: Omit<Child, 'id'>) => {
    if (childrenList.length >= 5) return;
    const newChild = { ...child, id: uuidv4() };
    setChildrenList((prev) => [...prev, newChild]);
    setSelectedChildId(newChild.id);
  };

  const updateChild = (id: string, updates: Partial<Child>) =>
    setChildrenList((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));

  const deleteChild = (id: string) => {
    setChildrenList((prev) => prev.filter((c) => c.id !== id));
    setAppointments((prev) => prev.filter((a) => a.childId !== id));
    setMedicalFiles((prev) => prev.filter((f) => f.childId !== id));
    setGrowthRecords((prev) => prev.filter((r) => r.childId !== id));
    setFoodEntries((prev) => prev.filter((e) => e.childId !== id));
    setVaccines((prev) => prev.filter((v) => v.childId !== id));
    setVaccinationCards((prev) => prev.filter((c) => c.childId !== id));
  };

  const addAppointment = (apt: Omit<Appointment, 'id'>) =>
    setAppointments((prev) => [...prev, { ...apt, id: uuidv4() }]);
  const updateAppointment = (id: string, updates: Partial<Omit<Appointment, 'id' | 'childId'>>) =>
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  const deleteAppointment = (id: string) =>
    setAppointments((prev) => prev.filter((a) => a.id !== id));

  const addMedicalFile = (file: Omit<MedicalFile, 'id'>) =>
    setMedicalFiles((prev) => [...prev, { ...file, id: uuidv4() }]);
  const deleteMedicalFile = (id: string) =>
    setMedicalFiles((prev) => prev.filter((f) => f.id !== id));

  const addGrowthRecord = (record: Omit<GrowthRecord, 'id'>) =>
    setGrowthRecords((prev) => [...prev, { ...record, id: uuidv4() }]);
  const deleteGrowthRecord = (id: string) =>
    setGrowthRecords((prev) => prev.filter((r) => r.id !== id));

  const addFoodEntry = (entry: Omit<FoodEntry, 'id'>) =>
    setFoodEntries((prev) => [...prev, { ...entry, id: uuidv4() }]);
  const deleteFoodEntry = (id: string) =>
    setFoodEntries((prev) => prev.filter((e) => e.id !== id));

  const addVaccine = (vaccine: Omit<Vaccine, 'id'>) =>
    setVaccines((prev) => [...prev, { ...vaccine, id: uuidv4() }]);
  const updateVaccine = (id: string, updates: Partial<Vaccine>) =>
    setVaccines((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  const deleteVaccine = (id: string) =>
    setVaccines((prev) => prev.filter((v) => v.id !== id));

  const addHealthContact = (contact: Omit<HealthContact, 'id'>) =>
    setHealthContacts((prev) => [...prev, { ...contact, id: uuidv4() }]);
  const deleteHealthContact = (id: string) =>
    setHealthContacts((prev) => prev.filter((c) => c.id !== id));

  const setVaccinationCard = (card: VaccinationCard) =>
    setVaccinationCards((prev) => {
      const without = prev.filter((c) => c.childId !== card.childId);
      return [...without, card];
    });
  const deleteVaccinationCard = (childId: string) =>
    setVaccinationCards((prev) => prev.filter((c) => c.childId !== childId));

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        childrenList,
        selectedChildId,
        setSelectedChildId,
        addChild,
        updateChild,
        deleteChild,
        activeSection,
        setActiveSection,
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        medicalFiles,
        addMedicalFile,
        deleteMedicalFile,
        growthRecords,
        addGrowthRecord,
        deleteGrowthRecord,
        foodEntries,
        addFoodEntry,
        deleteFoodEntry,
        vaccines,
        addVaccine,
        updateVaccine,
        deleteVaccine,
        healthContacts,
        addHealthContact,
        deleteHealthContact,
        vaccinationCards,
        setVaccinationCard,
        deleteVaccinationCard,
        language,
        setLanguage,
        t,
      }}
    >
      {reactChildren}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
