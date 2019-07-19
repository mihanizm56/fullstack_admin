const path = require("path");
const { readFile } = require("../../services/promisify");

const get = (req, res) => {
  const pathToHTML = path.join(process.cwd(), "public", "index.html");
  readFile(pathToHTML, "utf8")
    .then(data => res.status(200).send(data))
    .catch(() => res.status(500).send("error"));
};

module.exports = { get };
