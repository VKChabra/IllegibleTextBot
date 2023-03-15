export async function check_if_word_exists(word, vocApi) {
  const url =
    "https://dictionaryapi.com/api/v3/references/sd3/json/" +
    word +
    `?key=${vocApi}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    if (JSON.stringify(data).includes("meta")) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
