const fs = require("fs"),
  ini = require("ini");

const writeToFile = function (langObj) {
  const outputDirectory = "json";
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
  }

  const jsonFile = outputDirectory + "/lang.json";
  fs.writeFile(jsonFile, JSON.stringify(langObj), function (err) {
    if (err) throw err;
    console.log(`Saved ${jsonFile}!`);
  });
};

const readFile = function (file) {
  return ini.parse(fs.readFileSync(`i18n/lang/${file}`, "utf-8"));
};

const langSourceDirectory = "i18n/lang";

const extractLang = function (fileName) {
  return fileName.split("_")[1].split(".")[0];
};

const main = function () {
  fs.readdir(langSourceDirectory, (err, files) => {
    const result = {};
    files.forEach(file => {
      const langObj = readFile(file);
      const lang = extractLang(file);
      result[lang] = langObj;
    });
    writeToFile(result);
  });
};
main();
