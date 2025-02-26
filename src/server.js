const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// ✅ Função para buscar padrões do Google Sheets
const fetchPatternsFromGoogleSheets = async () => {
  try {
    const response = await axios.get('https://opensheet.elk.sh/1wpnDIkr7A_RpM8sulHh2OcifbJD7zXol19dlmeJDmug/1');
    if (!response.data) throw new Error("No data returned from Google Sheets.");

    return response.data
      .filter(item => item.Name && item.Codes)
      .map(item => ({
        name: item.Name,
        codes: item.Codes.split(', ').map(code => code.trim())
      }));
  } catch (error) {
    console.error("Error fetching patterns from Google Sheets:", error);
    return [];
  }
};

// ✅ Rota para análise do PDF
app.post('/api/analyze-pdf', async (req, res) => {
  try {
    const { text, customPrompt } = req.body;
    if (!text || !customPrompt) {
      return res.status(400).json({ error: "Text and prompt are required." });
    }

    // 🔹 Obtém os padrões da planilha do Google Sheets
    const patterns = await fetchPatternsFromGoogleSheets();

    // 🔹 Encontra padrões no texto do PDF
    let results = text.split('\f').map((pageText, index) => {
      let foundPatterns = [];

      patterns.forEach(pattern => {
        const matches = pattern.codes.filter(code => pageText.includes(code));
        if (matches.length > 0) {
          foundPatterns.push({ name: pattern.name, matchedCodes: matches });
        }
      });

      return { page: index + 1, patterns: foundPatterns };
    });

    // 🔹 Usa o prompt do usuário na requisição ao ChatGPT
    const userPrompt = `${customPrompt}

### Extracted PDF Text:
${text}

### Matched Patterns:
${JSON.stringify(results, null, 2)}

Generate a structured summary highlighting key insights. Return the response in English.`

    // 🔹 Envia para o ChatGPT
    const completion = await openai.createChatCompletion({
      model: "gpt-4", // ou "gpt-3.5-turbo"
      messages: [
        { role: "system", content: "You analyze PDF texts and extract financial patterns." },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 700,
    });

    // 🔹 Formata a resposta da IA
    const responseText = completion.data.choices[0].message.content;

    res.json({
      patternsFound: results,
      aiAnalysis: responseText
    });

  } catch (error) {
    console.error("Error analyzing PDF:", error);
    res.status(500).json({ error: "Error analyzing the PDF." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
