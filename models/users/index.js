const mongoose = require("mongoose");
const { User } = require("./model");
const {
  makeHashedPassword,
  compareHashedPasswords
} = require("../../services/passwords");
const { serializePermission } = require("../../services/users");

const UserModel = mongoose.model("User");

const addUserInDb = userData =>
  (newUser = new UserModel({
    ...userData,
    password: makeHashedPassword(userData.password)
  }));

const getUserFromDbByUserName = ({ username }) =>
  UserModel.findOne({ username });

const getUserFromDbById = _id => UserModel.findOne({ _id });

const updateUserFromDb = (userId, userData) => console.log('') ||

  UserModel.findOneAndUpdate(
    { _id: userId },
    {
      ...userData,
      password: makeHashedPassword(userData.password)
    },
    { overwrite: false }
  );

const updateUserPermissionsDb = (userId, newPermissions) =>
  UserModel.findOneAndUpdate(
    { _id: userId },
    { permission: { ...newPermissions } },
    { overwrite: false }
  );

const deleteUserByIdFromDb = ({ id: _id }) =>
  UserModel.deleteOne({ _id: mongoose.Types.ObjectId(`${_id}`) });

const getAllUsersFromDb = () => UserModel.find();

const savePhotoToUser = ({ userId, src }) => {
  UserModel.findOneAndUpdate(
    { id: userId },
    { image: src },
    { overwrite: false }
  );
};

module.exports = {
  addUserInDb,
  getUserFromDbByUserName,
  getUserFromDbById,
  updateUserFromDb,
  deleteUserByIdFromDb,
  getAllUsersFromDb,
  savePhotoToUser,
  updateUserPermissionsDb
};
