const router = require('express').Router();
let Turf = require('../models/turf.models');
const { isAdmin, isManager } = require('./commonutils');

router.route('/').get((req, res) => {
  Turf.find()
    .then((turf) => res.json(turf))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  // console.log(req)
  if (!isAdmin(req)) {
    //remove this !isAdmin on production

    console.log(req.body);
    // console.log("This sports: ",Array.isArray(req.body.sports_Football))
    const status = req.body.status === 'on' ? true : false;
    const name = req.body.name;
    const website = req.body.website;
    const mobile = req.body.mobile;
    const location = req.body.location.match(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g);
    const address1 = req.body.address1;
    const address2 = req.body.address2;
    const city = req.body.city;
    const pincode = req.body.pincode;
    const state = req.body.state;
    const slots = req.body.slots;
    console.log(slots)
    let operatinghours = req.body.operatinghours;
    operatinghours = calculateHours(operatinghours,slots)
    let sports = [];
    let features = [];
    let body = req.body;
    let turfTypes = [];

    for (var reqname in body) {
      // for sports
      if (reqname.startsWith('sports')) {
        sportName = reqname.split('_')[1];
        console.log(sportName);
        sports.push({
          name: sportName,
          value: Array.isArray(body[reqname]) ? true : false,
        });
      }
      // for features
      if (reqname.startsWith('features')) {
        sportName = reqname.split('_')[1];
        console.log(sportName);
        features.push({
          name: sportName,
          value: Array.isArray(body[reqname]) ? true : false,
        });
      }
      //   {
      //     "name":"Basketball",
      //     "area":21312,
      //     "rate":123,
      //     "operatinghours":["4.00 am to 5.00 am","5.00 am to 6.00 am","6.00 am to 7.00 am","11.00 am to 12.00 pm"],
      //     "bookedhours":["9.00 am to 10.00 am","11.00 am to 12.00 am","7.00 am to 8.00 am"]
      // }
      if (reqname.startsWith('type')) {
        let turfType = reqname.split('_')[1];
        console.log(turfType);
        turfTypes.push({
          name: turfType,
          area: body[`area_${turfType}`],
          rate: body[`rate_${turfType}`],
          operatinghours: operatinghours,
          bookedhours:[]
        });
      }
    }

    // const imagefile = req.body.imagefile;
    const imagefile = ['img/slide.jpg', 'img/slide2.jpg'];
    // const date = Date.parse(req.body.date);

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
    });

    // newTurf
    //   .save()
    //   .then(() => res.json('Turf Added!'))
    //   .catch((err) => res.status(400).json('Error: ' + err));
  } else {
    res.send('You are not a admin');
  }
});

function calculateHours(oph,slots) {
  console.log(oph);
  oph = oph.replace(/\s+/g, '').split('to');
  let start = Number(oph[0].split('-')[0]);
  let startPost = oph[0].split('-')[1];
  let end = Number(oph[1].split('-')[0]);
  let endPost = oph[1].split('-')[1];
  console.log(start, startPost, end, endPost);
  let mainoperatinghours = [];
  while (start != end || startPost != endPost) {
    console.log('this ran');
    let firstHalf = `${start} ${startPost}`;
    start = start + slots == 13 ? 1 : start + slots;
    if (start == 12 && startPost == 'am') {
      startPost = 'pm';
    } else if (start == 12 && startPost == 'pm') {
      startPost = 'am';
    }
    let secondHalf = `${start} ${startPost}`;
    mainoperatinghours.push(`${firstHalf} to ${secondHalf}`);
  }

  return mainoperatinghours;
}

module.exports = router;
