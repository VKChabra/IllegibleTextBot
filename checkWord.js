export async function check_if_word_exists(userMsg, vocApi) {
  const words = userMsg.toLowerCase().split(" ");
  let index = 0;

  // check if the first two words are less than 3 characters
  if (words.length > 0 && words[0].length < 3) {
    console.log("changing index to 1");
    index = 1;
  }

  if (words.length > 1 && words[1]?.length < 3) {
    console.log("changing index to 2");
    index = 2;
  }

  const url =
    "https://dictionaryapi.com/api/v3/references/sd3/json/" +
    words[index] +
    `?key=${vocApi}`;

  try {
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    if (JSON.stringify(data).includes("meta")) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    // console.log(error);
    return false;
  }
}
