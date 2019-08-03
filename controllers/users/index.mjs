import path from "path";
import Jimp from "jimp";
import { unlink } from "../../services/promisify/index.mjs";
import {
  addUserInDb,
  getUserFromDbByUserName,
  getUserFromDbById,
  updateUserFromDb,
  deleteUserByIdFromDb,
  getAllUsersFromDb,
  updateUserPermissionsDb,
  savePhotoToUser
} from "../../models/users/index.mjs";
import { deleteNewByUserId } from "../../models/news/index.mjs";
import { validateUser } from "../../services/validation/user/index.mjs";
import {
  makeHashedPassword,
  compareHashedPasswords
} from "../../services/passwords/index.mjs";
import {
  getPermissionUsersData,
  serializePermission
} from "../../services/serializers/users/index.mjs";
import { createToken } from "../../services/tokens/index.mjs";
import { mkdir, rename } from "../../services/promisify/index.mjs";
import { photoValidation } from "../../services/validation/photo/index.mjs";
import { userDataSerializer } from "../../services/serializers/users/index.mjs";

export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { password, ...newUserData } = req.body;
  console.log("update user data", userId, newUserData);

  try {
    const user = await getUserFromDbById(userId);
    const serializedUser = userDataSerializer(user);

    if (user) {
      try {
        const newPassword = makeHashedPassword(password);
        const access_token = createToken(user._id);
        const userDataToSend = { ...serializedUser, ...newUserData };
        const userFullData = {
          userDataToSend,
          password: newPassword
        };

        await updateUserFromDb(userId, userFullData);
        res.status(200).send({ ...userDataToSend, access_token });
      } catch (error) {
        console.log("///////////////////", error);
        res.status(400).send("not valid user data");
      }
    } else {
      res.status(401).send("user not valid");
    }
  } catch (error) {
    console.log("!!!!!!!!!!!!", error);
    res.status(400).send("not valid user data");
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log("check id of user to delete", id);

  try {
    await deleteUserByIdFromDb({ id });
    await deleteNewByUserId({ userId: id });
    res.status(200).send("success");
  } catch (error) {
    console.log("not valid data", error);
    res.status(400).send("delete error");
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersFromDb();
    const permissionUsersData = getPermissionUsersData(users);
    // console.log("get all users", permissionUsersData);

    res.status(200).send(permissionUsersData);
  } catch (error) {
    console.log("error when getting users", error);

    res.status(500).send("internal error");
  }
};

export const updateUserPermissions = async (req, res) => {
  const userId = req.params.id;
  const userDataToUpdate = req.body;

  try {
    const user = await getUserFromDbById(userId);
    const newPermissions = serializePermission(
      user.permission,
      userDataToUpdate.permission
    );

    await updateUserPermissionsDb(userId, newPermissions);
    res.status(200).send(true);
  } catch (error) {
    console.log("error in update in db", error);
    res.status(500).send("error in update in db");
  }
};

export const saveUserImage = async (req, res) => {
  const userId = req.params;
  const userImage = req.file;
  const {
    originalname: photoName,
    filename,
    path: imagePath,
    buffer
  } = userImage;
  const staticPathToFile = path.join("/upload", photoName);
  const uploadDir = path.join(process.cwd(), "/public", "upload");
  const fileNameToSave = path.join(uploadDir, photoName);

  try {
    await photoValidation(userImage);
    await rename(imagePath, fileNameToSave);

    try {
      const photo = await Jimp.read(fileNameToSave);

      photo
        .resize(480, 640)
        .quality(80)
        .write(fileNameToSave);
    } catch (error) {
      console.log("error when optimizing photo", error);
      res.status(500).send("internal error");
    }

    try {
      savePhotoToUser({ userId, src: staticPathToFile });
      res.status(200).send({ path: staticPathToFile });
    } catch (error) {
      console.log("error in saving photo path", error);
      res.status(500).send("internal error");
    }
  } catch (error) {
    console.log("error in saveUserImage", error);
    res.status(500).send("internal error");
  }
};
