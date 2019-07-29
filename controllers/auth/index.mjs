import lodash from "lodash";
import {
  addUserInDb,
  getUserFromDbByUserName,
  getUserFromDbById,
  updateUserFromDb,
  deleteUserByIdFromDb
} from "../../models/users/index.mjs";
import { validateUser } from "../../services/validation/user/index.mjs";
import {
  makeHashedPassword,
  compareHashedPasswords
} from "../../services/passwords/index.mjs";
import { createToken } from "../../services/tokens/index.mjs";
import { userDataSerializer } from "../../services/serializers/users/index.mjs";

export const saveUser = async (req, res) => {
  const { uniqueId } = lodash;
  const newUserId = uniqueId(`${req.body.username}_`);
  const serializedUserData = userDataSerializer({ ...req.body, id: newUserId });
  const access_token = createToken(serializedUserData.id);

  try {
    await validateUser({ ...serializedUserData, password: req.body.password });
    const user = await getUserFromDbByUserName(serializedUserData.username);
    if (user) {
      res.status(400).send("user exists");
    } else {
      try {
        await addUserInDb({
          ...serializedUserData,
          password: req.body.password
        }).save();

        res
          .cookie("access_token", access_token, {
            expires: new Date(Date.now() + 3 * 86400000),
            path: "/"
          })
          .status(200)
          .send({
            ...serializedUserData,
            access_token
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

export const loginUser = async (req, res) => {
  const loginedUser = req.body;
  const isLongLogined = Boolean(loginedUser.remembered);

  try {
    await validateUser(loginedUser);

    const userData = await getUserFromDbByUserName(loginedUser.username);
    const serializedUserData = userDataSerializer(userData);
    const access_token = createToken(serializedUserData.id);
    const comparePasswords = compareHashedPasswords(
      makeHashedPassword(loginedUser.password),
      userData.password
    );

    if (comparePasswords) {
      res
        .cookie("access_token", access_token, {
          expires: isLongLogined
            ? new Date(Date.now() + 3 * 86400000)
            : new Date(Date.now() + 30 * 86400000),
          path: "/"
        })
        .status(200)
        .send({
          ...serializedUserData,
          access_token
        });
    } else {
      console.log(error);
      res.status(401).send("user not valid");
    }
  } catch (error) {
    console.log(error);

    res.status(400).send("not valid user data");
  }
};

export const tokenAuth = async (req, res) => {
  const { user: userId } = res.locals.userTokenData;
  try {
    const userData = await getUserFromDbById(userId);
    const serializedUserData = userDataSerializer(userData);
    const access_token = createToken(userId);
    res.status(200).send({
      ...serializedUserData,
      access_token
    });
  } catch (error) {
    console.log("get error", error);
    res.status(400).send("not valid user data");
  }
};
