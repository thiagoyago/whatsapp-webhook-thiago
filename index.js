import express from "express";
import bodyParser from "body-parser";

const app = express().use(bodyParser.json());
const PORT = process.env.PORT || 3000;

// TOKEN DE VERIFICAÇÃO (use o mesmo que vai colocar no painel da Meta)
const VERIFY_TOKEN = "thiago123";

// ROTA DE VERIFICAÇÃO (para o Meta confirmar o webhook)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ROTA PRINCIPAL (para receber mensagens)
app.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object) {
    console.log("📩 Mensagem recebida:", JSON.stringify(body, null, 2));
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
