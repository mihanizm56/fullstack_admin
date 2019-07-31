import {
  addNew,
  getAllNews,
  getNew,
  updateNew,
  deleteNew
} from "../../models/news/index.mjs";
import lodash from "lodash";
import { validateNews } from "../../services/validation/news/index.mjs";
import { getUserFromDbById } from "../../models/users/index.mjs";
import { createToken } from "../../services/tokens/index.mjs";

const { pick } = lodash;

export const getNews = async (req, res) => {
  try {
    const news = await getAllNews();

    const result = news.map(async item => {
      const userId = item.userId;
      const newsData = pick(item, ["theme", "date", "text"]);
      const userData = await getUserFromDbById(userId);
      const { password, ...restUserData } = userData;
      const access_token = createToken(userData.id);

      return {
        ...newsData,
        id: item._id,
        user: {
          access_token,
          ...restUserData
        }
      };
    });

    const newsResult = await Promise.all(result);

    res.status(200).send(newsResult);
  } catch (error) {
    console.log("error when getting news", error);
  }
};

export const newNews = async (req, res) => {
  const newNew = req.body;
  const { theme, date, text, userId } = newNew;
  console.log("check data of new", newNew);

  try {
    // await validateNews(newNew);
    const existsNew = await getNew(newNew);
    if (existsNew) {
      // console.log("there is a new in db");
      res.status(400).send("new exists");
    } else {
      try {
        // console.log("add the new in db");
        await addNew(newNew).save();

        const news = await getAllNews();

        const result = news.map(async item => {
          const userId = item.userId;
          const newsData = pick(item, ["theme", "date", "text"]);
          const userData = await getUserFromDbById(userId);
          const { password, ...restUserData } = userData;
          const access_token = createToken(userData._id);

          return {
            ...newsData,
            id: item._id,
            user: {
              access_token,
              ...restUserData
            }
          };
        });

        const newsResult = await Promise.all(result);

        res.status(200).send(newsResult);
      } catch (error) {
        console.log("not valid data", error);
        res.status(400).send("not valid user data");
      }
    }
  } catch (error) {
    console.log("not valid data", error);
    res.status(400).send("not valid user data");
  }
};

export const updateNews = async (req, res) => {
  const newToUpdate = req.body;
  const { theme, text, userId, date, id } = newToUpdate;
  // console.log("check data of updated new", updateNew);
  try {
    await validateNews({ theme, text, userId, date });
    await updateNew(newToUpdate);
    // console.log("new user data is updated");
    const news = await getAllNews();

    const result = news.map(async item => {
      const userId = item.userId;
      const newsData = pick(item, ["theme", "date", "text"]);
      const userData = await getUserFromDbById(userId);
      const { password, ...restUserData } = userData;
      const access_token = createToken(userData._id);

      return {
        ...newsData,
        id: item._id,
        user: {
          access_token,
          restUserData
        }
      };
    });

    const newsResult = await Promise.all(result);

    res.status(200).send(newsResult);
  } catch (error) {
    console.log("new user data was not updated", error);
    res.status(400).send("not valid user data");
  }
};

export const deleteNews = async (req, res) => {
  const deleteNewData = req.params;
  // console.log("check data of delete new", deleteNewData);

  try {
    await deleteNew(deleteNewData);
    const updatedNews = await getAllNews();

    res.status(200).send(updatedNews);
  } catch (error) {
    console.log("not valid data", error);

    res.status(400).send("delete error");
  }
};
