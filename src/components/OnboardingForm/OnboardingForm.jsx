import { useState } from 'react';
import {
  FiUser,
  FiActivity,
  FiTarget,
  FiCoffee,
  FiZap,
  FiAlertCircle,
  FiArrowRight,
} from 'react-icons/fi';
import './OnboardingForm.css';

const GOALS = [
  { value: 'lose-weight', label: 'Lose Weight', desc: 'Cut fat, keep muscle' },
  { value: 'gain-weight', label: 'Gain Weight', desc: 'Add mass, build strength' },
  { value: 'muscle-gain', label: 'Muscle Gain', desc: 'Build lean muscle' },
  { value: 'maintain', label: 'Maintain', desc: 'Stay where you are' },
];

const DIETS = [
  { value: 'no-preference', label: 'No Preference' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'non-vegetarian', label: 'Non-Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'eggetarian', label: 'Eggetarian' },
];

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
  { value: 'light', label: 'Light', desc: '1–2 days a week' },
  { value: 'moderate', label: 'Moderate', desc: '3–4 days a week' },
  { value: 'active', label: 'Active', desc: '5–6 days a week' },
  { value: 'very-active', label: 'Very Active', desc: 'Daily intense exercise' },
];

function OnboardingForm({ onComplete }) {
  const [data, setData] = useState({
    name: '',
    age: '',
    gender: 'prefer-not-to-say',
    height: '',
    weight: '',
    goal: '',
    diet: 'no-preference',
    activity: 'moderate',
    restrictions: '',
  });

  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const update = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const blur = (key) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  // ============================================================
  // Validation
  // ============================================================
  const errors = {};

  if (!data.name.trim()) errors.name = 'Name is required.';
  else if (data.name.trim().length < 2) errors.name = 'Too short.';

  if (!data.age) errors.age = 'Age is required.';
  else if (Number(data.age) < 13 || Number(data.age) > 100)
    errors.age = 'Enter 13–100.';

  if (!data.height) errors.height = 'Height is required.';
  else if (Number(data.height) < 100 || Number(data.height) > 250)
    errors.height = 'Enter 100–250 cm.';

  if (!data.weight) errors.weight = 'Weight is required.';
  else if (Number(data.weight) < 30 || Number(data.weight) > 300)
    errors.weight = 'Enter 30–300 kg.';

  if (!data.goal) errors.goal = 'Pick a goal.';

  const showError = (key) =>
    (touched[key] || submitAttempted) && errors[key];

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (!isValid) {
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    onComplete(data);
  };

  return (
    <div id="onboarding-root" className="onboarding-root fade-in">
      <div className="onboarding-header">
        <h1 className="onboarding-title">Let's build your plan.</h1>
        <p className="onboarding-subtitle">
          Fill in your details. Takes about 60 seconds.
        </p>
      </div>

      {/* ===== Identity ===== */}
      <section className="onboarding-section">
        <div className="section-head">
          <span className="section-icon"><FiUser size={16} /></span>
          <h2 className="section-title">About you</h2>
        </div>

        <div className="field-row">
          <div id="field-name" className="field field-grow">
            <label className="field-label" htmlFor="input-name">Name</label>
            <input
              id="input-name"
              type="text"
              value={data.name}
              onChange={(e) => update('name', e.target.value)}
              onBlur={() => blur('name')}
              placeholder="Your name"
              autoComplete="name"
            />
            {showError('name') && (
              <p className="field-error">{errors.name}</p>
            )}
          </div>

          <div id="field-age" className="field field-narrow">
            <label className="field-label" htmlFor="input-age">Age</label>
            <input
              id="input-age"
              type="number"
              inputMode="numeric"
              value={data.age}
              onChange={(e) => update('age', e.target.value)}
              onBlur={() => blur('age')}
              placeholder="24"
              min="13"
              max="100"
            />
            {showError('age') && (
              <p className="field-error">{errors.age}</p>
            )}
          </div>
        </div>

        <div className="field">
          <label className="field-label">Gender</label>
          <div className="chip-row">
            {[
              { v: 'male', l: 'Male' },
              { v: 'female', l: 'Female' },
              { v: 'other', l: 'Other' },
              { v: 'prefer-not-to-say', l: 'Prefer not to say' },
            ].map((opt) => (
              <button
                key={opt.v}
                type="button"
                className={`chip ${data.gender === opt.v ? 'chip-active' : ''}`}
                onClick={() => update('gender', opt.v)}
              >
                {opt.l}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Body ===== */}
      <section className="onboarding-section">
        <div className="section-head">
          <span className="section-icon"><FiActivity size={16} /></span>
          <h2 className="section-title">Your body</h2>
        </div>

        <div className="field-row">
          <div id="field-height" className="field field-grow">
            <label className="field-label" htmlFor="input-height">Height (cm)</label>
            <input
              id="input-height"
              type="number"
              inputMode="decimal"
              value={data.height}
              onChange={(e) => update('height', e.target.value)}
              onBlur={() => blur('height')}
              placeholder="175"
              min="100"
              max="250"
            />
            {showError('height') && (
              <p className="field-error">{errors.height}</p>
            )}
          </div>

          <div id="field-weight" className="field field-grow">
            <label className="field-label" htmlFor="input-weight">Weight (kg)</label>
            <input
              id="input-weight"
              type="number"
              inputMode="decimal"
              value={data.weight}
              onChange={(e) => update('weight', e.target.value)}
              onBlur={() => blur('weight')}
              placeholder="68"
              min="30"
              max="300"
            />
            {showError('weight') && (
              <p className="field-error">{errors.weight}</p>
            )}
          </div>
        </div>
      </section>

      {/* ===== Goal ===== */}
      <section className="onboarding-section">
        <div className="section-head">
          <span className="section-icon"><FiTarget size={16} /></span>
          <h2 className="section-title">Your goal</h2>
        </div>

        <div id="field-goal" className="option-grid">
          {GOALS.map((g) => (
            <button
              key={g.value}
              type="button"
              className={`option-card ${
                data.goal === g.value ? 'option-card-active' : ''
              }`}
              onClick={() => {
                update('goal', g.value);
                setTouched((p) => ({ ...p, goal: true }));
              }}
            >
              <span className="option-card-title">{g.label}</span>
              <span className="option-card-desc">{g.desc}</span>
            </button>
          ))}
        </div>
        {showError('goal') && (
          <p className="field-error">{errors.goal}</p>
        )}
      </section>

      {/* ===== Lifestyle ===== */}
      <section className="onboarding-section">
        <div className="section-head">
          <span className="section-icon"><FiCoffee size={16} /></span>
          <h2 className="section-title">Diet & lifestyle</h2>
        </div>

        <div className="field">
          <label className="field-label">Diet preference</label>
          <div className="chip-row">
            {DIETS.map((d) => (
              <button
                key={d.value}
                type="button"
                className={`chip ${data.diet === d.value ? 'chip-active' : ''}`}
                onClick={() => update('diet', d.value)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <div className="section-head section-head-inline">
            <span className="section-icon"><FiZap size={16} /></span>
            <label className="field-label">Activity level</label>
          </div>
          <div className="option-grid option-grid-compact">
            {ACTIVITY_LEVELS.map((a) => (
              <button
                key={a.value}
                type="button"
                className={`option-card option-card-compact ${
                  data.activity === a.value ? 'option-card-active' : ''
                }`}
                onClick={() => update('activity', a.value)}
              >
                <span className="option-card-title">{a.label}</span>
                <span className="option-card-desc">{a.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Optional ===== */}
      <section className="onboarding-section">
        <div className="section-head">
          <span className="section-icon"><FiAlertCircle size={16} /></span>
          <h2 className="section-title">Anything else?</h2>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="input-restrictions">
            Restrictions or preferences <span className="field-optional">(optional)</span>
          </label>
          <textarea
            id="input-restrictions"
            rows="3"
            value={data.restrictions}
            onChange={(e) => update('restrictions', e.target.value)}
            placeholder="e.g. Lactose intolerant, no dairy. Left knee injury — avoid heavy squats."
          />
        </div>
      </section>

      {/* ===== Submit ===== */}
      <div className="onboarding-submit-wrap">
        <button
          id="onboarding-submit"
          className="onboarding-cta"
          onClick={handleSubmit}
          type="button"
        >
          <span>Generate My Plan</span>
          <FiArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default OnboardingForm;