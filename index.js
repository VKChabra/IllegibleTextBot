import { check_if_word_exists } from "./checkWord.js";
import { transliterate } from "./transilteration.js";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();
const token = process.env.TOKEN;
const vocApi = process.env.VOCAB_API;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Welcome! I'll translate illegible text for you"
  );
});

const RegExpMsg = /^\S[a-zA-Z0-9\s[.\]{[}\];:"'<,>.?&/()!@#$%^*-_]*$/;
const RegExpLink =
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
const RegExpTelegramLink = /\b(?:https?:\/\/)?t\.me\/[a-zA-Z0-9_]+/;
const RegExpNumber = /^[0-9,.-]+$/;

function isValidMsg(userMsg) {
  // should return true if msg is valid
  if (
    RegExpMsg.test(userMsg.toLowerCase()) &&
    !RegExpLink.test(userMsg.toLowerCase()) &&
    !RegExpTelegramLink.test(userMsg.toLowerCase()) &&
    !RegExpNumber.test(userMsg.toLowerCase())
  ) {
    return true;
  } else {
    return false;
  }
}

bot.on("message", async (msg) => {
  const userMsg = msg.text?.toString();
  if (!userMsg) return;
  if (isValidMsg(userMsg)) {
    if (
      groupType !== "private" &&
      (await check_if_word_exists(userMsg, vocApi))
    ) {
      return;
    } else bot.sendMessage(msg.chat.id, transliterate(userMsg));
  } else return;
});
