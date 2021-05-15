const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    privilege: {
      type: String,
      required: true,
    },
    turfid: {
      type: Number,
    },
  },
  {
    timestamps: true,
    collection: 'Users',
  }
);
const User = mongoose.model('User', userSchema);

module.exports = User;
