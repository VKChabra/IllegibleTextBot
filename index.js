import { check_if_word_exists } from "./checkWord.js";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();
const token = process.env.TOKEN;
const vocApi = process.env.VOCAB_API;
const bot = new TelegramBot(token, { polling: true });

const RegExpMsg = /^\d*[a-zA-Z][a-zA-Z0-9 {[}\];:"'<,>.?/]*$/;
const RegExpNum = /[0-9]/;

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Welcome! I'll translate illegible text for you"
  );
});

bot.on("message", (msg) => {
  const hi = "hi";
  if (msg.text.toString().toLowerCase().indexOf(hi) === 0) {
    bot.sendMessage(msg.chat.id, "Hello dear user");
  }
});

bot.on("message", async (msg) => {
  const userMsg = msg.text.toString().toLowerCase();
  if (RegExpMsg.test(userMsg)) {
    if (await check_if_word_exists(userMsg.split(" ")[0], vocApi)) {
      return;
    } else {
      userMsg.split(" ").forEach((word, index) => {
        console.log(`${word} at ${index}`);
      });
    }
  } else {
    return;
  }
});
