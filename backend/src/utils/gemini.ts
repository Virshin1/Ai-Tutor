import axios from 'axios';

export async function generateLessonPlanGroq(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const requestBody = {
    model: 'llama3-70b-8192',
    messages: [
      { role: 'system', content: 'You are a helpful lesson plan generator.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 1024,
    temperature: 0.7,
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.choices?.[0]?.message?.content || 'No response from Groq.';
  } catch (error: any) {
    console.error('Groq API error:', error?.response?.data || error.message);
    throw new Error('Groq API request failed');
  }
}

export async function generateRubricGroq(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const requestBody = {
    model: 'llama3-70b-8192',
    messages: [
      { role: 'system', content: 'You are a helpful grading rubric generator.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 1024,
    temperature: 0.7,
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.choices?.[0]?.message?.content || 'No response from Groq.';
  } catch (error: any) {
    console.error('Groq API error:', error?.response?.data || error.message);
    throw new Error('Groq API request failed');
  }
}

export async function generateIEPGroq(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const requestBody = {
    model: 'llama3-70b-8192',
    messages: [
      { role: 'system', content: 'You are a helpful IEP (Individualized Education Program) generator.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 1024,
    temperature: 0.7,
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.choices?.[0]?.message?.content || 'No response from Groq.';
  } catch (error: any) {
    console.error('Groq API error:', error?.response?.data || error.message);
    throw new Error('Groq API request failed');
  }
}

export async function generateExitTicketGroq(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const requestBody = {
    model: 'llama3-70b-8192',
    messages: [
      { role: 'system', content: 'You are a helpful exit ticket generator for teachers.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 1024,
    temperature: 0.7,
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.choices?.[0]?.message?.content || 'No response from Groq.';
  } catch (error: any) {
    console.error('Groq API error:', error?.response?.data || error.message);
    throw new Error('Groq API request failed');
  }
}

export async function generateReportCommentGroq(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const requestBody = {
    model: 'llama3-70b-8192',
    messages: [
      { role: 'system', content: 'You are a helpful progress report comment generator for teachers.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 1024,
    temperature: 0.7,
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.choices?.[0]?.message?.content || 'No response from Groq.';
  } catch (error: any) {
    console.error('Groq API error:', error?.response?.data || error.message);
    throw new Error('Groq API request failed');
  }
}

export async function generateAssignmentsGroq(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const requestBody = {
    model: 'llama3-70b-8192',
    messages: [
      { role: 'system', content: 'You are a helpful assignment recommender for teachers.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 1024,
    temperature: 0.7,
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.choices?.[0]?.message?.content || 'No response from Groq.';
  } catch (error: any) {
    console.error('Groq API error:', error?.response?.data || error.message);
    throw new Error('Groq API request failed');
  }
}

export async function generateDirectionsGroq(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const requestBody = {
    model: 'llama3-70b-8192',
    messages: [
      { role: 'system', content: 'You are a helpful classroom directions generator for teachers.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 1024,
    temperature: 0.7,
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.choices?.[0]?.message?.content || 'No response from Groq.';
  } catch (error: any) {
    console.error('Groq API error:', error?.response?.data || error.message);
    throw new Error('Groq API request failed');
  }
} 