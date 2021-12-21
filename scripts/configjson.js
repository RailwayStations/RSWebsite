const fs = require("fs");

const writeToFile = function (iniObj) {
  const outputDirectory = "map/json";
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, true);
  }

  const iniFile = outputDirectory + "/config.json";
  fs.writeFile(iniFile, iniObj, function (err) {
    if (err) throw err;
    console.log(`Saved ${iniFile}!`);
  });
};

const main = function () {
  console.log(`API_URL: ${process.env.npm_package_config_api_url}`);
  const iniObj = fs.readFileSync(`config-template.json`, "utf-8");
  writeToFile(
    iniObj.replace("__API_URL__", process.env.npm_package_config_api_url)
  );
};
main();
