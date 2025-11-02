import React, { useState } from 'react';
import './UserForm.css';

const UserForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    fitnessGoal: '',
    fitnessLevel: '',
    workoutLocation: '',
    dietaryPreferences: '',
    medicalHistory: '',
    stressLevel: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="user-form-container">
      <div className="form-header">
        <h2>Tell Me About Yourself</h2>
        <p>Fill in your details to get a personalized fitness plan</p>
      </div>

      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-grid">
          {/* Personal Information */}
          <div className="form-section">
            <h3><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
    <path d="M15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12C13.6569 12 15 10.6569 15 9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M17 17C17 14.2386 14.7614 12 12 12C9.23858 12 7 14.2386 7 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg> Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Physical Stats */}
          <div className="form-section">
            <h3><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
    <path d="M6.5 17.5L6.5 14.5M11.5 17.5L11.5 8.5M16.5 17.5V13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
    <path d="M21.5 5.5C21.5 7.15685 20.1569 8.5 18.5 8.5C16.8431 8.5 15.5 7.15685 15.5 5.5C15.5 3.84315 16.8431 2.5 18.5 2.5C20.1569 2.5 21.5 3.84315 21.5 5.5Z" stroke="currentColor" stroke-width="1.5"></path>
    <path d="M21.4955 11C21.4955 11 21.5 11.3395 21.5 12C21.5 16.4784 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4784 2.5 12C2.5 7.52169 2.5 5.28252 3.89124 3.89127C5.28249 2.50003 7.52166 2.50003 12 2.50003L13 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg> Physical Stats</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Fitness Goals */}
          <div className="form-section">
            <h3><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
    <path d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
    <path d="M14 2.20004C13.3538 2.06886 12.6849 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 11.3151 21.9311 10.6462 21.8 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
    <path d="M12.0303 11.9624L16.5832 7.40948M19.7404 4.3445L19.1872 2.35736C19.0853 2.02999 18.6914 1.89953 18.4259 2.1165C16.9898 3.29006 15.4254 4.87079 16.703 7.36407C19.2771 8.56442 20.7466 6.94572 21.8733 5.58518C22.0975 5.31448 21.9623 4.90755 21.6247 4.80993L19.7404 4.3445Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg> Fitness Goals</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Fitness Goal</label>
                <select
                  name="fitnessGoal"
                  value={formData.fitnessGoal}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Goal</option>
                  <option value="weight-loss">Weight Loss</option>
                  <option value="muscle-gain">Muscle Gain</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="endurance">Endurance</option>
                  <option value="toning">Toning</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fitness Level</label>
                <select
                  name="fitnessLevel"
                  value={formData.fitnessLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="form-section">
            <h3><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
    <path d="M14.5 7.5C14.5 4.73858 12.2614 2.5 9.5 2.5C6.73858 2.5 4.5 4.73858 4.5 7.5C4.5 10.2614 6.73858 12.5 9.5 12.5C12.2614 12.5 14.5 10.2614 14.5 7.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M2.5 19.5C2.5 15.634 5.63401 12.5 9.5 12.5C10.5736 12.5 11.5907 12.7417 12.5 13.1736" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M18 20C18.9293 20 19.7402 19.493 20.171 18.7404M18 20C17.0707 20 16.2598 19.493 15.829 18.7404M18 20L18 21.5M18 15C18.9292 15 19.74 15.5069 20.1709 16.2593M18 15C17.0708 15 16.26 15.5069 15.8291 16.2593M18 15L18 13.5M21.5 15.4998L20.1709 16.2593M14.5 19.4998L15.829 18.7404M21.5 19.4998L20.171 18.7404M14.5 15.4998L15.8291 16.2593M20.1709 16.2593C20.3803 16.6249 20.5 17.0485 20.5 17.5C20.5 17.9514 20.3804 18.3749 20.171 18.7404M15.829 18.7404C15.6196 18.3749 15.5 17.9514 15.5 17.5C15.5 17.0485 15.6197 16.6249 15.8291 16.2593" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg> Preferences</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Workout Location</label>
                <select
                  name="workoutLocation"
                  value={formData.workoutLocation}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Location</option>
                  <option value="home">Home</option>
                  <option value="gym">Gym</option>
                  <option value="outdoor">Outdoor</option>
                </select>
              </div>
              <div className="form-group">
                <label>Dietary Preferences</label>
                <select
                  name="dietaryPreferences"
                  value={formData.dietaryPreferences}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Preference</option>
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="keto">Keto</option>
                  <option value="paleo">Paleo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="form-section">
            <h3><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
    <path d="M15.5 6.5C15.5 8.433 13.933 10 12 10C10.067 10 8.5 8.433 8.5 6.5C8.5 4.567 10.067 3 12 3C13.933 3 15.5 4.567 15.5 6.5Z" stroke="currentColor" stroke-width="1.5"></path>
    <path d="M22 17.5C22 19.433 20.433 21 18.5 21C16.567 21 15 19.433 15 17.5C15 15.567 16.567 14 18.5 14C20.433 14 22 15.567 22 17.5Z" stroke="currentColor" stroke-width="1.5"></path>
    <path d="M9 17.5C9 19.433 7.433 21 5.5 21C3.567 21 2 19.433 2 17.5C2 15.567 3.567 14 5.5 14C7.433 14 9 15.567 9 17.5Z" stroke="currentColor" stroke-width="1.5"></path>
</svg> Additional Information (Optional)</h3>
            <div className="form-row">
              <div className="form-group full-width">
                <label>Medical History</label>
                <textarea
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  placeholder="Any medical conditions, injuries, or concerns..."
                  rows="3"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Stress Level</label>
                <select
                  name="stressLevel"
                  value={formData.stressLevel}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="submit-button">
          Generate My Fitness Plan <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
    <path d="M8 10.1667L12.1232 6.04344C13.2481 4.91858 13.8105 4.35614 14.4312 3.90314C15.7047 2.9737 17.1818 2.36187 18.7395 2.11858C19.4988 2 20.2942 2 21.885 2C21.9681 2 22 2.03812 22 2.11504C22 3.70584 22 4.50125 21.8814 5.26046C21.6381 6.81818 21.0263 8.29527 20.0969 9.56878C19.6439 10.1895 19.0814 10.7519 17.9566 11.8768L13.8333 16" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M10.341 8.09838C8.63808 8.09838 6.49778 7.73765 4.9043 8.39769C3.73671 8.88132 2.87754 10.0012 2 10.8787L5.30597 12.2955C6.18208 12.671 5.64651 13.7766 5.50147 14.5018C5.33985 15.3099 5.34886 15.3397 5.93158 15.9224L8.07758 18.0684C8.6603 18.6511 8.69008 18.6602 9.49816 18.4985C10.2234 18.3535 11.329 17.8179 11.7044 18.694L13.1213 22C13.9988 21.1225 15.1187 20.2633 15.6023 19.0957C16.2624 17.5022 15.9016 15.3619 15.9016 13.659" stroke="#ffffff" stroke-width="1.5" stroke-linejoin="round"></path>
    <path d="M12 20L11 21" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M4 12L3 13" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M15 4.07996C16.2 4.25996 17.46 4.73996 18.1614 5.45996C19.0576 6.25211 19.68 7.31996 19.92 8.99996" stroke="#ffffff" stroke-width="1.5" stroke-linecap="square"></path>
    <path d="M17.94 6.06006L16.5 7.50006" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path>
</svg>
        </button>
      </form>
    </div>
  );
};

export default UserForm;