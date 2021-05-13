const router = require('express').Router();
let Turf = require('../models/turf.models');
const { isAdmin, isManager } = require('./commonutils');
const fs = require('fs');

router.route('/').get((req, res) => {
  Turf.find()
    .then((turf) => res.json(turf))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/booking').post((req, res) => {
  if (isAdmin(req)) {
    console.log(req.body);
    const email = req.session.context.user_email;
    console.log(email);
    const date = req.body.date;
    const body = req.body;
    for (var reqname in body) {
      if (reqname.startsWith('id_')) {
        let turfId = reqname.split('id_')[1];
        let bhoursArray = [];
        for (var i in body) {
          if (i.startsWith(turfId + 'bhours_') && Array.isArray(body[i])) {
            let bhours = i.split('bhours_')[1];
            bhoursArray.push(bhours);
          }
        }

        console.log(bhoursArray, turfId);
        Turf.findOne({ 'turftype._id': turfId }, function (err, turf) {
          var bookedHoursPresent = false;
          console.log(turf);
          console.log('\n--------------------------------------------\n');
          for (let i = 0; i < turf.turftype.length; i++) {
            for (let j = 0; j < turf.turftype[i].bookedhours.length; j++) {
            console.log(turf.turftype[i].bookedhours[j])
              if (turf.turftype[i].bookedhours[j].date == date && turf.turftype[i]._id == turfId) {
                bookedHoursPresent = true;
                break;
              }
            }
          }
          
          console.log('\n--------------------------------------------\n');
          console.log(bookedHoursPresent);
          if (!bookedHoursPresent) {
            Turf.updateOne(
              {
                'turftype._id': turfId,
              },
              {
                $push: {
                  'turftype.$.bookedhours': {
                    hours: bhoursArray,
                    date: date,
                  },
                },
              },
              // {
              //   arrayFilters: [{ 'outer._id': turfId }],
              // },
              function (err) {
                if (err) {
                  console.log(err);
                }
              }
            );
          } else {
            Turf.updateOne(
              {
                'turftype._id': turfId,
              },
              {
                $set: {
                  'turftype.$[outer].bookedhours.$[inner].hours': bhoursArray,
                },
              },
              {
                arrayFilters: [{ 'outer._id': turfId }, { 'inner.date': date }],
              },
              function (err) {
                if (err) {
                  console.log(err);
                }
              }
            );
          }
        });
      }
    }
    res.redirect('/admin/booking');
    // const status = req.body.status === 'on' ? true : false;
    // const name = req.body.name;
    // const email = req.body.email;
    // const website = req.body.website;
    // const mobile = req.body.mobile;
    // const location = req.body.location.match(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g);
    // const address1 = req.body.address1;
    // const address2 = req.body.address2;
    // const city = req.body.city;
    // const pincode = req.body.pincode;
    // const state = req.body.state;
    // const slots = req.body.slots;
    // let operatinghours = req.body.operatinghours;
    // operatinghours = calculateHours(operatinghours, Number(slots));
    // let sports = [];
    // let features = [];
    // let body = req.body;
    // let date = req.body.date;
    // console.log(date);
    // let turftype = [];
    // operatinghoursQuery = {
    //   '$set':{
    //     'operatinghours.$.date': date,
    //     'operatinghours.$.hours': operatinghours
    //   }
    // }
    // Turf.findOne({ 'operatinghours.date': date })
    //   .then((turf) => {
    //     console.log("\n Turf:"+turf);
    //     // console.log("\n operatinghours:"+operatinghours,"\n turf data:"+turf.operatinghours)
    //     if (turf!=null) {
    //       Turf.updateOne(
    //         { 'operatinghours.date': date },
    //         operatinghoursQuery,
    //         function (err, turf) {
    //           if (err) {
    //             console.log(err);
    //           }
    //         }
    //       );
    //     } else {
    //       Turf.updateOne(
    //         { email: email },
    //         {
    //           $push: {
    //             operatinghours: {
    //               'date': date,
    //               'hours': operatinghours,
    //             },
    //           },
    //         },
    //         function (err, turf) {
    //           if (err) {
    //             console.log(err);
    //           }
    //         }
    //       );
    //     }
    //   })
    //   .catch((err) => res.status(400).json('Error: ' + err));

    // for (var reqname in body) {
    //   // for sports
    //   if (reqname.startsWith('sports')) {
    //     sportName = reqname.split('_')[1];
    //     sports.push({
    //       name: sportName,
    //       value: Array.isArray(body[reqname]) ? true : false,
    //     });
    //   }
    //   // for features
    //   if (reqname.startsWith('features')) {
    //     featureName = reqname.split('_')[1];
    //     features.push({
    //       name: featureName,
    //       value: Array.isArray(body[reqname]) ? true : false,
    //     });
    //   }

    //   if (reqname.startsWith('type')) {
    //     let turfType = reqname.split('_')[1];
    //     turftype.push({
    //       name: turfType,
    //       area: Number(body[`area_${turfType}`]),
    //       rate: Number(body[`rate_${turfType}`]),
    //       bookedhours: [
    //         {
    //           date: date,
    //           hours: [],
    //         },
    //       ],
    //     });
    //   }
    // }

    // // const imagefile = req.body.imagefile;
    // const imagefile = req.body.image.split(',');
    // // const date = Date.parse(req.body.date);
    // const updateTurf = {
    //   status:status,
    //   name:name,
    //   email:email,
    //   website:website,
    //   mobile:mobile,
    //   location:location,
    //   pincode:pincode,
    //   state:state,
    //   sports:sports,
    //   features:features,
    //   slots:slots,
    //   turftype:turftype,
    //   imagefile:imagefile
    // };
    // Turf.updateOne({email:email},updateTurf, function (err, turf){
    //   console.log(turf)
    //   if(err){
    //     console.log(err);
    //   }else{
    //     res.redirect('/admin/dashboard');
    //   }
    // })
  } else {
    res.redirect('/admin');
  }
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
        console.log(imageToDelete, imagefiles)
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
    res.redirect('/admin');
  }
});

router.route('/update').post((req, res) => {
  console.log("--------------------------------------------Console-------------------------------",req.body);
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
    operatinghoursQuery = {
      '$set':{
        'operatinghours.$.date': date,
        'operatinghours.$.hours': operatinghours
      }
    }
    Turf.findOne({ 'operatinghours.date': date })
      .then((turf) => {
        // console.log("\n Turf:"+turf);
        // console.log("\n operatinghours:"+operatinghours,"\n turf data:"+turf.operatinghours)
        if (turf!=null) {
          Turf.updateOne(
            { 'operatinghours.date': date },
            operatinghoursQuery,
            function (err, turf) {
              if (err) {
                console.log(err);
              }
            }
          );
        } else {
          Turf.updateOne(
            { email: email },
            {
              $push: {
                operatinghours: {
                  'date': date,
                  'hours': operatinghours,
                },
              },
            },
            function (err, turf) {
              if (err) {
                console.log(err);
              }
            }
          );
        }
      })
      .catch((err) => res.status(400).json('Error: ' + err));
    console.log("operating hours updated")
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
        featureName = reqname.split('_')[1];
        features.push({
          name: featureName,
          value: Array.isArray(body[reqname]) ? true : false,
        });
      }
      
      if (reqname.startsWith('type')) {
        let turfType = reqname.split('type_')[1];
        var turfId = body[`id_${turfType}`];
        var var1 = String(body[`area_${turfType}`]).trim();
        var var2 = String(body[`rate_${turfType}`]).trim();
        turfDataQuery = {
          '$set':{
            'turftype.$.name': turfType,
            'turftype.$.area': Number(var1),
            'turftype.$.rate': Number(var2)
          }
        }
        if (turfId!=`-1`) {
          Turf.updateOne(
            {
              email: email,
              'turftype._id': turfId,
            },
            turfDataQuery,
            function (err, turf) {
              if (err) {
                console.log(err);
              }
            }
          );
        }else{
          Turf.updateOne(
            { email: email },
            {
              $push: {
                turftype: {
                  name: turfType,
                  area: Number(body[`area_${turfType}`]),
                  rate: Number(body[`rate_${turfType}`]),
                  bookedhours: [
                    {
                      date: date,
                      hours: [],
                    },
                  ],
                },
              },
            },
            function (err, turf) {
              if (err) {
                console.log(err);
              }
            }
          );
        }
        // turftype.push(
        //   turfId != `-1`
        //     ? {
        //         _id: turfId,
        //         name: turfType,
        //         area: Number(var1),
        //         rate: Number(var2),
        //       }
        //     : {
        //         name: turfType,
        //         area: Number(var1),
        //         rate: Number(var2),
        //       }
        // );
        console.log(var1+","+var2,"id:",turfId);
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
      features:features,
      slots:slots,
      imagefile:imagefile
    };
    Turf.updateOne({email:email},updateTurf, function (err, turf){
      console.log(turf)
      if(err){
        console.log(err);
      }else{
        res.redirect('/admin/dashboard');
      }
    })
  } else {
    res.redirect('/admin');
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
