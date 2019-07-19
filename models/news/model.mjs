const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  theme: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
});

mongoose.model("News", newsSchema, "News");
