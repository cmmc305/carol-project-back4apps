// server.js

const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/analyze-pdf', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Texto não fornecido." });
    }

    // Crie o prompt com instruções para retornar JSON com a estrutura desejada.
    const prompt = `Você é um assistente especializado em análise de documentos financeiros. 
Analise o seguinte texto extraído de um PDF de transações bancárias e identifique os padrões financeiros relevantes, 
segundo a tabela abaixo:

Tabela de Padrões:
{
  "American Express": ["AMEX EPAYMENT", "Amex", "2005032111"],
  "PayPal": ["VENMO", "PAYPAL", "7264681992"],
  "Intuit Payment Systems": ["9215986202", "Intuit", "0000756346"],
  "Chase Paymentech": ["Paymentech", "1020401225"],
  "Stripe": ["Stripe", "ST-", "Brightwheel", "Doordash", "Uber", "Uber eats"],
  "Bill.com": ["Bill.com", "Divvypay", "invoice2go"],
  "Mollie Payments": ["ID:OL90691-0001", "Mollie Payments"],
  "Paya": ["Company ID: 3383693141"],
  "Payliance": ["Company ID: 1273846756"],
  "ACHQ": ["Company ID: 1464699697", "1112999721"],
  "AMAZON": ["1541507947", "3383693141", "1383693141", "2383693141"]
}

Leia o texto abaixo e retorne a resposta no formato JSON com a seguinte estrutura:
{
  "pages": [
    { "page": <número da página>, "patterns": [<lista de padrões encontrados>] },
    ...
  ]
}
Caso nenhum padrão seja encontrado, retorne: { "pages": [] }.

Texto:
${text}

Forneça a resposta apenas em JSON.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // ou "gpt-4"
      messages: [
        { role: "system", content: "Você é um assistente que analisa textos de PDF e extrai padrões financeiros." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
    });

    // Tenta extrair o JSON da resposta
    const responseText = completion.data.choices[0].message.content;
    let analysisJson;
    try {
      analysisJson = JSON.parse(responseText);
    } catch (parseError) {
      // Se a resposta não estiver em formato JSON válido, retorne o texto bruto como fallback
      analysisJson = { error: "A resposta da API não está em formato JSON válido.", raw: responseText };
    }

    res.json(analysisJson);
  } catch (error) {
    console.error("Erro ao analisar PDF:", error);
    res.status(500).json({ error: "Erro ao analisar o PDF." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
