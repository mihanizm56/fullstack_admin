import path from "path";
import Jimp from "jimp";
import sanitize from "mongo-sanitize";
import {
  access,
  unlink,
  mkdir,
  rename,
  removef
} from "../../utils/promisify/index.mjs";
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
import { photoValidation } from "../../services/validation/photo/index.mjs";
import {
  makeHashedPassword,
  compareHashedPasswords
} from "../../services/passwords/index.mjs";
import {
  getPermissionUsersData,
  serializePermission
} from "../../services/serializers/users/index.mjs";
import { createToken } from "../../services/tokens/index.mjs";
import { userDataSerializer } from "../../utils/serializers/users/index.mjs";
import { deleteFile } from "../../utils/index.mjs";

export const updateUser = async (req, res) => {
  const userId = sanitize(req.params.id);
  const { password, ...newUserData } = req.body;

  try {
    const user = await getUserFromDbById(userId);
    const serializedUser = userDataSerializer(user);

    if (user) {
      try {
        const newPassword = makeHashedPassword(password);
        const access_token = createToken(user._id);
        const userDataToSend = { ...serializedUser, ...newUserData };
        const userFullData = {
          ...userDataToSend,
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
  const sanitizedUserId = sanitize(req.params.id);
  console.log("check id of user to delete", userId);

  try {
    const adminUserData = await getUserFromDbById(
      res.locals.userTokenData.user
    );
    const userData = await getUserFromDbById(sanitizedUserId);
    const serializedAdminUserData = userDataSerializer(adminUserData);
    const serializedUserData = userDataSerializer(userData);
    const prevUserPhotoName = path.basename(serializedUserData.image);

    // deleting images
    const prevUserImage = path.join(
      process.cwd(),
      "public",
      "upload",
      sanitizedUserId,
      prevUserPhotoName
    );
    const dirForUser = path.join(
      process.cwd(),
      "public",
      "upload",
      sanitizedUserId
    );

    // check for permission
    const isAdminPermittedToDelete = Boolean(
      serializedAdminUserData.permission.setting.D
    );

    if (isAdminPermittedToDelete) {
      try {
        await access(dirForUser);
        await removef(dirForUser);
      } catch (error) {}

      try {
        await deleteUserByIdFromDb({ id: sanitizedUserId });
        await deleteNewByUserId({ sanitizedUserId });
        res.status(200).send("success");
      } catch (error) {
        console.log("internal server error", error);
        res.status(500).send("internal server error");
      }
    } else {
      res.status(403).send("forbidden");
    }
  } catch (error) {
    console.log("internal server error", error);
    res.status(500).send("internal server error");
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersFromDb();
    const permissionUsersData = getPermissionUsersData(users);
    res.status(200).send(permissionUsersData);
  } catch (error) {
    console.log("error when getting users", error);
    res.status(500).send("internal error");
  }
};

export const updateUserPermissions = async (req, res) => {
  const sanitizedUserId = sanitize(req.params.id);
  const userDataToUpdate = req.body;

  try {
    const user = await getUserFromDbById(sanitizedUserId);
    const newPermissions = serializePermission(
      user.permission,
      userDataToUpdate.permission
    );

    await updateUserPermissionsDb(sanitizedUserId, newPermissions);
    res.status(200).send(true);
  } catch (error) {
    console.log("error in update in db", error);
    res.status(500).send("error in update in db");
  }
};

export const saveUserImage = async (req, res) => {
  const sanitizedUserId = sanitize(req.params.id);
  const userImage = req.file;
  const { originalname: photoName, filename, path: imagePath } = userImage;
  const uploadDir = path.join(process.cwd(), "public", "upload");
  const dirForUser = path.join(
    process.cwd(),
    "public",
    "upload",
    sanitizedUserId
  );

  try {
    try {
      await access(dirForUser);
    } catch (error) {
      await mkdir(dirForUser);
    }

    const staticPathToFile = path.join("upload", sanitizedUserId, photoName);
    const fileNameToSave = path.join(uploadDir, sanitizedUserId, photoName);

    await photoValidation(userImage);
    await rename(imagePath, fileNameToSave);

    const photo = await Jimp.read(fileNameToSave);
    photo
      .resize(480, 640)
      .quality(80)
      .write(fileNameToSave);

    const userData = await getUserFromDbById(sanitizedUserId);
    const serializedUserData = userDataSerializer(userData);
    const prevUserPhotoName = path.basename(serializedUserData.image);

    if (prevUserPhotoName) {
      const prevUserImage = path.join(
        process.cwd(),
        "public",
        "upload",
        sanitizedUserId,
        prevUserPhotoName
      );
      try {
        await deleteFile(prevUserImage);
      } catch (error) {
        console.log("error in deleting users photo");
      }
    }

    const newData = { ...serializedUserData, image: staticPathToFile };

    await updateUserFromDb(sanitizedUserId, newData);

    res.status(200).send({ path: staticPathToFile });
  } catch (error) {
    console.log("error in saveUserImage", error);
    res.status(500).send("internal error");
  }
};
