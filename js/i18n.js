import languages from "../map/json/lang";

const defaultLang = "en";

export function getI18n(parameters) {
  let lang = document.documentElement.lang;
  const result = parameters(languages[lang]);
  if (!result) {
    return parameters(languages[defaultLang]);
  }
  return result;
}
