import { FiActivity } from 'react-icons/fi';
import './WorkoutCard.css';

function WorkoutCard({ workout }) {
  if (!workout) return null;

  const { split, days } = workout;

  return (
    <div id="workoutcard-root" className="workoutcard-root">
      <div className="workoutcard-header">
        <span className="workoutcard-icon">
          <FiActivity size={18} />
        </span>
        <h2 className="workoutcard-title">Workout Plan</h2>
      </div>

      {split && (
        <p className="workoutcard-split">{split}</p>
      )}

      {days && days.length > 0 && (
        <div className="workoutcard-days">
          {days.map((day, i) => (
            <div key={i} className="workoutcard-day">
              <div className="workoutcard-day-head">
                <span className="workoutcard-day-name">{day.day}</span>
                <span className="workoutcard-day-focus">{day.focus}</span>
              </div>

              {day.exercises && day.exercises.length > 0 && (
                <ul className="workoutcard-exercises">
                  {day.exercises.map((ex, j) => (
                    <li key={j} className="workoutcard-exercise">
                      <span className="workoutcard-exercise-name">
                        {ex.name}
                      </span>
                      <span className="workoutcard-exercise-meta tabular-nums">
                        {ex.sets} × {ex.reps}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkoutCard;