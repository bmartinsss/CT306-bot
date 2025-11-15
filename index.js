import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Token e número lidos de variáveis de ambiente
const token = process.env.WHATSAPP_TOKEN;
const phone_number_id = process.env.WHATSAPP_PHONE_ID;

/* HORÁRIO COMERCIAL CT 306
   SEG–SEX: 5h30–13h e 15h–21h
   SÁBADO: 8h–11h
   DOMINGO: 9h–11h
*/

function foraDoHorario() {
    const agora = new Date();
    agora.setHours(agora.getHours() - 3); // ajustar para Brasília

    const h = agora.getHours();
    const m = agora.getMinutes();
    const d = agora.getDay(); // 0 = domingo

    const horaDecimal = h + m / 60;

    // Segunda a sexta
    if (d >= 1 && d <= 5) {
        const periodo1 = horaDecimal >= 5.5 && horaDecimal < 13;
        const periodo2 = horaDecimal >= 15 && horaDecimal < 21;

        if (periodo1 || periodo2) return false; // dentro do horário
        return true; // fora
    }

    // Sábado: 8h às 11h
    if (d === 6) {
        if (horaDecimal >= 8 && horaDecimal < 11) return false;
        return true;
    }

    // Domingo: 9h às 11h
    if (d === 0) {
        if (horaDecimal >= 9 && horaDecimal < 11) return false;
        return true;
    }

    return true;
}

function enviar(numero, texto) {
    axios.post(
        `https://graph.facebook.com/v18.0/${phone_number_id}/messages`,
        {
            messaging_product: "whatsapp",
            to: numero,
            text: { body: texto }
        },
        { headers: { Authorization: `Bearer ${token}` } }
    );
}

app.post("/webhook", (req, res) => {
    const msg = req.body.entry?.[0].changes?.[0].value.messages?.[0];

    if (!msg || msg.type !== "text") return res.sendStatus(200);

    const texto = msg.text.body.toLowerCase();
    const numero = msg.from;

    // BOT AUTOMÁTICO FORA DO HORÁRIO
    if (foraDoHorario()) {
        enviar(
            numero,
            "💚 Oi! Aqui é o CT 306!\n" +
            "Agora estamos fora do horário de atendimento, " +
            "mas já recebi tua mensagem com carinho.\n\n" +
            "Para agilizar quando estivermos de volta, me diga:\n" +
            "• planos\n• horários\n• aulas\n• avaliação\n• aula experimental\n\n💚"
        );
        return res.sendStatus(200);
    }

    // BOT AUTOMÁTICO DENTRO DO HORÁRIO
    if (texto.includes("plan")) enviar(numero, "💚 PLANOS CT 306...");
    else if (texto.includes("hor")) enviar(numero, "⏰ Horários CT 306...");
    else if (texto.includes("aula")) enviar(numero, "💪 Aulas CT 306...");
    else if (texto.includes("aval")) enviar(numero, "🩺 Avaliação CT 306...");
    else enviar(numero, "💚 Como posso te ajudar?");

    res.sendStatus(200);
});

app.listen(3000, () => console.log("BOT CT 306 rodando"));
