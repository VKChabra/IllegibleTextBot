import axios from "axios";

export async function check_if_word_exists(word, vocApi) {
  const url =
    "https://api.wordnik.com/v4/word.json/" +
    word +
    `/definitions?limit=200&includeRelated=false&useCanonical=false&includeTags=false&api_key=${vocApi}`;

  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    // console.log(error.response);
    return false;
  }
}
