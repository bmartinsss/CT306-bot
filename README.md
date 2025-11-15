# BOT CT 306 – WhatsApp Cloud API

## Como configurar:

### 1. Crie variáveis de ambiente no Render:
- `WHATSAPP_TOKEN` → seu token permanente
- `WHATSAPP_PHONE_ID` → seu Phone Number ID

### 2. Deploy no Render:
- Crie Web Service → conecte ao GitHub
- Build: automático
- Start command: `npm start`

### 3. Configure o webhook na Meta:
Use a URL:
`https://seu-bot.onrender.com/webhook`

### 4. O bot responderá:
- AUTOMATICAMENTE fora do horário comercial
- AUTOMATICAMENTE dentro do horário, com lógica simples
