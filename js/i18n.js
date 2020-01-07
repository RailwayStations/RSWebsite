import languages from "../json/lang";

export function getI18nStrings() {
  let lang = document.documentElement.lang;
  return languages[lang];
}
