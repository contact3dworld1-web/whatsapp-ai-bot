import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const CLAUDE_API_KEY = "LA_TEVA_CLAU";

let userState = {}; // aquí guardes dades de cada usuari

app.post("/webhook", async (req, res) => {
  const msg = req.body.Body;
  const user = req.body.From;

  if (!userState[user]) {
    userState[user] = { step: 0, data: {} };
  }

  const state = userState[user];

  // 🟢 1. iniciar conversa
  if (msg.toLowerCase() === "hola") {
    state.step = 1;
    return sendWhatsApp(res, "Quantes persones sou?");
  }

  // 🟢 2. recopilar dades seqüencialment
  if (state.step === 1) {
    state.data.persones = msg;
    state.step++;
    return sendWhatsApp(res, "Quina edat té cada persona?");
  }

  if (state.step === 2) {
    state.data.edats = msg;
    state.step++;
    return sendWhatsApp(res, "Què us agrada a cada persona?");
  }

  if (state.step === 3) {
    state.data.gustos = msg;
    state.step++;
    return sendWhatsApp(res, "Quant temps teniu?");
  }

  if (state.step === 4) {
    state.data.temps = msg;
    state.step++;
    return sendWhatsApp(res, "Quantes activitats voleu fer?");
  }

  if (state.step === 5) {
    state.data.activitats = msg;
    state.step++;
    return sendWhatsApp(res, "On voleu fer-ho?");
  }

  if (state.step === 6) {
    state.data.zona = msg;
    state.step++;
    return sendWhatsApp(res, "Pressupost per persona?");
  }

  if (state.step === 7) {
    state.data.pressupost = msg;

    // 🔥 aquí crides Claude
    const plan = await generarPlaClaude(state.data);

    return sendWhatsApp(res, plan);
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor funcionant al port " + PORT);
});
