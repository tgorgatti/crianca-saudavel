export interface Child {
  id: string;
  name: string;
  birthDate: string;
  photoData: string | null;
}

export interface Appointment {
  id: string;
  childId: string;
  date: string;
  time: string;
  location: string;
  notes: string;
}

export interface MedicalFile {
  id: string;
  childId: string;
  name: string;
  fileType: 'prescription' | 'exam';
  fileData: string;
  mimeType: string;
  date: string;
  notes: string;
}

export interface GrowthRecord {
  id: string;
  childId: string;
  date: string;
  weight: number | null;
  height: number | null;
}

export interface FoodEntry {
  id: string;
  childId: string;
  date: string;
  mealType: string;
  description: string;
  acceptance: string;
  notes: string;
}

export interface Vaccine {
  id: string;
  childId: string;
  name: string;
  scheduledDate: string;
  appliedDate: string;
  status: 'applied' | 'pending';
  reactions: string;
  notes: string;
}

export interface HealthContact {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

export type Section =
  | 'profile'
  | 'agenda'
  | 'prescriptions'
  | 'growth'
  | 'food'
  | 'vaccines'
  | 'contacts';
