import { access, unlink } from "../utils/promisify/index.mjs";

export const deleteFile = async filePath => {
  try {
    await access(filePath);
    await unlink(filePath);
  } catch (error) {
    console.log("cant delete, error", error);
  }
};
