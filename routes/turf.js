const router = require('express').Router();
let Turf = require('../models/turf.models');
const { isAdmin, isManager } = require('./commonutils');
const fs = require('fs');

router.route('/').get((req, res) => {
  Turf.find()
    .then((turf) => res.json(turf))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/delete').post((req, res) => {
  if (isAdmin(req)) {
    console.log(req)
    let context = req.session.context;
    let email = context.user_email;
    let path = './public/images/';
    Turf.findOne({ email: email }, function (err, turf) {
      if (turf) {
        let imagefiles = turf.imagefile;
        let imageToDelete = req.body.imageToDelete;
        if(imagefiles.includes(imageToDelete)){
          try {
            fs.unlinkSync(path+imageToDelete);
            let deleteQuery = {email:email} ;
            const filteredItems = imagefiles.filter(item => ![imageToDelete].includes(item))
            Turf.findOneAndUpdate(deleteQuery, { imagefile: filteredItems }, function (err, turf){
                if(err){
                  console.log(err)
                }
            });
            
            res.send(true);
            //file removed
          } catch(err) {
            console.error(err)
            res.send(err);
          }
        }else{
          res.send("Image doesn't exist in database")
        }
      } else {
        res.send("You don't have rights to edit this turf")
      }
    });
  }
});


router.route('/add').post((req, res) => {
  if (isAdmin(req)) {
    const status = req.body.status === 'on' ? true : false;
    const name = req.body.name;
    const email = req.body.email;
    const website = req.body.website;
    const mobile = req.body.mobile;
    const location = req.body.location.match(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g);
    const address1 = req.body.address1;
    const address2 = req.body.address2;
    const city = req.body.city;
    const pincode = req.body.pincode;
    const state = req.body.state;
    const slots = req.body.slots;
    let operatinghours = req.body.operatinghours;
    operatinghours = calculateHours(operatinghours, Number(slots));
    let sports = [];
    let features = [];
    let body = req.body;
    let date = req.body.date;
    let turftype = [];
    operatinghours = [
      {
        date: date,
        hours: operatinghours,
      },
    ];
    for (var reqname in body) {
      // for sports
      if (reqname.startsWith('sports')) {
        sportName = reqname.split('_')[1];
        sports.push({
          name: sportName,
          value: Array.isArray(body[reqname]) ? true : false,
        });
      }
      // for features
      if (reqname.startsWith('features')) {
        sportName = reqname.split('_')[1];
        features.push({
          name: sportName,
          value: Array.isArray(body[reqname]) ? true : false,
        });
      }
      
      if (reqname.startsWith('type')) {
        let turfType = reqname.split('_')[1];
        turftype.push({
          name: turfType,
          area: Number(body[`area_${turfType}`]),
          rate: Number(body[`rate_${turfType}`]),
          bookedhours: [
            {
              date: date,
              hours: [],
            },
          ],
        });
      }
    }

    // const imagefile = req.body.imagefile;
    const imagefile = req.body.image.split(',');
    // const date = Date.parse(req.body.date);
    const newTurf = new Turf({
      status,
      name,
      email,
      website,
      mobile,
      location,
      address1,
      address2,
      city,
      pincode,
      state,
      sports,
      operatinghours,
      features,
      slots,
      turftype,
      imagefile,
    });

    newTurf
      .save()
      .then(() => res.redirect('/admin/dashboard'))
      .catch((err) => res.status(400).json('Error: ' + err));
  } else {
    res.send('You are not an admin');
  }
});

router.route('/update').post((req, res) => {
  if (isAdmin(req)) {
    const status = req.body.status === 'on' ? true : false;
    const name = req.body.name;
    const email = req.body.email;
    const website = req.body.website;
    const mobile = req.body.mobile;
    const location = req.body.location.match(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g);
    const address1 = req.body.address1;
    const address2 = req.body.address2;
    const city = req.body.city;
    const pincode = req.body.pincode;
    const state = req.body.state;
    const slots = req.body.slots;
    let operatinghours = req.body.operatinghours;
    operatinghours = calculateHours(operatinghours, Number(slots));
    let sports = [];
    let features = [];
    let body = req.body;
    let date = req.body.date;
    console.log(date);
    let turftype = [];
    operatinghours = [
      {
        date: date,
        hours: operatinghours,
      },
    ];
    for (var reqname in body) {
      // for sports
      if (reqname.startsWith('sports')) {
        sportName = reqname.split('_')[1];
        sports.push({
          name: sportName,
          value: Array.isArray(body[reqname]) ? true : false,
        });
      }
      // for features
      if (reqname.startsWith('features')) {
        sportName = reqname.split('_')[1];
        features.push({
          name: sportName,
          value: Array.isArray(body[reqname]) ? true : false,
        });
      }
      
      if (reqname.startsWith('type')) {
        let turfType = reqname.split('_')[1];
        turftype.push({
          name: turfType,
          area: Number(body[`area_${turfType}`]),
          rate: Number(body[`rate_${turfType}`]),
          bookedhours: [
            {
              date: date,
              hours: [],
            },
          ],
        });
      }
    }

    // const imagefile = req.body.imagefile;
    const imagefile = req.body.image.split(',');
    // const date = Date.parse(req.body.date);
    const updateTurf = {
      status:status,
      name:name,
      email:email,
      website:website,
      mobile:mobile,
      location:location,
      pincode:pincode,
      state:state,
      sports:sports,
      operatinghours:operatinghours,
      features:features,
      slots:slots,
      turftype:turftype,
      imagefile:imagefile
    };
    Turf.findOneAndUpdate({email:email},updateTurf, function (err, turf){
      if(err){
        console.log(err);
      }else{
        res.redirect('/admin/dashboard');
      }
    })
  } else {
    res.send('You are not an admin');
  }
});

function calculateHours(oph, slots) {
  oph = oph.replace(/\s+/g, '').split('to');
  let start = Number(oph[0]);
  let end = Number(oph[1]);
  console.log(start, end);
  //["4 to 5 ","5  to 6 ","6  to 7 ","11  to 12 "]
  let mainoperatinghours = [];
  while (start != end) {
    let firstHalf = `${start}`;
    start = start + slots;
    if (slots == 2) {
      if (start - end == 1) {
        break;
      }
    }
    let secondHalf = `${start}`;
    mainoperatinghours.push(`${firstHalf} to ${secondHalf}`);
  }
  console.log(mainoperatinghours);

  return mainoperatinghours;
}

module.exports = router;
