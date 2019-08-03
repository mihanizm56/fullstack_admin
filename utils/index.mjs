import { access, unlink } from "../services/promisify/index.mjs";

export const deleteFile = async filePath => {
  try {
    await access(filePath);
    await unlink(filePath);
  } catch (error) {
    console.log("cant delete, error", error);
  }
};
