import React from 'react';
import { useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import ChildProfile from './components/ChildProfile';
import MedicalAgenda from './components/MedicalAgenda';
import PrescriptionsExams from './components/PrescriptionsExams';
import GrowthCurve from './components/GrowthCurve';
import FoodRoutine from './components/FoodRoutine';
import VaccineHistory from './components/VaccineHistory';
import HealthContacts from './components/HealthContacts';

function MainContent() {
  const { activeSection } = useApp();

  const sections: Record<string, React.ReactNode> = {
    profile: <ChildProfile />,
    agenda: <MedicalAgenda />,
    prescriptions: <PrescriptionsExams />,
    growth: <GrowthCurve />,
    food: <FoodRoutine />,
    vaccines: <VaccineHistory />,
    contacts: <HealthContacts />,
  };

  return (
    <main className="flex-1 overflow-y-auto min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-8 mt-10 md:mt-0">
        {sections[activeSection] ?? <ChildProfile />}
      </div>
    </main>
  );
}

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-rose-50">
      <Sidebar />
      <MainContent />
    </div>
  );
}
