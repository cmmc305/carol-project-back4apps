const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/analyze-pdf', async (req, res) => {
  try {
    const { text, customPrompt } = req.body;

    if (!text || !customPrompt) {
      return res.status(400).json({ error: "Missing text or prompt." });
    }

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an AI assistant that analyzes financial documents." },
        { role: "user", content: `${customPrompt}\n\nExtracted Text:\n${text}` }
      ],
      max_tokens: 1000,
    });

    const responseText = completion.data.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("Invalid response from OpenAI.");
    }

    res.json({ aiAnalysis: responseText });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    res.status(500).json({ error: "Failed to analyze text with AI." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
