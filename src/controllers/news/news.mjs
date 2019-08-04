import {
  addNew,
  getAllNews,
  getNew,
  updateNew,
  deleteNew
} from "../../models/news/index.mjs";
import { validateNews } from "../../services/validation/news/index.mjs";
import { getNewsFromDB } from "./get-news.mjs";

export const getNews = async (req, res) => {
  try {
    const newsFromDb = await getNewsFromDB();
    res.status(200).send(newsFromDb);
  } catch (error) {
    console.log("error when getting news", error);
  }
};

export const newNews = async (req, res) => {
  const newNew = req.body;
  const { theme, date, text, userId } = newNew;
  console.log("check data of new", newNew);

  try {
    const existsNew = await getNew(newNew);
    if (existsNew) {
      console.log("there is a new in db");
      res.status(400).send("new exists");
    } else {
      try {
        await validateNews(newNew);
      } catch (error) {
        console.log("not valid data", error);
        return res.status(400).send("not valid user data");
      }

      try {
        await addNew(newNew).save();
        console.log("added the new in db");
        const newsFromDb = await getNewsFromDB();

        res.status(200).send(newsFromDb);
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
    const newsFromDb = await getNewsFromDB();

    res.status(200).send(newsFromDb);
  } catch (error) {
    console.log("new user data was not updated", error);
    res.status(400).send("not valid user data");
  }
};

export const deleteNews = async (req, res) => {
  const deleteNewData = req.params;

  try {
    await deleteNew(deleteNewData);
    const news = await getAllNews();
    const newsFromDb = await getNewsFromDB();

    res.status(200).send(newsFromDb);
  } catch (error) {
    console.log("not valid data", error);

    res.status(400).send("delete error");
  }
};
