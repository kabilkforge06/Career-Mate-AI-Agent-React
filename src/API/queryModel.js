import axios from 'axios';

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'llama3'; 

export async function queryModel(prompt) {
  try {
    
    const response = await axios.post(OLLAMA_URL, {
      model: MODEL_NAME,
      prompt: prompt,
      stream: false
    });
    return response.data.response.trim();
  } catch (error) {
    console.error("Error querying model:", error);
    return "⚠️ Error connecting to AI.";
  }
  
}
