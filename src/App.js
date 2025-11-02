import React, { useState, useEffect } from 'react';
import UserForm from './components/UserForm/UserForm';
import WorkoutPlan from './components/WorkoutPlan/WorkoutPlan';
import DietPlan from './components/DietPlan/DietPlan';
import SavedPlans from './components/SavedPlans/SavedPlans';
import { FreeAIService } from './services/freeAIService';
import { LocalStorageService } from './services/localStorageService';
import './App.css';

function App() {
  const [userData, setUserData] = useState(null);
  const [currentView, setCurrentView] = useState('form');
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [showSavedPlans, setShowSavedPlans] = useState(false);
  const [savedPlans, setSavedPlans] = useState({
    workout: [],
    diet: []
  });

  useEffect(() => {
    // Load motivational quote on app start
    const loadQuote = async () => {
      const quote = await FreeAIService.generateMotivationalQuote();
      setMotivationalQuote(quote);
    };
    loadQuote();

    // Load saved plans
    loadSavedPlans();
  }, []);

  const loadSavedPlans = () => {
    const workoutPlans = LocalStorageService.getWorkoutPlans();
    const dietPlans = LocalStorageService.getDietPlans();
    setSavedPlans({
      workout: workoutPlans,
      diet: dietPlans
    });
  };

  const handleFormSubmit = (data) => {
    setUserData(data);
    setCurrentView('workout');
    // Refresh quote when new plan is generated
    FreeAIService.generateMotivationalQuote().then(setMotivationalQuote);
  };

  const handlePlanSave = () => {
    // Reload saved plans when a new plan is saved
    loadSavedPlans();
  };

  const handleLoadSavedPlan = (plan, type) => {
    setUserData(plan.userData);
    if (type === 'workout') {
      setCurrentView('workout');
    } else {
      setCurrentView('diet');
    }
    setShowSavedPlans(false);
  };

  const handleDeletePlan = (planId, type) => {
    if (type === 'workout') {
      LocalStorageService.deleteWorkoutPlan(planId);
    }
    loadSavedPlans();
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'form':
        return (
          <div className="main-content">
            <UserForm onSubmit={handleFormSubmit} />
            {savedPlans.workout.length > 0 && (
              <SavedPlans 
                plans={savedPlans}
                onLoadPlan={handleLoadSavedPlan}
                onDeletePlan={handleDeletePlan}
                isOpen={showSavedPlans}
                onToggle={() => setShowSavedPlans(!showSavedPlans)}
              />
            )}
          </div>
        );
      case 'workout':
        return <WorkoutPlan userData={userData} onPlanSave={handlePlanSave} />;
      case 'diet':
        return <DietPlan userData={userData} onPlanSave={handlePlanSave} />;
      default:
        return <UserForm onSubmit={handleFormSubmit} />;
    }
  };

  return (
    <div className="App">
      {/* Animated Background */}
      <div className="app-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <header className="app-header">
        <div className="header-content">
          <h1><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
    <path d="M2.01792 20.3051C3.14656 21.9196 8.05942 23.1871 10.3797 20.1645C12.8894 21.3649 17.0289 20.9928 20.3991 19.1134C20.8678 18.8521 21.3112 18.5222 21.5827 18.0593C22.1957 17.0143 22.2102 15.5644 21.0919 13.4251C19.2274 8.77072 15.874 4.68513 14.5201 3.04212C14.2421 2.78865 12.4687 2.42868 11.3872 2.08279C10.9095 1.93477 10.02 1.83664 8.95612 3.23862C8.45176 3.90329 6.16059 5.5357 9.06767 6.63346C9.51805 6.74806 9.84912 6.95939 11.9038 6.58404C12.1714 6.53761 12.8395 6.58404 13.3103 7.41041L14.2936 8.81662C14.3851 8.94752 14.4445 9.09813 14.4627 9.25682C14.635 10.7557 14.6294 12.6323 15.4651 13.5826C14.1743 12.6492 10.8011 11.5406 8.2595 14.6951M2.00189 12.94C3.21009 11.791 6.71197 9.97592 10.4179 12.5216" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg> AI Fitness Coach</h1>
          {motivationalQuote && (
            <div className="motivational-quote">
              <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ff0000" fill="none">
    <path d="M21.9598 10.9707C22.0134 11.8009 22.0134 12.6607 21.9598 13.4909C21.6856 17.7332 18.3536 21.1125 14.1706 21.3905C12.7435 21.4854 11.2536 21.4852 9.8294 21.3905C9.33896 21.3579 8.8044 21.2409 8.34401 21.0513C7.83177 20.8403 7.5756 20.7348 7.44544 20.7508C7.31527 20.7668 7.1264 20.9061 6.74868 21.1846C6.08268 21.6757 5.24367 22.0285 3.99943 21.9982C3.37026 21.9829 3.05568 21.9752 2.91484 21.7351C2.77401 21.495 2.94941 21.1626 3.30021 20.4978C3.78674 19.5758 4.09501 18.5203 3.62791 17.6746C2.82343 16.4666 2.1401 15.036 2.04024 13.4909C1.98659 12.6607 1.98659 11.8009 2.04024 10.9707C2.31441 6.72838 5.64639 3.34913 9.8294 3.07107C11.0318 2.99114 11.2812 2.97856 12.5 3.03368" stroke="#ff0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M8.5 15H15.5M8.5 10H12" stroke="#ff0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M22 5.5C22 7.433 20.433 9 18.5 9C16.567 9 15 7.433 15 5.5C15 3.567 16.567 2 18.5 2C20.433 2 22 3.567 22 5.5Z" stroke="#ff0000" stroke-width="1.5"></path>
</svg> {motivationalQuote}</span>
            </div>
          )}
        </div>
        
        {userData && (
          <nav className="navigation">
            <button 
              onClick={() => setCurrentView('workout')}
              className={currentView === 'workout' ? 'active' : ''}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
    <path d="M16 5.5C16 6.32843 15.3284 7 14.5 7C13.6716 7 13 6.32843 13 5.5C13 4.67157 13.6716 4 14.5 4C15.3284 4 16 4.67157 16 5.5Z" stroke="#ffffff" stroke-width="1.5"></path>
    <path d="M14.3602 15L15.3039 14.454C16.3786 13.8323 16.9159 13.5214 16.9885 13.0784C16.9999 13.0092 17.0028 12.9391 16.9973 12.8694C16.9622 12.4229 16.4524 12.0789 15.4329 11.3907L10.7259 8.21359C8.87718 6.96577 8.45184 4.69114 9.75097 3" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M10.7259 8.21359C8.22588 10.7136 7 17.6324 7 21.0003M10.7259 8.21359C8.87718 6.96577 8.45184 4.69114 9.75097 3M10.7259 8.21359L13.3725 10M14.3602 15L15.3039 14.454C16.3786 13.8323 16.9159 13.5214 16.9885 13.0784C16.9999 13.0092 17.0028 12.9391 16.9973 12.8694C16.9622 12.4229 16.4524 12.0789 15.4329 11.3907L13.3725 10M15.0002 21.0003C14.0268 19.8647 13.0257 18.3 12.0502 16.8578C11.3666 15.8474 11.0249 15.3422 10.9845 14.8132M13.3725 10C12.5697 11.0391 12.0164 12.0207 11.6026 12.8942C11.1636 13.8209 10.9441 14.2843 10.9845 14.8132M10.9845 14.8132L8 14" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg> Workout Plan
            </button>
            <button 
              onClick={() => setCurrentView('diet')}
              className={currentView === 'diet' ? 'active' : ''}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
    <path d="M8.20026 9.07541C6.09891 11.1768 0.635392 20.0024 2.31647 21.6835C3.99756 23.3646 12.8232 17.9011 14.9246 15.7997C17.0259 13.6984 18.2868 12.4376 14.9246 9.07541C11.5624 5.71325 10.3016 6.97406 8.20026 9.07541Z" stroke="#ffffff" stroke-width="1.5"></path>
    <path d="M14.5 15.5L13 14" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M7 11L8.5 12.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M9 19L8 18" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M15 2C15.5185 2.51852 15.8555 3.63331 15.0001 5.11102M22 9C21.4815 8.48148 20.3668 8.14445 18.8892 9M19.2782 4.72192L17.3339 6.66636" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg> Diet Plan
            </button>
            <button 
              onClick={() => {
                setCurrentView('form');
                setUserData(null);
                loadSavedPlans();
              }}
              className="new-plan-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
    <path d="M11.7805 14C10.4461 15.3922 8.56592 17 7 17C4.23858 17 2 14.7614 2 12C2 9.23858 4.23858 7 7 7C12.0899 7 13.5399 15.5 18.5217 15.5C20.4427 15.5 22 13.933 22 12C22 10.067 20.4427 8.5 18.5217 8.5C17.6263 8.5 16.4746 9.26045 15.5 10.0724" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <circle cx="12" cy="12" r="10" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></circle>
</svg> New Plan
            </button>
          </nav>
        )}
      </header>
      
      <main className="app-main">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;