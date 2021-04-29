const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const managerSchema = new Schema(
  {
    status: { type: Boolean },
    name: { type: String, required: true },
    website: { type: String, required: true },
    mobile: { type: Number, required: true, maxlength: 10 },
    location: [],
    address1: { type: String, required: true },
    address2: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: Number, required: true },
    state: { type: String, required: true },
    sports: [
      {
        name: { type: String },
        value: { type: Boolean },
      },
    ],
    features: [
      {
        name: { type: String },
        value: { type: Boolean },
      },
    ],
    slots: { type: String },
    operatinghours: [{ type: String }],
    turftype: [
      {
        name: { type: String },
        area: {
          height: { type: String },
          width: { type: String },
          units: { type: String },
        },
        operatinghours: [{ type: String }],
        bookedhours: [{ type: String }],
      },
    ],
    imagefile: [{type: String}],
  },
  {
    timestamps: true,
  }
);

const Manager = mongoose.model('Manager', managerSchema);

module.exports = Manager;
