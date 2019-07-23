import mongoose from "mongoose";
import "./model.mjs";
import {
  makeHashedPassword,
  compareHashedPasswords
} from "../../services/passwords/index.mjs";
import { serializePermission } from "../../services/users/index.mjs";

export const UserModel = mongoose.model("User");

export const addUserInDb = userData => {
  const newUser = new UserModel({
    ...userData,
    password: makeHashedPassword(userData.password)
  });

  return newUser;
};

export const getUserFromDbByUserName = ({ username }) =>
  UserModel.findOne({ username });

export const getUserFromDbById = _id => UserModel.findOne({ _id });

export const updateUserFromDb = (userId, userData) =>
  console.log("") ||
  UserModel.findOneAndUpdate(
    { _id: userId },
    {
      ...userData,
      password: makeHashedPassword(userData.password)
    },
    { overwrite: false }
  );

export const updateUserPermissionsDb = (userId, newPermissions) =>
  UserModel.findOneAndUpdate(
    { _id: userId },
    { permission: { ...newPermissions } },
    { overwrite: false }
  );

export const deleteUserByIdFromDb = ({ id: _id }) =>
  UserModel.deleteOne({ _id: mongoose.Types.ObjectId(`${_id}`) });

export const getAllUsersFromDb = () => UserModel.find();

export const savePhotoToUser = ({ userId, src }) => {
  UserModel.findOneAndUpdate(
    { id: userId },
    { image: src },
    { overwrite: false }
  );
};
