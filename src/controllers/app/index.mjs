import path from "path";
import { readFile } from "../../utils/promisify/index.mjs";

const get = async (req, res) => {
  const pathToHTML = path.join(process.cwd(), "public", "index.html");

  try {
    const data = await readFile(pathToHTML, "utf8");
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send("error");
  }
};

export default { get };
