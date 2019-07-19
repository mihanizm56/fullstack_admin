const {
  addUserInDb,
  getUserFromDbByUserName,
  getUserFromDbById,
  updateUserFromDb,
  deleteUserByIdFromDb
} = require("../../models/users");
const { validateUser } = require("../../services/validation/user");
const {
  makeHashedPassword,
  compareHashedPasswords
} = require("../../services/passwords");
const { createToken } = require("../../services/tokens");

const createUser = async (req, res) => {
  const newUser = JSON.parse(req.body);
  // console.log("check new user", newUser);

  try {
    await validateUser({ ...newUser, image: newUser.img });
    const user = await getUserFromDbByUserName(newUser);
    if (user) {
      res.status(400).send("user exists");
    } else {
      try {
        const {
          username,
          password,
          firstName,
          surName,
          middleName,
          image,
          permission,
          _id: id
        } = await addUserInDb({ ...newUser, image: newUser.img }).save();
        const access_token = createToken(id);
        res
          .cookie("access_token", access_token, {
            expires: new Date(Date.now() + 3 * 86400000),
            path: "/"
          })
          .status(200)
          .send({
            username,
            firstName,
            surName,
            middleName,
            id,
            image,
            permission,
            access_token,
            permissionId: id
          });
      } catch (error) {
        console.log(error);
        res.status(400).send("not valid user data");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("not valid user data");
  }
};

const loginUser = async (req, res) => {
  const loginedUser = JSON.parse(req.body);
  const isLongLogined = Boolean(loginedUser.remembered);

  try {
    await validateUser(loginedUser);
    const {
      username,
      password,
      firstName,
      surName,
      middleName,
      image,
      permission,
      _id: id
    } = await getUserFromDbByUserName(loginedUser);
    const comparePasswords = compareHashedPasswords(
      makeHashedPassword(loginedUser.password),
      password
    );

    if (username && comparePasswords) {
      const access_token = createToken(id);
      res
        .cookie("access_token", access_token, {
          expires: isLongLogined
            ? new Date(Date.now() + 3 * 86400000)
            : new Date(Date.now() + 30 * 86400000),
          path: "/"
        })
        .status(200)
        .send({
          username,
          firstName,
          surName,
          middleName,
          id,
          image,
          permission,
          access_token,
          permissionId: id
        });
    } else {
      res.status(401).send("user not valid");
    }
  } catch (error) {
    res.status(400).send("not valid user data");
  }
};

const tokenAuth = async (req, res) => {
  // console.log("token user id", res.locals.userTokenData);
  const { user: userId } = res.locals.userTokenData;
  try {
    const {
      username,
      firstName,
      surName,
      middleName,
      image,
      permission,
      _id: id
    } = await getUserFromDbById(userId);
    const access_token = createToken(userId);
    res.status(200).send({
      username,
      firstName,
      surName,
      middleName,
      id,
      image,
      permission,
      access_token,
      permissionId: id
    });
  } catch (error) {
    console.log("get error", error);
    res.status(400).send("not valid user data");
  }
};

module.exports = {
  loginUser,
  createUser,
  tokenAuth
};
