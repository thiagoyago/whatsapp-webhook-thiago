import express from "express";
import bodyParser from "body-parser";

const app = express().use(bodyParser.json());
const PORT = process.env.PORT || 3000;

// Token de verificação (o mesmo configurado no Meta)
const VERIFY_TOKEN = "thiago123";

// Token de acesso (coloque o seu token temporário aqui)
const ACCESS_TOKEN = "COLE_SEU_TOKEN_AQUI";

// ✅ Rota de verificação (usada apenas pela Meta)
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

// ✅ Rota principal (mensagens recebidas)
app.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object) {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message) {
      const from = message.from; // número do cliente
      const text = message.text?.body || "Mensagem sem texto";

      console.log("📩 Mensagem recebida de:", from, "→", text);

      // Resposta automática
      fetch(`https://graph.facebook.com/v20.0/${process.env.PHONE_NUMBER_ID}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          text: { body: "Olá! 👋 Sou o assistente do Armazém, recebi sua mensagem!" },
        }),
      });
    }

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Iniciar servidor
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
const ACCESS_TOKEN = "EAAQ0QGJqDkcBP43diAQ5nn76jvnKSNBaxDS3BsTkcMLFpltfdOsUD2yB3o8ACWJ3IqZAZCBS6APneftQlHkzUl7RnPjgVOtZCLpQZCxFizHDcEz1WOKrOC5K51GvAk8Yaxm2S8aBPojR1p0tH1bt57O2IZBT58JZAsjMGtsSVSd3LVZC4dSvdshL84vtTnZCZAyLEZCnQU99slr1WvfeweKFuRTDrHfPGNLlQfeOouuhcFciDvassqBWZBxKI4vqkt0jhUaMAGAWKYdHVHpgCKomifzV9MeZB2XRoW6ua4zfegZDZD";
PHONE_NUMBER_ID 874881989035008

