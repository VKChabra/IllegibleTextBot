export async function check_if_word_exists(userMsg, vocApi, secVocApi) {
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
