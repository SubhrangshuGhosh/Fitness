import { FiCoffee } from 'react-icons/fi';
import './DietCard.css';

function DietCard({ diet }) {
  if (!diet) return null;

  const { dailyCalories, macros, meals } = diet;

  return (
    <div id="dietcard-root" className="dietcard-root">
      <div className="dietcard-header">
        <span className="dietcard-icon">
          <FiCoffee size={18} />
        </span>
        <h2 className="dietcard-title">Diet Plan</h2>
      </div>

      {/* Calories hero pill */}
      {dailyCalories && (
        <div className="dietcard-calories-pill">
          <span className="dietcard-calories-value tabular-nums">
            {dailyCalories.toLocaleString()}
          </span>
          <span className="dietcard-calories-label">kcal per day</span>
        </div>
      )}

      {/* Macros */}
      {macros && (
        <div className="dietcard-macros">
          <MacroPill label="Protein" value={macros.protein} unit="g" />
          <MacroPill label="Carbs" value={macros.carbs} unit="g" />
          <MacroPill label="Fats" value={macros.fats} unit="g" />
        </div>
      )}

      {/* Meals */}
      {meals && meals.length > 0 && (
        <div className="dietcard-meals">
          {meals.map((meal, i) => (
            <div key={i} className="dietcard-meal">
              <div className="dietcard-meal-head">
                <span className="dietcard-meal-time">{meal.time}</span>
                {meal.calories && (
                  <span className="dietcard-meal-cal tabular-nums">
                    {meal.calories} kcal
                  </span>
                )}
              </div>
              <ul className="dietcard-meal-items">
                {meal.items?.map((item, j) => (
                  <li key={j} className="dietcard-meal-item">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MacroPill({ label, value, unit }) {
  if (value == null) return null;
  return (
    <div className="dietcard-macro">
      <span className="dietcard-macro-value tabular-nums">
        {value}
        <span className="dietcard-macro-unit">{unit}</span>
      </span>
      <span className="dietcard-macro-label">{label}</span>
    </div>
  );
}

export default DietCard;