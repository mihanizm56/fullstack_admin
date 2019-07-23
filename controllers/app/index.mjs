import path from "path";
import { readFile } from "../../services/promisify/index.mjs";

const get = (req, res) => {
  const pathToHTML = path.join(process.cwd(), "public", "index.html");

  readFile(pathToHTML, "utf8")
    .then(data => res.status(200).send(data))
    .catch(() => res.status(500).send("error"));
};

export default { get };
