const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const turfSchema = new Schema(
  {
    status: { type: Boolean, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    website: { type: String, required: true },
    mobile: { type: Number, required: true, maxlength: 10 },
    location: [],
    address1: { type: String, required: true },
    address2: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: Number, required: true, maxlength: 6 },
    state: { type: String, required: true },
    sports: [
      {
        name: { type: String, required: true },
        value: { type: Boolean, required: true },
      },
    ],
    operatinghours: [
      {
        date: { type: String, required: true },
        hours: [{ type: String, required: true }],
      },
    ],
    features: [
      {
        name: { type: String, required: true },
        value: { type: Boolean, required: true },
      },
    ],
    slots: { type: Number, required: true },
    turftype: [
      {
        name: { type: String, required: true },
        area: { type: Number, required: true },
        rate: { type: Number, required: true },
        bookedhours: [
          {
            date: { type: String, required: true },
            hours: [{ type: String, required: true }],
          },
        ],
      },
    ],
    imagefile: [{ type: String }],
  },
  {
    timestamps: true,
    collection: 'Turfs',
  }
);

const Turf = mongoose.model('Turf', turfSchema);

module.exports = Turf;
