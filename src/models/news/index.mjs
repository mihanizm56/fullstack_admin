import mongoose from "mongoose";
import "./model.mjs";
import {
  makeHashedPassword,
  compareHashedPasswords
} from "../../services/passwords/index.mjs";

export const NewsModel = mongoose.model("News");

export const getAllNews = () => NewsModel.find();

export const getNew = newData => NewsModel.findOne(newData);

export const deleteNew = ({ id }) => NewsModel.findByIdAndRemove({ _id: id });

export const deleteNewByUserId = ({ userId }) =>
  NewsModel.findOneAndRemove({ userId });

export const addNew = newNew => {
  const newUser = new NewsModel(newNew);
  return newUser;
};

export const updateNew = newData =>
  NewsModel.findOneAndUpdate(
    { _id: newData.id },
    { ...newData },
    { overwrite: false }
  );
