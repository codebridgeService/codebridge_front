export async function sendTelegramMessage({ name, email, message }) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
  
    if (!botToken || !chatId) {
      throw new Error("Telegram bot token or chat ID not set");
    }
  
    const text = `📩 *New Contact Form Message*\n\n*Name:* ${name}\n*Email:* ${email}\n*Message:*\n${message}`;
  
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    });
  
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Telegram API error: ${errorText}`);
    }
  
    return res.json();
  }
  