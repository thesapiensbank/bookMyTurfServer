const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const managerSchema = new Schema(
  {
    username: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const Manager = mongoose.model('Manager', managerSchema);

module.exports = Manager;
