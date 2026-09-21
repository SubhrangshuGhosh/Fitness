import { useState } from 'react';
import { FiRefreshCw, FiDownload, FiPlus, FiCheck } from 'react-icons/fi';
import DietCard from '../DietCard/DietCard';
import WorkoutCard from '../WorkoutCard/WorkoutCard';
import { downloadPlanPDF } from '../../utils/pdfGenerator';
import './PlanDisplay.css';

function PlanDisplay({
  plan,
  userData,
  onRegenerate,
  onNewPlan,
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [justDownloaded, setJustDownloaded] = useState(false);

  if (!plan) return null;

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      downloadPlanPDF(plan, userData);
      setJustDownloaded(true);
      setTimeout(() => setJustDownloaded(false), 2500);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Could not generate the PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div id="plandisplay-root" className="plandisplay-root fade-in">
      {/* Hero greeting */}
      <div className="plandisplay-hero">
        <div className="plandisplay-hero-inner">
          <p className="plandisplay-hero-label">Your personalized plan</p>
          <h1 className="plandisplay-greeting">
            Hey {userData?.name || 'there'},
          </h1>
          {plan.summary && (
            <p className="plandisplay-summary">{plan.summary}</p>
          )}
        </div>
      </div>

      <DietCard diet={plan.diet} />

      <WorkoutCard workout={plan.workout} />

      {plan.tips && plan.tips.length > 0 && (
        <div id="plandisplay-tips" className="plandisplay-tips">
          <h2 className="plandisplay-tips-title">Notes & Tips</h2>
          <ul className="plandisplay-tips-list">
            {plan.tips.map((tip, i) => (
              <li key={i} className="plandisplay-tip">
                <span className="plandisplay-tip-bullet" aria-hidden="true" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="plandisplay-actions">
        <button
          type="button"
          className="plandisplay-action plandisplay-action-secondary"
          onClick={onRegenerate}
          title="Generate a new version of this plan"
        >
          <FiRefreshCw size={16} />
          <span>Regenerate</span>
        </button>

        <button
          type="button"
          className="plandisplay-action plandisplay-action-primary"
          onClick={handleDownload}
          disabled={isDownloading}
          title="Download this plan as a PDF"
        >
          {justDownloaded ? <FiCheck size={16} /> : <FiDownload size={16} />}
          <span>
            {isDownloading
              ? 'Preparing…'
              : justDownloaded
              ? 'Downloaded'
              : 'Download Plan'}
          </span>
        </button>

        <button
          type="button"
          className="plandisplay-action plandisplay-action-secondary"
          onClick={onNewPlan}
          title="Start a fresh plan"
        >
          <FiPlus size={16} />
          <span>New Plan</span>
        </button>
      </div>
    </div>
  );
}

export default PlanDisplay;