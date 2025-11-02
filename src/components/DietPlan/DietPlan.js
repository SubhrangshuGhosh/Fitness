import React, { useState, useEffect, useCallback } from 'react';
import { FreeAIService } from '../../services/freeAIService';
import './DietPlan.css';

const DietPlan = ({ userData }) => {
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // Wrap in useCallback to fix useEffect dependency
  const generateDietPlan = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const plan = await FreeAIService.generateDietPlan(userData);
      setDietPlan(plan);
      setUsingFallback(false);
    } catch (err) {
      setError(`Failed to generate diet plan: ${err.message}`);
      console.error('Diet generation error:', err);
    } finally {
      setLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    generateDietPlan();
  }, [generateDietPlan]);

  const regeneratePlan = () => {
    generateDietPlan();
  };

  if (loading) {
    return (
      <div className="diet-plan-container">
        <div className="plan-header">
          <h2><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"></circle>
    <path d="M15.9453 12.3948C15.7686 13.0215 14.9333 13.4644 13.2629 14.3502C11.648 15.2064 10.8406 15.6346 10.1899 15.4625C9.9209 15.3913 9.6758 15.2562 9.47812 15.0701C9 14.6198 9 13.7465 9 12C9 10.2535 9 9.38018 9.47812 8.92995C9.6758 8.74381 9.9209 8.60868 10.1899 8.53753C10.8406 8.36544 11.648 8.79357 13.2629 9.64983C14.9333 10.5356 15.7686 10.9785 15.9453 11.6052C16.0182 11.8639 16.0182 12.1361 15.9453 12.3948Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path>
</svg> Generating Your Diet Plan</h2>
          <p>Creating personalized nutrition for {userData.name}</p>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <h3>AI is crafting your perfect meal plan...</h3>
          <p>This may take a few seconds</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="diet-plan-container">
        <div className="error-state">
          <h3><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
    <path d="M4 11.9949L4 14.5404C4 17.7871 4 19.4104 4.88607 20.5099C5.06508 20.732 5.26731 20.9344 5.48933 21.1135C6.58831 22 8.21082 22 11.4558 22C12.1614 22 12.5141 22 12.8372 21.8859C12.9044 21.8622 12.9702 21.8349 13.0345 21.8042C13.3436 21.6563 13.593 21.4067 14.0919 20.9076L18.8284 16.1686C19.4065 15.5903 19.6955 15.3011 19.8478 14.9334C20 14.5656 20 14.1567 20 13.3388V9.99394C20 6.2208 20 4.33423 18.8284 3.16206C17.8971 2.23022 16.5144 2.03917 14.0919 2M13 21.4997V20.9995C13 18.1696 13 16.7547 13.8787 15.8756C14.7574 14.9965 16.1716 14.9965 19 14.9965H19.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M11 9L4 2M11 2L4 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg> Unable to Generate Diet Plan</h3>
          <p>{error}</p>
          <button onClick={regeneratePlan} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="diet-plan-container">
      <div className="plan-header">
        <div className="header-top">
          <h2><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
    <path d="M17 13.2308C17 13.2308 16.0909 12.7693 15.1818 12.7693C13.8182 12.7693 12 14.6154 12 17.3846C12 20.1537 14.4896 22 17 22C19.5104 22 22 20.1537 22 17.3846C22 14.6154 20.1818 12.7693 18.8182 12.7693C17.9091 12.7693 17 13.2308 17 13.2308ZM17 13.2308C17 11.8462 17.9091 10 19.7273 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M10.655 5C11.5512 5 12.2778 4.32843 12.2778 3.5C12.2778 2.67157 11.5512 2 10.655 2H5.24561C4.34936 2 3.6228 2.67157 3.6228 3.5C3.6228 4.32843 4.34936 5 5.24561 5M11.1693 4.92311C12.1247 6.68943 12.9095 8.28337 13.3888 10C13.4279 10.1401 13.465 10.281 13.5 10.4229M10.428 22H6.32748C2.74721 22 2 21.3093 2 18V13.7771C2 10.3773 3.09757 7.88562 4.70467 4.91465" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg> Your Personalized Diet Plan</h2>
          {usingFallback && (
            <span className="fallback-badge">Smart Template</span>
          )}
        </div>
        <p>Nutrition plan tailored for {userData.name}'s goals</p>
        <button onClick={regeneratePlan} className="regenerate-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
    <path d="M16.3884 3L17.3913 3.97574C17.8393 4.41165 18.0633 4.62961 17.9844 4.81481C17.9056 5 17.5888 5 16.9552 5H9.19422C5.22096 5 2 8.13401 2 12C2 13.4872 2.47668 14.8662 3.2895 16" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M7.61156 21L6.60875 20.0243C6.16074 19.5883 5.93673 19.3704 6.01557 19.1852C6.09441 19 6.4112 19 7.04478 19H14.8058C18.779 19 22 15.866 22 12C22 10.5128 21.5233 9.13383 20.7105 8" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg> Regenerate Plan
        </button>
      </div>

      {dietPlan && (
        <div className="plan-content">
          <div className="plan-overview">
            <h3>{dietPlan.title}</h3>
            <p className="plan-description">{dietPlan.description}</p>
            
            <div className="plan-meta">
              <span>Daily Calories: {dietPlan.dailyCalories}</span>
              <span>Diet: {userData.dietaryPreferences}</span>
              <span>Goal: {userData.fitnessGoal}</span>
            </div>
          </div>

          {/* Daily Meals */}
          <div className="meals-section">
            <h4><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
    <path d="M21 17C18.2386 17 16 14.7614 16 12C16 9.23858 18.2386 7 21 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
    <path d="M21 21C16.0294 21 12 16.9706 12 12C12 7.02944 16.0294 3 21 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
    <path d="M6 3L6 8M6 21L6 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M3.5 8H8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M9 3L9 7.35224C9 12.216 3 12.2159 3 7.35207L3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg> Daily Meal Plan</h4>
            <div className="meals-grid">
              <div className="meal-card">
                <h5><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
    <path d="M8.5 4C5.04311 4 2 5.59321 2 7.55853C2 8.92302 3.6427 9.93848 3.43338 11.2206L3.18919 15.7778C3.08307 17.7584 3.03001 18.7487 3.59988 19.3744C4.16975 20 5.12486 20 7.0351 20H9.9649C11.8751 20 12.8303 20 13.4001 19.3744C13.97 18.7487 13.9169 17.7584 13.8108 15.7778L13.5666 11.2206C13.3573 9.93848 15 8.92302 15 7.55853C15 5.59321 11.9569 4 8.5 4Z" stroke="currentColor" stroke-width="1.5"></path>
    <path d="M11 20H17.1838C19.011 20 19.9246 20 20.4697 19.3744C21.0148 18.7487 20.964 17.7584 20.8625 15.7778L20.629 11.2206C20.4287 9.93848 22 8.92302 22 7.55853C22 5.59321 19.0892 4 15.7826 4H8" stroke="currentColor" stroke-width="1.5"></path>
</svg> Breakfast</h5>
                <p>{dietPlan.meals.breakfast}</p>
              </div>
              <div className="meal-card">
                <h5><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
    <path d="M18 12C18 10.6193 16.8807 9.5 15.5 9.5C14.1193 9.5 13 10.6193 13 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
    <path d="M6 3V12M8.5 2.5V7.5M11 2V7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M4 4.5L6 4.1875M20 2L13.5 3.01562M4 7L6 6.875M20 6L13.5 6.40625" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M4.91145 12H19.0886C20.6914 12 21.2786 12.3707 20.8787 13.9821C20.1733 16.8246 18.1759 17.5306 16.3304 19.3859C15.8819 19.8369 16.5798 20.5032 16.5802 20.9992C16.5809 21.933 15.6928 22 14.9854 22H9.0146C8.30717 22 7.41908 21.933 7.41982 20.9992C7.4202 20.5137 8.0972 19.8159 7.66957 19.3859C5.82407 17.5306 3.82674 16.8246 3.12128 13.9821C2.72136 12.3707 3.30857 12 4.91145 12Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path>
</svg> Lunch</h5>
                <p>{dietPlan.meals.lunch}</p>
              </div>
              <div className="meal-card">
                <h5><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
    <path d="M13 9C13 10.1046 13.8954 11 15 11C16.1046 11 17 10.1046 17 9C17 7.89543 16.1046 7 15 7C13.8954 7 13 7.89543 13 9Z" stroke="currentColor" stroke-width="1.5"></path>
    <path d="M10 9C10 11.7614 12.2386 14 15 14C17.7614 14 20 11.7614 20 9C20 6.23858 17.7614 4 15 4C12.2386 4 10 6.23858 10 9Z" stroke="currentColor" stroke-width="1.5"></path>
    <path d="M11.5 2L7.53669 16.412M6 22L6.825 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M22 12.5L2 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg> Dinner</h5>
                <p>{dietPlan.meals.dinner}</p>
              </div>
              <div className="meal-card">
                <h5><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
    <path d="M8 5C5.23858 5 3 8.0139 3 11.0278C3 14.544 3.5 17.0556 5.5 20.0695C7.02044 22.1062 9.05026 22.6168 11.2139 21.1903C11.6757 20.8859 12.3243 20.8859 12.7861 21.1903C14.9497 22.6168 16.9796 22.1062 18.5 20.0695C20.5 17.0556 21 14.544 21 11.0278C21 8.0139 18.7614 5 16 5C14.5746 5 13.2885 5.7849 12.3777 6.63254C12.166 6.82949 11.834 6.82949 11.6223 6.63254C10.7115 5.7849 9.42542 5 8 5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path>
    <path d="M6 12C6 10.3665 6.82273 8.73298 8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M12 6C12 4.66667 12.6 2 15 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg> Snacks</h5>
                <p>{dietPlan.meals.snacks}</p>
              </div>
            </div>
          </div>

          {/* Hydration */}
          <div className="hydration-section">
            <h4><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
    <path d="M2 13.3424C2 9.9951 4.73825 6.68726 6.66022 4.77778C7.70404 3.74074 9.29597 3.74074 10.3398 4.77778C12.2617 6.68726 15 9.9951 15 13.3424C15 16.6243 12.5386 20 8.5 20C4.46142 20 2 16.6243 2 13.3424Z" stroke="currentColor" stroke-width="1.5"></path>
    <path d="M15.5 20C19.5386 20 22 16.6243 22 13.3424C22 9.9951 19.2617 6.68726 17.3398 4.77778C16.296 3.74074 14.704 3.74074 13.6602 4.77778" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
</svg> Hydration</h4>
            <p>{dietPlan.hydration}</p>
          </div>

          {/* Nutrition Tips */}
          <div className="tips-section">
            <h4><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
    <path d="M20 8C20 9.93293 18.433 11.5 16.5 11.5C14.567 11.5 13 9.93293 13 8C13 6.067 14.567 4.5 16.5 4.5C18.433 4.5 20 6.067 20 8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"></path>
    <path d="M14.8311 4.92276C14.3768 3.51685 13.0571 2.5 11.5 2.5C9.567 2.5 8 4.067 8 6C8 7.93293 9.567 9.5 11.5 9.5C12.1043 9.5 12.6728 9.34684 13.1689 9.07723" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
    <path d="M4 13.5H6.39482C6.68897 13.5 6.97908 13.5663 7.24217 13.6936L9.28415 14.6816C9.54724 14.8089 9.83735 14.8751 10.1315 14.8751H11.1741C12.1825 14.8751 13 15.6662 13 16.642C13 16.6814 12.973 16.7161 12.9338 16.7269L10.3929 17.4295C9.93707 17.5555 9.449 17.5116 9.025 17.3064L6.84211 16.2503M13 16L17.5928 14.5889C18.407 14.3352 19.2871 14.636 19.7971 15.3423C20.1659 15.8529 20.0157 16.5842 19.4785 16.8942L11.9629 21.2305C11.4849 21.5063 10.9209 21.5736 10.3952 21.4176L4 19.5199" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg> Nutrition Tips</h4>
            <ul className="tips-list">
              {dietPlan.nutritionTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>

          {/* Shopping List */}
          <div className="shopping-section">
            <h4><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
    <path d="M8 16L16.7201 15.2733C19.4486 15.046 20.0611 14.45 20.3635 11.7289L21 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
    <path d="M6 6H22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
    <circle cx="6" cy="20" r="2" stroke="currentColor" stroke-width="1.5"></circle>
    <circle cx="17" cy="20" r="2" stroke="currentColor" stroke-width="1.5"></circle>
    <path d="M8 20L15 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
    <path d="M2 2H2.966C3.91068 2 4.73414 2.62459 4.96326 3.51493L7.93852 15.0765C8.08887 15.6608 7.9602 16.2797 7.58824 16.7616L6.63213 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
</svg> Shopping List</h4>
            <div className="shopping-grid">
              {dietPlan.shoppingList.map((item, index) => (
                <span key={index} className="shopping-item">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietPlan;