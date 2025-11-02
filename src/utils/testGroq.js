import axios from 'axios';

export const testGroqAPI = async () => {
  const apiKey = process.env.REACT_APP_GROQ_TOKEN;
  
  if (!apiKey) {
    console.error('❌ No Groq API key found in environment variables');
    return false;
  }

  console.log('🔑 API Key found (first 10 chars):', apiKey.substring(0, 10) + '...');
  
  // Test with current models
  const testModels = [
    "llama-3.1-8b-instant",
    "llama-3.1-70b-versatile", 
    "mixtral-8x7b-32768",
    "gemma2-9b-it"
  ];
  
  for (const model of testModels) {
    try {
      console.log(`🧪 Testing model: ${model}`);
      
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: model,
          messages: [{ role: "user", content: "Say 'Hello World!'" }],
          max_tokens: 10
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(`✅ ${model} working! Response:`, response.data.choices[0].message.content);
      return true;
    } catch (error) {
      console.log(`❌ ${model} failed:`, error.response?.data?.error?.message);
    }
  }
  
  console.error('❌ All Groq models failed');
  return false;
};