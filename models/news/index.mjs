const mongoose = require("mongoose");
const { News } = require("./model.mjs");
const {
  makeHashedPassword,
  compareHashedPasswords
} = require("../../services/passwords");

const NewsModel = mongoose.model("News");

const addNew = newNew => (newUser = new NewsModel(newNew));

const getAllNews = () => NewsModel.find();

const getNew = newData => NewsModel.findOne(newData);

const updateNew = newData =>
  NewsModel.findOneAndUpdate(
    { _id: newData.id },
    { ...newData },
    { overwrite: false }
  );

const deleteNew = ({ id }) => NewsModel.findByIdAndRemove({ _id: id });

module.exports = {
  addNew,
  getAllNews,
  getNew,
  updateNew,
  deleteNew
};
