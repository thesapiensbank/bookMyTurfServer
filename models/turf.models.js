const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const turfSchema = new Schema(
  {
    status: { type: Boolean, required:true },
    name: { type: String, required: true },
    website: { type: String, required: true },
    mobile: { type: Number, required: true, maxlength: 10 },
    location: [],
    address1: { type: String, required: true },
    address2: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: Number, required: true, maxlength:6 },
    state: { type: String, required: true },
    sports: [
      {
        name: { type: String, required: true  },
        value: { type: Boolean, required: true },
      },
    ],
    features: [
      {
        name: { type: String, required: true  },
        value: { type: Boolean, required: true },
      },
    ],
    slots: { type: Number, required: true  },
    turftype: [
      {
        name: { type: String, required: true  },
        area: {
          height: { type: String, required: true  },
          width: { type: String, required: true  },
          units: { type: String, required: true  },
        },
        operatinghours: [{ type: String, required: true  }],
        bookedhours: [{ type: String }],
      },
    ],
    imagefile: [{type: String }],
  },
  {
    timestamps: true,
    collection: 'Turfs'
  }
);

const Turf = mongoose.model('Turf', turfSchema);

module.exports = Turf;
