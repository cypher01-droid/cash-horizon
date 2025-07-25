import axios from 'axios';

const GROQ_API_KEY = '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';

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
          content: 'You are a smart financial assistant helping a user manage their banking information.'
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
