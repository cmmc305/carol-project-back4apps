const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// API para análise de texto extraído do PDF
app.post('/api/analyze-text', async (req, res) => {
  try {
    const { text, customPrompt } = req.body;
    
    if (!text || !customPrompt) {
      return res.status(400).json({ error: "Missing text or prompt for analysis." });
    }

    console.log("🔹 Sending request to OpenAI...");
    
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an AI specialized in document analysis. Identify relevant financial patterns from the extracted text." },
        { role: "user", content: `${customPrompt}\n\nExtracted Text:\n${text}` }
      ],
      max_tokens: 500,
    });

    console.log("✅ OpenAI Response:", completion.data);

    res.json({ aiAnalysis: completion.data.choices[0].message.content });

  } catch (error) {
    console.error("🚨 OpenAI API Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Error analyzing the document.", details: error.response ? error.response.data : error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
