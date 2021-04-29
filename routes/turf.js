const router = require('express').Router();
let Turf = require('../models/turf.models');
const { isAdmin, isManager } = require('./commonutils');

router.route('/').get((req, res) => {
  Turf.find()
    .then((turf) => res.json(turf))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  console.log(req)
  if (!isAdmin(req)) {
    const status = req.body.status;
    const name = req.body.name;
    const website = req.body.website;
    const mobile = req.body.mobile;
    const location = req.body.location;
    const address1 = req.body.address1;
    const address2 = req.body.address2;
    const city = req.body.city;
    const pincode = req.body.pincode;
    const state = req.body.state;
    const sports = req.body.sports;
    const features = req.body.features;
    const slots = req.body.slots;
    const turftype = req.body.turftype;
    const imagefile = req.body.imagefile;
    const date = Date.parse(req.body.date);

    const newTurf = new Turf({
      status,
      name,
      website,
      mobile,
      location,
      address1,
      address2,
      city,
      pincode,
      state,
      sports,
      features,
      slots,
      turftype,
      imagefile,
      date,
    });

    newTurf
      .save()
      .then(() => res.json('Turf Added!'))
      .catch((err) => res.status(400).json('Error: ' + err));
  }
  else{
    res.send("You are not a admin");
  }
});

module.exports = router;
