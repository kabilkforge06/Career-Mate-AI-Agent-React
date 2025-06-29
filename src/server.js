const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/llama', async (req, res) => {
  const { prompt } = req.body;

  // Structured system prompt for Markdown formatting
  const formattedPrompt = `
You are a helpful career assistant chatbot. Format your answers using Markdown:
- Use bullet points when listing things
- Use **bold** for emphasis
- Use [text](https://example.com) for helpful links
Keep it short, clear, and easy to read.

User: ${prompt}
`;

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama3',
      prompt: formattedPrompt,
      stream: false
    });

    const generated = response.data.response;
    res.json({ response: generated });
  } catch (error) {
    console.error('Ollama error:', error);
    res.status(500).json({ error: 'Failed to get response from LLaMA' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
