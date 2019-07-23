import path from "path";
import { mkdir, rename } from "../../services/promisify";
import { photoValidation } from "../../services/validation/photo";
import { savePhotoToUser } from "../../models/users";

export const saveUserImage = async (req, res) => {
  // console.log("start upload photo", req.files);
  const fileToUpload = req.files[0]; ///////////////////////////////////////////////////govno
  const userId = req.params;
  const { originalname: photoName, size, buffer, filename } = fileToUpload;
  const staticPath = path.join("upload");
  const staticPathToFile = path.join(staticPath, photoName);
  const uploadDir = path.join(process.cwd(), "/public", staticPath);

  try {
    await photoValidation(fileToUpload);
    await rename(
      path.join(uploadDir, filename),
      path.join(uploadDir, photoName)
    );

    try {
      savePhotoToUser({ userId, src: staticPathToFile });
      res.status(200).send({ path: staticPathToFile });
    } catch (error) {
      console.log("error in saving photo path", error);
      res.status(500).send("internal error");
    }
  } catch (error) {
    console.log("error in saveUserImage", error);
    res.status(500).send("not valid date");
  }
};
