import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express().use(bodyParser.json());
const PORT = process.env.PORT || 3000;

// Pegando valores das variáveis de ambiente (defina no Render)
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "thiago123";
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || "";       // <-- não deixar em branco no Render
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || ""; // <-- não deixar em branco no Render

// Rota de verificação (usada pela Meta)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado com sucesso!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Rota principal para mensagens recebidas
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object) {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message) {
      const from = message.from; // número do cliente
      const text = message.text?.body || "Mensagem sem texto";

      console.log("📩 Mensagem recebida de:", from, "→", text);

      // Envia resposta automática (texto simples)
      if (!ACCESS_TOKEN || !PHONE_NUMBER_ID) {
        console.error("⚠️ ACCESS_TOKEN ou PHONE_NUMBER_ID não configurados nas variáveis de ambiente.");
      } else {
        try {
          const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
          const payload = {
            messaging_product: "whatsapp",
            to: from,
            text: { body: "Olá 👋! Sou o assistente do Armazém, recebi sua mensagem e em breve entraremos em contato." }
          };

          const resp = await fetch(url, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${ACCESS_TOKEN}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });

          const data = await resp.json();
          console.log("Resposta da API do WhatsApp:", data);
        } catch (error) {
          console.error("Erro ao enviar mensagem via API:", error);
        }
      }
    }

    return res.sendStatus(200);
  }

  return res.sendStatus(404);
});

// Endpoint de teste
app.get("/teste", (req, res) => {
  res.send("🚀 O servidor está rodando corretamente!");
});

// Inicializa o servidor
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
