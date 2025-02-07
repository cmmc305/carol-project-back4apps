// server.js

const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Configuração da API do OpenAI usando a chave de ambiente
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Sua chave deve estar definida no arquivo .env
});
const openai = new OpenAIApi(configuration);

// Endpoint para análise do PDF utilizando ChatGPT
app.post('/api/analyze-pdf', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Texto não fornecido." });
    }

    // Crie o prompt que será enviado ao ChatGPT
    const prompt = `Analise o seguinte texto extraído de um PDF de transações bancárias e identifique se existem padrões financeiros relevantes conforme a tabela abaixo:

Tabela de Padrões:
American Express: AMEX EPAYMENT, Amex, 2005032111
PayPal: VENMO, PAYPAL, 7264681992
Intuit Payment Systems: 9215986202, Intuit, 0000756346
Chase Paymentech: Paymentech, 1020401225
Stripe: Stripe, ST-, Brightwheel, Doordash, Uber, Uber eats
Bill.com: Bill.com, Divvypay, invoice2go
Mollie Payments: ID:OL90691-0001, Mollie Payments
Paya: Company ID: 3383693141
Payliance: Company ID: 1273846756
ACHQ: Company ID: 1464699697 and 1112999721
AMAZON: 1541507947, 3383693141, 1383693141, 2383693141

Analise o texto abaixo, indicando as páginas e os padrões financeiros encontrados. Se nenhum padrão relevante for identificado, responda que não foi encontrado nenhum padrão relevante.

Texto:
${text}

Forneça a resposta em português.`;

    // Chamada à API do OpenAI
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // ou "gpt-4" se disponível
      messages: [
        { role: "system", content: "Você é um assistente que analisa textos de PDF e extrai padrões financeiros." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
    });

    const analysis = completion.data.choices[0].message.content;
    res.json({ analysis });
  } catch (error) {
    console.error("Erro ao analisar PDF:", error);
    res.status(500).json({ error: "Erro ao analisar o PDF." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
