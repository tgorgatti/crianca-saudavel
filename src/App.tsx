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

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-rose-50 p-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Algo deu errado</h2>
            <p className="text-sm text-gray-500 mb-6">
              {this.state.error?.message ?? 'Erro desconhecido'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-primary"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    <main className="flex-1 overflow-y-auto">
      <div key={activeSection} className="max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-8 mt-14 md:mt-0 page-enter">
        {sections[activeSection] ?? <ChildProfile />}
      </div>
    </main>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <div className="flex h-screen overflow-hidden bg-rose-50/70">
        <Sidebar />
        <MainContent />
      </div>
    </ErrorBoundary>
  );
}
