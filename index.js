import { check_if_word_exists } from "./checkWord.js";
import { transliterate } from "./transilteration.js";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();
const token = process.env.TOKEN;
const vocApi = process.env.VOCAB_API;
const bot = new TelegramBot(token, { polling: true });

const RegExpMsg = /^\d*[a-zA-Z][a-zA-Z0-9 {[}\];:"'<,>.?/]*$/;

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Welcome! I'll translate illegible text for you"
  );
});

bot.on("message", async (msg) => {
  const userMsg = msg.text?.toString();
  if (!userMsg) return;
  // console.log(RegExpMsg.test(userMsg));
  if (RegExpMsg.test(userMsg.toLowerCase())) {
    // console.log("Only english letters");
    if (
      await check_if_word_exists(userMsg.toLowerCase().split(" ")[0], vocApi)
    ) {
      // console.log("word should be readable");
      return;
    } else bot.sendMessage(msg.chat.id, transliterate(userMsg));
  } else return;
});
