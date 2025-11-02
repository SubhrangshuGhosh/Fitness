import React, { useState, useEffect, useCallback } from 'react';
import { FreeAIService } from '../../services/freeAIService';
import { PDFExportService } from '../../services/pdfExportService';
import { LocalStorageService } from '../../services/localStorageService';
import { SVGIcon } from '../SVG/Icons';
import './WorkoutPlan.css';

const WorkoutPlan = ({ userData }) => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const generateWorkoutPlan = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSaved(false);
      
      const plan = await FreeAIService.generateWorkoutPlan(userData);
      console.log('📋 Received workout plan:', plan);
      
      if (!plan || typeof plan !== 'object') {
        throw new Error('Invalid plan received from AI');
      }
      
      setWorkoutPlan(plan);
      setUsingFallback(false);
    } catch (err) {
      setError(`Failed to generate workout plan: ${err.message}`);
      console.error('Workout generation error:', err);
    } finally {
      setLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    generateWorkoutPlan();
  }, [generateWorkoutPlan]);

  const handleSavePlan = () => {
    if (workoutPlan) {
      try {
        LocalStorageService.saveWorkoutPlan(workoutPlan, userData);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch (error) {
        alert('Failed to save plan: ' + error.message);
      }
    }
  };

  const handleExportPDF = async () => {
    if (workoutPlan) {
      try {
        await PDFExportService.exportWorkoutPlan(workoutPlan, userData);
      } catch (error) {
        alert('Failed to export PDF: ' + error.message);
      }
    }
  };

  const regeneratePlan = () => {
    generateWorkoutPlan();
  };

  if (loading) {
    return (
      <div className="workout-plan-container">
        <div className="plan-header">
          <h2>
            <SVGIcon name="workout" className="svg-icon header-icon" />
            Generating Your Workout Plan
          </h2>
          <p>Creating a personalized plan for {userData.name}</p>
        </div>
        <div className="loading-state">
          <div className="pulse-loader">
            <div className="pulse-dot"></div>
            <div className="pulse-dot"></div>
            <div className="pulse-dot"></div>
          </div>
          <h3>Crafting your perfect workout...</h3>
          <p>AI is personalizing your fitness journey</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="workout-plan-container">
        <div className="error-state">
          <div className="error-icon">
            <SVGIcon name="tips" className="svg-icon" />
          </div>
          <h3>Unable to Generate Plan</h3>
          <p>{error}</p>
          <button onClick={regeneratePlan} className="retry-button">
            <SVGIcon name="regenerate" className="svg-icon" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="workout-plan-container">
      {/* Animated Background */}
      <div className="app-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="plan-header">
        <div className="header-top">
          <h2>
            <SVGIcon name="workout" className="svg-icon header-icon" />
            Your Personalized Workout Plan
          </h2>
          {usingFallback && (
            <span className="fallback-badge">Smart Template</span>
          )}
        </div>
        <p>Created specifically for {userData.name}</p>
        <button onClick={regeneratePlan} className="regenerate-button">
          <SVGIcon name="regenerate" className="svg-icon" />
          Regenerate Plan
        </button>
      </div>

      {workoutPlan && (
        <>
          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              onClick={handleExportPDF}
              className="action-btn btn-primary"
            >
              <SVGIcon name="download" className="svg-icon" />
              Export PDF
            </button>
            <button 
              onClick={handleSavePlan}
              className="action-btn btn-secondary"
              disabled={saved}
            >
              <SVGIcon name="save" className="svg-icon" />
              {saved ? 'Saved!' : 'Save Plan'}
            </button>
            {process.env.NODE_ENV === 'development' && (
              <button 
                onClick={() => setShowDebug(!showDebug)}
                className="action-btn btn-accent"
              >
                <SVGIcon name="tips" className="svg-icon" />
                {showDebug ? 'Hide Debug' : 'Show Debug'}
              </button>
            )}
          </div>

          {/* Plan Content */}
          <div id="workout-plan-content" className="plan-content">
            {/* Plan Overview */}
            <div className="plan-overview glass-card">
              <h3>{workoutPlan.title || 'Your Workout Plan'}</h3>
              <p className="plan-description">
                {workoutPlan.description || `Personalized plan for ${userData.fitnessGoal}`}
              </p>
              
              <div className="plan-meta">
                <span>
                  <SVGIcon name="calendar" className="svg-icon" />
                  Duration: {workoutPlan.duration || '4 weeks'}
                </span>
                <span>
                  <SVGIcon name="target" className="svg-icon" />
                  Level: {userData.fitnessLevel}
                </span>
                <span>
                  <SVGIcon name="clock" className="svg-icon" />
                  Goal: {userData.fitnessGoal}
                </span>
              </div>
            </div>

            {/* Weekly Schedule */}
            <div className="weekly-schedule">
              <h4>
                <SVGIcon name="schedule" className="svg-icon" />
                Weekly Schedule
              </h4>
              {workoutPlan.weeklySchedule && workoutPlan.weeklySchedule.length > 0 ? (
                <div className="days-grid">
                  {workoutPlan.weeklySchedule.map((day, index) => (
                    <div key={index} className="day-card glass-card">
                      <h5>{day.day || `Day ${index + 1}`}</h5>
                      <p className="focus">{day.focus || 'Full Body Workout'}</p>
                      <div className="exercises">
                        {day.exercises && Array.isArray(day.exercises) ? (
                          day.exercises.map((exercise, exIndex) => (
                            <span key={exIndex} className="exercise-tag">
                              {exercise.name || `Exercise ${exIndex + 1}`}
                            </span>
                          ))
                        ) : (
                          <span className="exercise-tag">No exercises listed</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-schedule glass-card">
                  <p>No weekly schedule available. Here's a sample workout:</p>
                  <div className="sample-workout">
                    <div className="day-card glass-card">
                      <h5>Sample Full Body Day</h5>
                      <p className="focus">Full Body Strength</p>
                      <div className="exercises">
                        <span className="exercise-tag">Bodyweight Squats</span>
                        <span className="exercise-tag">Push-ups</span>
                        <span className="exercise-tag">Plank</span>
                        <span className="exercise-tag">Walking Lunges</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Exercise Details */}
            {workoutPlan.weeklySchedule && workoutPlan.weeklySchedule.length > 0 && (
              <div className="daily-routines">
                <h4>
                  <SVGIcon name="target" className="svg-icon" />
                  Exercise Details
                </h4>
                {workoutPlan.weeklySchedule.map((day, index) => (
                  <div key={index} className="routine-card glass-card">
                    <h5>{day.day} - {day.focus}</h5>
                    <div className="exercises-list">
                      {day.exercises && Array.isArray(day.exercises) ? (
                        day.exercises.map((exercise, exIndex) => (
                          <div key={exIndex} className="exercise-item">
                            <div className="exercise-header">
                              <span className="exercise-name">
                                {exercise.name || `Exercise ${exIndex + 1}`}
                              </span>
                              <span className="exercise-sets">
                                {exercise.sets || '3'} sets × {exercise.reps || '10-15'}
                              </span>
                            </div>
                            <div className="exercise-details">
                              <span>Rest: {exercise.rest || '60s'}</span>
                              {exercise.tips && <span className="tips"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#f5a623" fill="none">
    <path d="M6.08938 14.9992C5.71097 14.1486 5.5 13.2023 5.5 12.2051C5.5 8.50154 8.41015 5.49921 12 5.49921C15.5899 5.49921 18.5 8.50154 18.5 12.2051C18.5 13.2023 18.289 14.1486 17.9106 14.9992" stroke="#f5a623" stroke-width="1.5" stroke-linecap="round"></path>
    <path d="M12 1.99921V2.99921" stroke="#f5a623" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M22 11.9992H21" stroke="#f5a623" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M3 11.9992H2" stroke="#f5a623" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M19.0704 4.92792L18.3633 5.63503" stroke="#f5a623" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M5.6368 5.636L4.92969 4.92889" stroke="#f5a623" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M14.517 19.3056C15.5274 18.9788 15.9326 18.054 16.0466 17.1238C16.0806 16.8459 15.852 16.6154 15.572 16.6154L8.47685 16.6156C8.18725 16.6156 7.95467 16.8614 7.98925 17.1489C8.1009 18.0773 8.3827 18.7555 9.45345 19.3056M14.517 19.3056C14.517 19.3056 9.62971 19.3056 9.45345 19.3056M14.517 19.3056C14.3955 21.2506 13.8338 22.0209 12.0068 21.9993C10.0526 22.0354 9.60303 21.0833 9.45345 19.3056" stroke="#f5a623" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>{exercise.tips}</span>}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="exercise-item">
                          <div className="exercise-header">
                            <span className="exercise-name">Full Body Workout</span>
                            <span className="exercise-sets">3 sets × 10-12</span>
                          </div>
                          <div className="exercise-details">
                            <span>Rest: 60s</span>
                            <span className="tips"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#f5a623" fill="none">
    <path d="M6.08938 14.9992C5.71097 14.1486 5.5 13.2023 5.5 12.2051C5.5 8.50154 8.41015 5.49921 12 5.49921C15.5899 5.49921 18.5 8.50154 18.5 12.2051C18.5 13.2023 18.289 14.1486 17.9106 14.9992" stroke="#f5a623" stroke-width="1.5" stroke-linecap="round"></path>
    <path d="M12 1.99921V2.99921" stroke="#f5a623" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M22 11.9992H21" stroke="#f5a623" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M3 11.9992H2" stroke="#f5a623" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M19.0704 4.92792L18.3633 5.63503" stroke="#f5a623" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M5.6368 5.636L4.92969 4.92889" stroke="#f5a623" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M14.517 19.3056C15.5274 18.9788 15.9326 18.054 16.0466 17.1238C16.0806 16.8459 15.852 16.6154 15.572 16.6154L8.47685 16.6156C8.18725 16.6156 7.95467 16.8614 7.98925 17.1489C8.1009 18.0773 8.3827 18.7555 9.45345 19.3056M14.517 19.3056C14.517 19.3056 9.62971 19.3056 9.45345 19.3056M14.517 19.3056C14.3955 21.2506 13.8338 22.0209 12.0068 21.9993C10.0526 22.0354 9.60303 21.0833 9.45345 19.3056" stroke="#f5a623" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg> Focus on compound movements</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tips */}
            <div className="tips-section glass-card">
              <h4>
                <SVGIcon name="tips" className="svg-icon" />
                Pro Tips
              </h4>
              {workoutPlan.tips && workoutPlan.tips.length > 0 ? (
                <ul className="tips-list">
                  {workoutPlan.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              ) : (
                <ul className="tips-list">
                  <li>Stay hydrated throughout your workout</li>
                  <li>Focus on proper form over heavy weights</li>
                  <li>Get adequate rest between workout days</li>
                  <li>Listen to your body and adjust as needed</li>
                  <li>Warm up before and cool down after each session</li>
                </ul>
              )}
            </div>

            {/* Motivation */}
            <div className="motivation-section glass-card">
              <h4>
                <SVGIcon name="motivation" className="svg-icon" />
                Motivation
              </h4>
              <p className="motivation-text">
                {workoutPlan.motivation || "You're capable of more than you know! Keep pushing and stay consistent. Every workout brings you closer to your goals. Remember that progress takes time, but every rep counts. You've got this!"}
              </p>
            </div>

            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && showDebug && (
              <div className="debug-info glass-card">
                <h4><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
    <path d="M20.3584 13.3567C19.1689 14.546 16.9308 14.4998 13.4992 14.4998C11.2914 14.4998 9.50138 12.7071 9.50024 10.4993C9.50024 7.07001 9.454 4.83065 10.6435 3.64138C11.8329 2.45212 12.3583 2.50027 17.6274 2.50027C18.1366 2.49809 18.3929 3.11389 18.0329 3.47394L15.3199 6.18714C14.6313 6.87582 14.6294 7.99233 15.3181 8.68092C16.0068 9.36952 17.1234 9.36959 17.8122 8.68109L20.5259 5.96855C20.886 5.60859 21.5019 5.86483 21.4997 6.37395C21.4997 11.6422 21.5479 12.1675 20.3584 13.3567Z" stroke="#ffffff" stroke-width="1.5"></path>
    <path d="M13.5 14.5L7.32842 20.6716C6.22386 21.7761 4.433 21.7761 3.32843 20.6716C2.22386 19.567 2.22386 17.7761 3.32843 16.6716L9.5 10.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path>
    <path d="M5.50896 18.5H5.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg> Debug Info</h4>
                <details open>
                  <summary>View Raw Plan Data</summary>
                  <pre>{JSON.stringify(workoutPlan, null, 2)}</pre>
                </details>
                <div className="debug-stats">
                  <p><strong>User Data:</strong> {JSON.stringify(userData)}</p>
                  <p><strong>Using Fallback:</strong> {usingFallback ? 'Yes' : 'No'}</p>
                  <p><strong>Storage Usage:</strong> {LocalStorageService.getStorageUsage()} bytes</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WorkoutPlan;