# IllegibleTextBot
Translates illegible text (Dsnf.) in group chats

This is a Local (`start npm` to run) Telegram Bot. It listens to incoming messages from users and transliterates them to Ukrainian (if they are not links, do not start with a number and are valid messages). If the incoming message is in a Telegram group and starts with a valid English word, the bot won't transliterate it.

Regarding the function check_if_word_exists, it calls an external API to check if a given English word exists. If the response from the API contains a "meta" field, then the word exists and the function returns true; otherwise, it returns false.
