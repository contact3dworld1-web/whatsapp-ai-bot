import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Bot actiu 🚀");
});

app.post("/whatsapp", (req, res) => {
  const msg = req.body.Body;

  const reply = `
    <Response>
      <Message>He rebut: ${msg}</Message>
    </Response>
  `;

  res.type("text/xml");
  res.send(reply);
});

app.listen(3000, () => {
  console.log("Servidor funcionant");
});
