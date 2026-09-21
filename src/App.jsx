import { useState } from 'react';
import Logo from './components/Logo/Logo';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import OnboardingForm from './components/OnboardingForm/OnboardingForm';
import PlanDisplay from './components/PlanDisplay/PlanDisplay';
import { useGemini } from './hooks/useGemini';
import { buildFitnessPrompt } from './utils/promptBuilder';
import './App.css';

function App() {
  const [formData, setFormData] = useState(null);
  const { plan, isLoading, error, generate, reset } = useGemini();

  const handleFormComplete = async (data) => {
    setFormData(data);
    await generate(buildFitnessPrompt(data));
  };

  const handleRegenerate = async () => {
    if (!formData) return;
    await generate(buildFitnessPrompt(formData));
  };

  const handleNewPlan = () => {
    reset();
    setFormData(null);
  };

  return (
    <div id="app-root" className="app-root">
      <header id="app-header" className="app-header">
        <Logo size={32} />
        <ThemeToggle />
      </header>

      <main id="app-main" className="app-main">
        {!formData && <OnboardingForm onComplete={handleFormComplete} />}

        {formData && isLoading && (
          <div className="app-state fade-in">
            <div className="app-loader-pulse" />
            <h1 className="app-state-title">Forging your plan…</h1>
            <p className="app-state-text">
              This usually takes 10–15 seconds.
            </p>
          </div>
        )}

        {formData && error && !isLoading && (
          <div className="app-state fade-in">
            <h1 className="app-state-title app-state-title-error">
              Something went wrong
            </h1>
            <p className="app-state-text">{error}</p>
            <div className="app-state-actions">
              <button
                onClick={handleRegenerate}
                className="app-state-btn"
                type="button"
              >
                Try Again
              </button>
              <button
                onClick={handleNewPlan}
                className="app-state-btn app-state-btn-secondary"
                type="button"
              >
                Start Over
              </button>
            </div>
          </div>
        )}

        {formData && plan && !isLoading && !error && (
          <PlanDisplay
            plan={plan}
            userData={formData}
            onRegenerate={handleRegenerate}
            onNewPlan={handleNewPlan}
          />
        )}
      </main>
    </div>
  );
}

export default App;