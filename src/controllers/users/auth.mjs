import sanitize from "mongo-sanitize";
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
import { userDataSerializer } from "../../utils/serializers/users/index.mjs";

export const saveUser = async (req, res) => {
  const serializedUserData = userDataSerializer({ ...req.body });
  const sanitizedUserPassword = sanitize(req.body.password);
  const access_token = createToken(serializedUserData.id);

  try {
    await validateUser({
      ...serializedUserData,
      password: sanitizedUserPassword
    });
    const user = await getUserFromDbByUserName(serializedUserData.username);
    if (user) {
      res.status(400).send("user exists");
    } else {
      try {
        await addUserInDb({
          ...serializedUserData,
          password: sanitizedUserPassword
        }).save();

        const savedUserData = await getUserFromDbByUserName(
          serializedUserData.username
        );
        const savedUserId = savedUserData._id;

        res
          .cookie("access_token", access_token, {
            expires: new Date(Date.now() + 3 * 86400000),
            path: "/"
          })
          .status(200)
          .send({
            ...serializedUserData,
            id: savedUserId,
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
  const sanitizedUserPassword = sanitize(req.body.password);
  const serializedLoginedUser = userDataSerializer(req.body);
  const isLongLogined = Boolean(req.body.remembered);

  try {
    await validateUser({
      ...serializedLoginedUser,
      password: sanitizedUserPassword
    });

    const userData = await getUserFromDbByUserName(
      serializedLoginedUser.username
    );
    const serializedUserData = userDataSerializer(userData);
    const access_token = createToken(serializedUserData.id);
    const comparePasswords = compareHashedPasswords(
      makeHashedPassword(sanitizedUserPassword),
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
      res.status(401).send("user not valid");
    }
  } catch (error) {
    console.log(error);

    res.status(400).send("not valid user data");
  }
};

export const tokenAuth = async (req, res) => {
  const sanitizedUserId = sanitize(res.locals.userTokenData.user);

  try {
    const userData = await getUserFromDbById(sanitizedUserId);
    const serializedUserData = userDataSerializer(userData);
    const access_token = createToken(sanitizedUserId);
    res.status(200).send({
      ...serializedUserData,
      access_token
    });
  } catch (error) {
    console.log("get error", error);
    res.status(400).send("not valid user data");
  }
};
