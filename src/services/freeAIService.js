import axios from 'axios';

class FreeAIService {
  // Main method to generate workout plan
  async generateWorkoutPlan(userData) {
    console.log('🚀 Generating workout plan for:', userData.name);
    
    // Check which APIs are available
    this.checkApiAvailability();
    
    // Try your APIs in order of preference
    if (process.env.REACT_APP_GROQ_TOKEN) {
      console.log('🔄 Trying Groq API...');
      try {
        const result = await this.generateWithGroq(userData);
        console.log('✅ Groq API successful!');
        return result;
      } catch (error) {
        console.error('❌ Groq API failed:', error.message);
        throw new Error(`Groq API failed: ${error.message}`);
      }
    }
    
    if (process.env.REACT_APP_HUGGINGFACE_TOKEN) {
      console.log('🔄 Trying Hugging Face API...');
      try {
        const result = await this.generateWithHuggingFace(userData);
        console.log('✅ Hugging Face API successful!');
        return result;
      } catch (error) {
        console.error('❌ Hugging Face API failed:', error.message);
        throw new Error(`Hugging Face API failed: ${error.message}`);
      }
    }
    
    if (process.env.REACT_APP_OPENROUTER_TOKEN) {
      console.log('🔄 Trying OpenRouter API...');
      try {
        const result = await this.generateWithOpenRouter(userData);
        console.log('✅ OpenRouter API successful!');
        return result;
      } catch (error) {
        console.error('❌ OpenRouter API failed:', error.message);
        throw new Error(`OpenRouter API failed: ${error.message}`);
      }
    }
    
    // No APIs available
    throw new Error('No AI APIs configured. Please add API keys to .env file');
  }

  // Main method to generate diet plan
  async generateDietPlan(userData) {
    console.log('🍽️ Generating diet plan for:', userData.name);
    
    if (process.env.REACT_APP_GROQ_TOKEN) {
      try {
        return await this.generateDietWithGroq(userData);
      } catch (error) {
        throw new Error(`Diet API failed: ${error.message}`);
      }
    }
    
    throw new Error('No AI APIs configured for diet plans');
  }

  // Generate motivational quote
  async generateMotivationalQuote() {
    const quotes = [
      "The only bad workout is the one that didn't happen! 💪",
      "Your body can stand almost anything. It's your mind you have to convince.",
      "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
      "Don't wish for it, work for it! 🚀",
      "The hardest lift of all is lifting your butt off the couch!",
      "Progress, not perfection. Every rep counts! 📈",
      "Your future self will thank you for the effort you put in today.",
      "The only time you should look back is to see how far you've come.",
      "Be stronger than your excuses. 💯",
      "Sweat is just fat crying! 😅"
    ];
    
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  // ==================== API INTEGRATIONS ====================

  // 1. GROQ API (Primary - Fastest) - UPDATED MODELS
  async generateWithGroq(userData) {
    const prompt = this.createWorkoutPrompt(userData);
    
    console.log('📝 Groq Prompt:', prompt.substring(0, 200) + '...');
    
    // Current Groq models (as of 2024)
    const availableModels = [
      "llama-3.1-8b-instant",    // Fast, efficient
      "llama-3.1-70b-versatile", // More powerful
      "mixtral-8x7b-32768",      // Good balance
      "gemma2-9b-it"             // Lightweight alternative
    ];
    
    const model = availableModels[0]; // Start with the first one
    
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: model,
          messages: [
            { 
              role: "system", 
              content: "You are an expert fitness coach. Always respond with valid JSON only. Create personalized workout plans." 
            },
            { role: "user", content: prompt }
          ],
          max_tokens: 1500,
          temperature: 0.7,
          response_format: { type: "json_object" }
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_GROQ_TOKEN}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );
      
      console.log('✅ Groq API successful with model:', model);
      
      const aiResponse = response.data.choices[0].message.content;
      return this.parseWorkoutResponse(aiResponse);
    } catch (error) {
      console.error(`❌ Groq API failed with model ${model}:`, error.response?.data);
      
      // If the first model fails, try the next one
      if (availableModels.length > 1) {
        console.log('🔄 Trying alternative model...');
        return await this.generateWithGroqFallback(userData, availableModels.slice(1));
      }
      
      throw new Error(`Groq API Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Fallback method to try alternative Groq models
  async generateWithGroqFallback(userData, remainingModels) {
    if (remainingModels.length === 0) {
      throw new Error('All Groq models failed');
    }
    
    const model = remainingModels[0];
    const prompt = this.createWorkoutPrompt(userData);
    
    console.log(`🔄 Trying fallback model: ${model}`);
    
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: model,
          messages: [
            { 
              role: "system", 
              content: "You are an expert fitness coach. Respond with valid JSON only." 
            },
            { role: "user", content: prompt }
          ],
          max_tokens: 1500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_GROQ_TOKEN}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );
      
      console.log(`✅ Groq fallback successful with model: ${model}`);
      const aiResponse = response.data.choices[0].message.content;
      return this.parseWorkoutResponse(aiResponse);
    } catch (error) {
      console.error(`❌ Groq fallback failed with model ${model}`);
      return await this.generateWithGroqFallback(userData, remainingModels.slice(1));
    }
  }

  // 2. Hugging Face API
  async generateWithHuggingFace(userData) {
    const prompt = this.createWorkoutPrompt(userData);
    
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
      { inputs: prompt },
      {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_HUGGINGFACE_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    return this.parseWorkoutResponse(response.data.generated_text);
  }

  // 3. OpenRouter API
  async generateWithOpenRouter(userData) {
    const prompt = this.createWorkoutPrompt(userData);
    
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "google/palm-2-chat-bison-32k",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENROUTER_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    return this.parseWorkoutResponse(response.data.choices[0].message.content);
  }

  // Diet Plan with Groq - UPDATED MODEL
  async generateDietWithGroq(userData) {
    const prompt = this.createDietPrompt(userData);
    
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: "llama-3.1-8b-instant",
          messages: [
            { 
              role: "system", 
              content: "You are a nutrition expert. Create personalized diet plans in valid JSON format." 
            },
            { role: "user", content: prompt }
          ],
          max_tokens: 1500,
          temperature: 0.7,
          response_format: { type: "json_object" }
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_GROQ_TOKEN}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );
      
      const aiResponse = response.data.choices[0].message.content;
      return this.parseDietResponse(aiResponse);
    } catch (error) {
      // Try fallback model for diet
      console.log('🔄 Trying fallback model for diet...');
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: "mixtral-8x7b-32768",
          messages: [
            { 
              role: "system", 
              content: "You are a nutrition expert. Create diet plans in JSON." 
            },
            { role: "user", content: prompt }
          ],
          max_tokens: 1500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_GROQ_TOKEN}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );
      
      const aiResponse = response.data.choices[0].message.content;
      return this.parseDietResponse(aiResponse);
    }
  }

  // ==================== PROMPT ENGINEERING ====================

  createWorkoutPrompt(userData) {
    return `Create a personalized workout plan as JSON for:

USER PROFILE:
- Name: ${userData.name}
- Age: ${userData.age}
- Gender: ${userData.gender}
- Height: ${userData.height}cm
- Weight: ${userData.weight}kg
- Fitness Goal: ${userData.fitnessGoal}
- Fitness Level: ${userData.fitnessLevel}
- Workout Location: ${userData.workoutLocation}

REQUIRED JSON STRUCTURE:
{
  "title": "Workout Plan Title",
  "description": "Brief description",
  "duration": "4-6 weeks",
  "weeklySchedule": [
    {
      "day": "Monday",
      "focus": "Workout focus",
      "exercises": [
        {
          "name": "Exercise name",
          "sets": "3",
          "reps": "10-12",
          "rest": "60s",
          "tips": "Form tips"
        }
      ]
    }
  ],
  "tips": ["Tip 1", "Tip 2"],
  "motivation": "Motivational message"
}

Create a practical plan for a ${userData.fitnessLevel} using ${userData.workoutLocation} equipment.`;
  }

  createDietPrompt(userData) {
    return `Create a personalized diet plan as JSON for:

USER PROFILE:
- Name: ${userData.name}
- Age: ${userData.age}
- Gender: ${userData.gender}
- Height: ${userData.height}cm  
- Weight: ${userData.weight}kg
- Fitness Goal: ${userData.fitnessGoal}
- Dietary Preference: ${userData.dietaryPreferences}

REQUIRED JSON STRUCTURE:
{
  "title": "Diet Plan Title",
  "description": "Personalized description",
  "dailyCalories": 2000,
  "meals": {
    "breakfast": "Meal description with portions",
    "lunch": "Meal description with portions",
    "dinner": "Meal description with portions", 
    "snacks": "2-3 healthy snack options"
  },
  "hydration": "Water intake recommendation",
  "nutritionTips": ["Nutrition tip 1", "Tip 2", "Tip 3"],
  "shoppingList": ["Food item 1", "Item 2", "Item 3"]
}

Focus on ${userData.dietaryPreferences} diet for ${userData.fitnessGoal} goals.`;
  }

  // ==================== RESPONSE PARSING ====================

  parseWorkoutResponse(aiText) {
    try {
      // Try to extract JSON from response
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }
      
      const plan = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      if (!plan.title || !plan.weeklySchedule) {
        throw new Error('Invalid workout plan structure from AI');
      }
      
      return plan;
    } catch (error) {
      console.error('Failed to parse workout response:', error);
      throw new Error(`AI response parsing failed: ${error.message}`);
    }
  }

  parseDietResponse(aiText) {
    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }
      
      const plan = JSON.parse(jsonMatch[0]);
      
      if (!plan.title || !plan.meals) {
        throw new Error('Invalid diet plan structure from AI');
      }
      
      return plan;
    } catch (error) {
      console.error('Failed to parse diet response:', error);
      throw new Error(`AI response parsing failed: ${error.message}`);
    }
  }

  // ==================== UTILITY METHODS ====================

  checkApiAvailability() {
    console.log('🔍 Checking API Availability:');
    console.log('   Groq:', process.env.REACT_APP_GROQ_TOKEN ? '✅ Configured' : '❌ Not configured');
    console.log('   Hugging Face:', process.env.REACT_APP_HUGGINGFACE_TOKEN ? '✅ Configured' : '❌ Not configured');
    console.log('   OpenRouter:', process.env.REACT_APP_OPENROUTER_TOKEN ? '✅ Configured' : '❌ Not configured');
    
    const availableAPIs = [
      process.env.REACT_APP_GROQ_TOKEN && 'Groq',
      process.env.REACT_APP_HUGGINGFACE_TOKEN && 'Hugging Face', 
      process.env.REACT_APP_OPENROUTER_TOKEN && 'OpenRouter'
    ].filter(Boolean);
    
    console.log('   Available APIs:', availableAPIs.join(', ') || 'None');
    
    if (availableAPIs.length === 0) {
      console.warn('⚠️  No APIs configured! Add keys to .env file');
    }
  }
}

// Create and export a singleton instance
const freeAIServiceInstance = new FreeAIService();
export { freeAIServiceInstance as FreeAIService };
export default freeAIServiceInstance;