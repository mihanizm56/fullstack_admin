const {
  addNew,
  getAllNews,
  getNew,
  updateNew,
  deleteNew
} = require("../../models/news");
const pick = require("lodash/pick");
const { validateNews } = require("../../services/validation/news");
const { getUserFromDbById } = require("../../models/users");
const { createToken } = require("../../services/tokens");

const getNews = async (req, res) => {
  try {
    const news = await getAllNews();

    const result = news.map(async item => {
      const userId = item.userId;
      const newsData = pick(item, ["theme", "date", "text"]);
      const userData = pick(await getUserFromDbById(userId), [
        "username",
        "firstName",
        "surName",
        "middleName",
        "image"
      ]);
      const access_token = createToken(userData._id);

      return {
        ...newsData,
        id: item._id,
        user: {
          access_token: access_token || "",
          username: userData.username || "",
          firstName: userData.firstName || "",
          surName: userData.surName || "",
          middleName: userData.middleName || "",
          id: userId || "",
          image: userData.image || "",
          permission: userData.permission || ""
        }
      };
    });

    const newsResult = await Promise.all(result);

    res.status(200).send(newsResult);
  } catch (error) {
    console.log("error when getting news", error);
  }
};

const newNews = async (req, res) => {
  const newNew = JSON.parse(req.body);
  // const newNew = req.body;
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
          const userData = pick(await getUserFromDbById(userId), [
            "username",
            "firstName",
            "surName",
            "middleName",
            "image"
          ]);

          const access_token = createToken(userData._id);

          return {
            ...newsData,
            id: item._id,
            user: {
              access_token: access_token || "",
              username: userData.username || "",
              firstName: userData.firstName || "",
              surName: userData.surName || "",
              middleName: userData.middleName || "",
              id: userId || "",
              image: userData.image || "",
              permission: userData.permission || ""
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

const updateNews = async (req, res) => {
  const newToUpdate = JSON.parse(req.body);
  // const updateNew = req.body;
  const { theme, text, userId, date, id } = newToUpdate;
  // console.log("check data of updated new", newToUpdate);
  try {
    await validateNews({ theme, text, userId, date });
    await updateNew(newToUpdate);
    // console.log("new user data is updated");
    const news = await getAllNews();

    const result = news.map(async item => {
      const userId = item.userId;
      const newsData = pick(item, ["theme", "date", "text"]);
      const userData = pick(await getUserFromDbById(userId), [
        "username",
        "firstName",
        "surName",
        "middleName",
        "image"
      ]);

      const access_token = createToken(userData._id);

      return {
        ...newsData,
        id: item._id,
        user: {
          access_token: access_token || "",
          username: userData.username || "",
          firstName: userData.firstName || "",
          surName: userData.surName || "",
          middleName: userData.middleName || "",
          id: userId || "",
          image: userData.image || "",
          permission: userData.permission || ""
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

const deleteNews = async (req, res) => {
  // const deleteNew = JSON.parse(req.body);
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

module.exports = {
  getNews,
  newNews,
  updateNews,
  deleteNews
};
