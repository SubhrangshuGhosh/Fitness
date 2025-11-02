export class LocalStorageService {
  static STORAGE_KEYS = {
    WORKOUT_PLANS: 'fitness_app_workout_plans',
    DIET_PLANS: 'fitness_app_diet_plans',
    USER_DATA: 'fitness_app_user_data'
  };

  // Workout Plans
  static saveWorkoutPlan(plan, userData) {
    const plans = this.getWorkoutPlans();
    const planWithMetadata = {
      ...plan,
      id: this.generateId(),
      userData: userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    plans.unshift(planWithMetadata); // Add to beginning
    // Keep only last 10 plans
    const limitedPlans = plans.slice(0, 10);
    
    try {
      localStorage.setItem(this.STORAGE_KEYS.WORKOUT_PLANS, JSON.stringify(limitedPlans));
      return planWithMetadata;
    } catch (error) {
      console.error('Failed to save workout plan:', error);
      throw new Error('Failed to save plan to local storage');
    }
  }

  static getWorkoutPlans() {
    try {
      const plans = localStorage.getItem(this.STORAGE_KEYS.WORKOUT_PLANS);
      return plans ? JSON.parse(plans) : [];
    } catch (error) {
      console.error('Failed to get workout plans:', error);
      return [];
    }
  }

  static getWorkoutPlan(id) {
    const plans = this.getWorkoutPlans();
    return plans.find(plan => plan.id === id);
  }

  static deleteWorkoutPlan(id) {
    const plans = this.getWorkoutPlans();
    const filteredPlans = plans.filter(plan => plan.id !== id);
    
    try {
      localStorage.setItem(this.STORAGE_KEYS.WORKOUT_PLANS, JSON.stringify(filteredPlans));
      return true;
    } catch (error) {
      console.error('Failed to delete workout plan:', error);
      return false;
    }
  }

  // Diet Plans
  static saveDietPlan(plan, userData) {
    const plans = this.getDietPlans();
    const planWithMetadata = {
      ...plan,
      id: this.generateId(),
      userData: userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    plans.unshift(planWithMetadata);
    const limitedPlans = plans.slice(0, 10);
    
    try {
      localStorage.setItem(this.STORAGE_KEYS.DIET_PLANS, JSON.stringify(limitedPlans));
      return planWithMetadata;
    } catch (error) {
      console.error('Failed to save diet plan:', error);
      throw new Error('Failed to save plan to local storage');
    }
  }

  static getDietPlans() {
    try {
      const plans = localStorage.getItem(this.STORAGE_KEYS.DIET_PLANS);
      return plans ? JSON.parse(plans) : [];
    } catch (error) {
      console.error('Failed to get diet plans:', error);
      return [];
    }
  }

  // User Data
  static saveUserData(userData) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Failed to save user data:', error);
      return false;
    }
  }

  static getUserData() {
    try {
      const userData = localStorage.getItem(this.STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  }

  // Utility Methods
  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static clearAllData() {
    try {
      localStorage.removeItem(this.STORAGE_KEYS.WORKOUT_PLANS);
      localStorage.removeItem(this.STORAGE_KEYS.DIET_PLANS);
      localStorage.removeItem(this.STORAGE_KEYS.USER_DATA);
      return true;
    } catch (error) {
      console.error('Failed to clear data:', error);
      return false;
    }
  }

  static getStorageUsage() {
    let total = 0;
    for (const key in this.STORAGE_KEYS) {
      const value = localStorage.getItem(this.STORAGE_KEYS[key]);
      if (value) {
        total += value.length * 2; // Approximate size in bytes
      }
    }
    return total;
  }
}