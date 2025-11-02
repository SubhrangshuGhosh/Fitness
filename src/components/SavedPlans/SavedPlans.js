import React, { useState } from 'react';

import { SVGIcon } from '../SVG/Icons';
import './SavedPlans.css';

const SavedPlans = ({ plans, onLoadPlan, onDeletePlan, isOpen, onToggle }) => {
  const [activeTab, setActiveTab] = useState('workout');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPlanTypeIcon = (type) => {
    return type === 'workout' ? 'workout' : 'target';
  };

  const getGoalIcon = (goal) => {
    const goalIcons = {
      'weight-loss': 'target',
      'muscle-gain': 'workout',
      'endurance': 'clock',
      'toning': 'tips',
      'maintenance': 'calendar'
    };
    return goalIcons[goal] || 'target';
  };

  return (
    <div className={`saved-plans-container ${isOpen ? 'expanded' : 'collapsed'}`}>
      <div className="saved-plans-header" onClick={onToggle}>
        <div className="header-content">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
    <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M15.5 10.5C15.5 10.5 12.9223 14 12 14C11.0777 14 8.5 10.5 8.5 10.5M12 13.5V6.99997M8.5 17H15.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
          <h3>Your Saved Plans</h3>
          <span className="plan-count">
            {plans.workout.length + plans.diet.length} plans
          </span>
        </div>
        <div className="toggle-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
    <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
        </div>
      </div>

      {isOpen && (
        <div className="saved-plans-content">
          {/* Tabs */}
          <div className="saved-plans-tabs">
            <button
              className={`tab-button ${activeTab === 'workout' ? 'active' : ''}`}
              onClick={() => setActiveTab('workout')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
    <path d="M8 6H8.00635M8 12H8.00635M8 18H8.00635M15.9937 6H16M15.9937 12H16M15.9937 18H16" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
              Workout Plans ({plans.workout.length})
            </button>
            <button
              className={`tab-button ${activeTab === 'diet' ? 'active' : ''}`}
              onClick={() => setActiveTab('diet')}
            >
              <SVGIcon name="target" className="svg-icon" />
              Diet Plans ({plans.diet.length})
            </button>
          </div>

          {/* Plans List */}
          <div className="plans-list">
            {(activeTab === 'workout' ? plans.workout : plans.diet).map((plan) => (
              <div key={plan.id} className="saved-plan-card glass-card">
                <div className="plan-header">
                  <div className="plan-type">
                    <SVGIcon 
                      name={getPlanTypeIcon(activeTab)} 
                      className="svg-icon" 
                    />
                    <span className="plan-category">
                      {activeTab === 'workout' ? 'Workout' : 'Diet'}
                    </span>
                  </div>
                  <div className="plan-actions">
                    <button
                      onClick={() => onLoadPlan(plan, activeTab)}
                      className="action-btn load-btn"
                      title="Load this plan"
                    >
                      <SVGIcon name="target" className="svg-icon" />
                      Load
                    </button>
                    <button
                      onClick={() => onDeletePlan(plan.id, activeTab)}
                      className="action-btn delete-btn"
                      title="Delete this plan"
                    >
                      <SVGIcon name="tips" className="svg-icon" />
                      Delete
                    </button>
                  </div>
                </div>

                <div className="plan-content">
                  <h4 className="plan-title">{plan.title}</h4>
                  <p className="plan-description">{plan.description}</p>
                  
                  <div className="plan-meta">
                    <div className="meta-item">
                      <SVGIcon name="calendar" className="svg-icon" />
                      <span>{formatDate(plan.createdAt)}</span>
                    </div>
                    <div className="meta-item">
                      <SVGIcon name={getGoalIcon(plan.userData.fitnessGoal)} className="svg-icon" />
                      <span>{plan.userData.fitnessGoal}</span>
                    </div>
                    <div className="meta-item">
                      <SVGIcon name="clock" className="svg-icon" />
                      <span>{plan.userData.fitnessLevel}</span>
                    </div>
                  </div>

                  <div className="user-info">
                    <span className="user-name">For: {plan.userData.name}</span>
                    <span className="user-stats">
                      {plan.userData.age}y • {plan.userData.height}cm • {plan.userData.weight}kg
                    </span>
                  </div>
                </div>

                {plan.weeklySchedule && (
                  <div className="plan-preview">
                    <div className="preview-header">
                      <SVGIcon name="schedule" className="svg-icon" />
                      <span>Weekly Schedule Preview</span>
                    </div>
                    <div className="preview-days">
                      {plan.weeklySchedule.slice(0, 3).map((day, index) => (
                        <div key={index} className="preview-day">
                          <span className="day-name">{day.day}</span>
                          <span className="day-focus">{day.focus}</span>
                          <span className="exercise-count">
                            {day.exercises?.length || 0} exercises
                          </span>
                        </div>
                      ))}
                      {plan.weeklySchedule.length > 3 && (
                        <div className="more-days">
                          +{plan.weeklySchedule.length - 3} more days
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {plan.meals && (
                  <div className="plan-preview">
                    <div className="preview-header">
                      <SVGIcon name="target" className="svg-icon" />
                      <span>Meal Plan Preview</span>
                    </div>
                    <div className="preview-meals">
                      <div className="meal-preview">
                        <span>Breakfast</span>
                        <span className="meal-desc">{plan.meals.breakfast.substring(0, 40)}...</span>
                      </div>
                      <div className="meal-preview">
                        <span>Lunch</span>
                        <span className="meal-desc">{plan.meals.lunch.substring(0, 40)}...</span>
                      </div>
                      <div className="meal-preview">
                        <span>Dinner</span>
                        <span className="meal-desc">{plan.meals.dinner.substring(0, 40)}...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {(activeTab === 'workout' ? plans.workout.length : plans.diet.length) === 0 && (
            <div className="empty-state glass-card">
              <SVGIcon name="save" className="svg-icon empty-icon" />
              <h4>No {activeTab} plans saved yet</h4>
              <p>Generate a new {activeTab} plan and save it to see it here!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedPlans;