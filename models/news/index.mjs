import mongoose from "mongoose";
import { News } from "./model.mjs";
import {
  makeHashedPassword,
  compareHashedPasswords
} from "../../services/passwords";

export const NewsModel = mongoose.model("News");

export const addNew = newNew => (newUser = new NewsModel(newNew));

export const getAllNews = () => NewsModel.find();

export const getNew = newData => NewsModel.findOne(newData);

export const updateNew = newData =>
  NewsModel.findOneAndUpdate(
    { _id: newData.id },
    { ...newData },
    { overwrite: false }
  );

export const deleteNew = ({ id }) => NewsModel.findByIdAndRemove({ _id: id });
