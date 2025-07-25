import axios from 'axios';

// Load GROQ API key from .env file
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

const groqClient = axios.create({
  baseURL: 'https://api.groq.com/openai/v1/chat/completions',
  headers: {
    'Authorization': `Bearer ${GROQ_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export const askGROQ = async (message) => {
  try {
    const response = await groqClient.post('', {
      model: 'mixtral-8x7b-32768',
      messages: [
        {
          role: 'system',
          content: 'Tu es un assistant financier intelligent qui aide les utilisateurs à gérer leurs finances.'
        },
        {
          role: 'user',
          content: message
        }
      ]
    });

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error('GROQ API error:', err);
    return 'Une erreur est survenue. Veuillez réessayer plus tard.';
  }
};
