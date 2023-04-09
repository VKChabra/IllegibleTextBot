async function check_if_word_exists(userMsg, vocApi, secVocApi) {
  const words = userMsg.toLowerCase().split(" ");
  let index = 0;

  for (let i = 0; i < 2 && i < words.length; i++) {
    if (words[i]?.length < 3) {
      index = i + 1;
    }
  }

  const url = `https://dictionaryapi.com/api/v3/references/sd3/json/${words[index]}?key=${vocApi}`;
  const url2 = `https://api.wordnik.com/v4/word.json/${words[index]}/definitions?limit=200&includeRelated=false&useCanonical=false&includeTags=false&api_key=${secVocApi}`;

  try {
    let existance = false;
    const res1 = await fetch(url);
    const data1 = await res1.json();

    if (JSON.stringify(data1).includes("meta")) {
      existance = true;
    } else {
      const res2 = await fetch(url2);
      const data2 = await res2.json();
      if (JSON.stringify(data2).includes("text")) {
        existance = true;
      }
    }

    return existance;
  } catch (error) {
    // console.log(error);
    return false;
  }
}

const ukrainian = {
  Q: "Й",
  W: "Ц",
  E: "У",
  R: "К",
  T: "Е",
  Y: "Н",
  U: "Г",
  I: "Ш",
  O: "Щ",
  P: "З",
  "{": "Х",
  "}": "Ї",
  A: "Ф",
  S: "І",
  D: "В",
  F: "А",
  G: "П",
  H: "Р",
  J: "О",
  K: "Л",
  L: "Д",
  ":": "Ж",
  '"': "Є",
  Z: "Я",
  X: "Ч",
  C: "С",
  V: "М",
  B: "И",
  N: "Т",
  M: "Ь",
  "<": "Б",
  ">": "Ю",
  "/": ".",
  q: "й",
  w: "ц",
  e: "у",
  r: "к",
  t: "е",
  y: "н",
  u: "г",
  i: "ш",
  o: "щ",
  p: "з",
  "[": "х",
  "]": "ї",
  a: "ф",
  s: "і",
  d: "в",
  f: "а",
  g: "п",
  h: "р",
  j: "о",
  k: "л",
  l: "д",
  ";": "ж",
  "'": "є",
  z: "я",
  x: "ч",
  c: "с",
  v: "м",
  b: "и",
  n: "т",
  m: "ь",
  ",": "б",
  ".": "ю",
  "`": "'",
  "?": ",",
  // numbers 23467
  $: ";",
  "@": '"',
  "#": "№",
  "^": ":",
  "&": "?",
};

function transliterate(input) {
  let result = "";
  for (let i = 0; i < input.length; i++) {
    if (ukrainian[input[i]]) {
      result += ukrainian[input[i]];
    } else {
      result += input[i];
    }
  }
  return result;
}

const RegExpMsg = /^\S[a-zA-Z0-9\s[.\]{[}\]|;:"\\'`<,>.?&/()*!@#$%^*_~₴+=-]*$/;
const RegExpLink =
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
const RegExpTelegramLink = /\b(?:https?:\/\/)?t\.me\/[a-zA-Z0-9_]+/;
const RegExpTelegramTag = /^@\w+/;
const RegExpNumber = /^[0-9,.-]+$/;

function isValidMsg(userMsg) {
  // should return true if msg is valid
  if (
    RegExpMsg.test(userMsg.toLowerCase()) &&
    !RegExpLink.test(userMsg.toLowerCase()) &&
    !RegExpTelegramLink.test(userMsg.toLowerCase()) &&
    !RegExpTelegramTag.test(userMsg.toLowerCase()) &&
    !RegExpNumber.test(userMsg.toLowerCase())
  ) {
    return true;
  } else {
    return false;
  }
}

export default {
  async fetch(request, env) {
    if (request.method === "POST") {
      try {
        const reqBody = await request.json();
        const userMsg = reqBody.message?.text?.toString();
        const groupType = reqBody.message?.chat?.type?.toString();

        if (!userMsg) {
          console.log("No user message");
          return new Response("No user message", { status: 200 });
        }
        if (!isValidMsg(userMsg)) {
          console.log("Not valid message");
          return new Response("Not valid message", { status: 200 });
        }
        if (
          groupType !== "private" &&
          (await check_if_word_exists(userMsg, env.VOCAB_API, env.SEC_VOC_API))
        ) {
          console.log(`${groupType} should not translate`);
          return new Response("Should not translate", { status: 200 });
        }

        const chatId = reqBody.message?.chat.id;
        const textTranslated = transliterate(userMsg);
        const url = `https://api.telegram.org/bot${env.API_TOKEN}/sendMessage?chat_id=${chatId}&text=${textTranslated}`;
        await fetch(url);

        return new Response("KK");
      } catch (error) {
        // console.log(error);
        return new Response("Bad request", { status: 400 });
      }
    } else {
      return new Response(new String("Only POST methods are available"), {
        status: 400,
      });
    }
  },
};
