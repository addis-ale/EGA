import axios from "axios";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Safety check
    if (!message) {
      return new Response(
        JSON.stringify({ success: false, error: "No message provided" }),
        { status: 400 }
      );
    }

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !CHAT_ID) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing credentials" }),
        { status: 500 }
      );
    }

    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "Markdown", // or "HTML" if you're formatting that way
      }
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      console.error("Telegram Error:", err.message);
      return new Response(
        JSON.stringify({ success: false, error: err.message }),
        { status: 500 }
      );
    } else {
      console.error("Telegram Error:", err);
      return new Response(
        JSON.stringify({ success: false, error: "An unknown error occurred" }),
        { status: 500 }
      );
    }
  }
}
