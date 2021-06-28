const router = require('express').Router();
let Turf = require('../models/turf.models');
let User = require('../models/user.models');
const { checkPrivilege } = require('./commonutils');
const fs = require('fs');

router.route('/').get((req, res) => {
  Turf.find()
    .then((turf) => res.json(turf))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/list').get((req, res) => {
  console.log(req.session, checkPrivilege(req))
  if (checkPrivilege(req)) {
    let query =
      req.session.context.privilege == 'admin'
        ? {}
        : { email: req.session.context.user_email };
    Turf.find(query, function (err, turf) {
      if (turf) {
        res.render('admin/listview',{turfs:turf})
      } else if (err) {
        console.log(err);
        res.status(400).json('Error: ' + err);
      }
    });
  }else {
    res.redirect('/admin');
  }
});

router.route('/slots').post((req, res) => {
  const date = req.body.date;
  const turftypeID = req.body.turftypeid;
  console.log(req.body)
  if (date && turftypeID) {
    Turf.find(
      { 'turftype._id': turftypeID, 'turftype.bookedhours.date': date },
      function (err, turf) {
        console.log(turf,turf.length)
        if (turf.length) {
          console.log("inside if")
          
          let turfbh = [];
          let oph = [];
          if (Array.isArray(turf[0].turftype)) {
            console.log("inside second l")
            for (let i = 0; i < turf[0].turftype.length; i++) {
              const element = turf[0].turftype[i];
              if (element._id == turftypeID) {
                if (Array.isArray(element.bookedhours)) {
                  for (
                    let j = element.bookedhours.length - 1;
                    j < element.bookedhours.length;
                    j--
                  ) {
                    const bookedhour = element.bookedhours[j];
                    if (bookedhour.date === date) {
                      turfbh = bookedhour.hours;
                      console.log(turfbh);
                      break;
                    }
                  }
                }
              }
            }
          }
          console.log("first loop finish")
          if (Array.isArray(turf[0].operatinghours)) {
            for (
              let k = turf[0].operatinghours.length - 1;
              k < turf[0].operatinghours.length;
              k--
            ) {
              const element = turf[0].operatinghours[k];
              if (element.date === date) {
                oph = element.hours;
                break;
              }
            }
          }
          if(oph!=[]){
            const availableslots = oph.filter((slot) => !turfbh.includes(slot));
            const slots = { slots: availableslots, oph: oph, turfbh: turfbh };
            res.json(slots);
          }else{
            res.send("Operating Hours")
          }
          
        } else if (err) {
          console.log(err);
          // res.status(400).json('Error: ' + err);
        }else{
          res.send("Turf not found")
        }
        
      }
    );
  }
  
});

router.route('/listredirect').post((req, res) => {
  if (checkPrivilege(req)) {
    let query = req.session.context.privilege=='admin'?{}:{email:req.session.context.user_email};
    Turf.find(query, function (err, turf) {
      if (turf) {
        res.render('/admin/listview', { turfs: turf });
      } else if (err) {
        console.log(err);
        // res.status(400).json('Error: ' + err);
      }
    });
  }
});

router.route('/booking').post((req, res) => {
  if (checkPrivilege(req)) {
    console.log(req.body);
    const email = req.session.context.user_email;
    const date = req.body.date;
    const body = req.body;
    let id = req.body.turfid;
    for (var reqname in body) {
      console.log("REQNAME_---------------:",reqname)
      if (reqname.startsWith('id_')) {
        let turfId = reqname.split('id_')[1];
        let bhoursArray = [];
        for (var i in body) {
          if (i.startsWith(turfId + 'bhours_') && Array.isArray(body[i])) {
            let bhours = i.split('bhours_')[1];
            bhoursArray.push(bhours);
          }
        }

        console.log('BHours array: ', bhoursArray, turfId);
        Turf.findOne({ 'turftype._id': turfId }, function (err, turf) {
          var bookedHoursPresent = false;
          console.log('\n--------------------------------------------\n');
          if (turf) {
            
            for (let i = 0; i < turf.turftype.length; i++) {
              for (let j = 0; j < turf.turftype[i].bookedhours.length; j++) {
                console.log(turf.turftype[i].bookedhours[j]);
                if (
                  turf.turftype[i].bookedhours[j].date == date &&
                  turf.turftype[i]._id == turfId
                ) {
                  bookedHoursPresent = true;
                  break;
                }
              }
            }

            console.log('\n--------------------------------------------\n');
            console.log(bookedHoursPresent);
            if (!bookedHoursPresent) {
              Turf.findOne({ _id: id }, function (err, turf) {
                let ophpresent=false;
                if(turf){
                  for (let i = 0; i < turf.operatinghours.length; i++) {
                    const element = turf.operatinghours[i];
                    if(element.date==date){
                      ophpresent = true;
                      break;
                    }
                  }
                  if(!ophpresent){
                    Turf.updateOne({_id:id},{
                      $push: {
                        operatinghours: {
                          'date': date,
                          'hours': operatinghours,
                        },
                      },
                    },function(err,turf){
                      if(err){
                        console.log(err);
                      }
                    })
                  }
                }
              });
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
                  arrayFilters: [
                    { 'outer._id': turfId },
                    { 'inner.date': date },
                  ],
                },
                function (err) {
                  if (err) {
                    console.log(err);
                  }
                }
              );
            }
          }
        });
      }
    }
    console.log("this ran")
    console.log(`/admin/booking/${id}`)
    res.redirect(`/admin/booking/${id}`);
  } else {
    res.redirect('/admin');
  }
});

router.route('/delete').post((req, res) => {
  if (checkPrivilege(req)) {
    console.log(req.body)
    let context = req.session.context;
    let turfid = req.body.turfId;
    // let email = context.user_email;
    let path = (__dirname + '/public/images/');
    Turf.find({ _id: turfid }, function (err, turf) {
      console.log(turf)
      if (turf.length) {
        let imagefiles = turf[0].imagefile;
        let imageToDelete = req.body.imageToDelete;
        console.log(imageToDelete, imagefiles)
        if(imagefiles.includes(imageToDelete)){
          try {
            fs.unlinkSync(path+imageToDelete);
            let deleteQuery = {_id:turfid} ;
            const filteredItems = imagefiles.filter(item => ![imageToDelete].includes(item))
            Turf.findOneAndUpdate(deleteQuery, { imagefile: filteredItems }, {useFindAndModify: false}, function (err, turf){
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
  if (checkPrivilege(req)) {
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
    
    User.findOne({ email: email }, function (err, turf) {
      if (turf) {
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
          .then(() => res.redirect('/turf/list'))
          .catch((err) => res.status(400).json('Error: ' + err));
      } else {
        res.send(`Enter a registered Turf Manager's email`);
      }
    });
    
  } else {
    res.redirect('/admin');
  }
});

router.route('/update').post((req, res) => {
  console.log("--------------------------------------------Console-------------------------------",req.body);
  if (checkPrivilege(req)) {
    const status = req.body.status === 'on' ? true : false;
    const name = req.body.name;
    const email = req.body.email;
    const id = req.body.turfid
    console.log("Turf ID: ",id);
    const website = req.body.website;
    const mobile = req.body.mobile;
    const location = req.body.location.match(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g);
    const address1 = req.body.address1;
    const address2 = req.body.address2;
    const city = req.body.city;
    const pincode = req.body.pincode;
    const state = req.body.state;
    const slots = req.body.slots;
    const ophdate = req.body.dateofoperating;
    console.log("---------------------------------------------------------------------",req.body)
   
    let deletedTurfNames = req.body.delturfNames;
    if(deletedTurfNames!=null){
      deletedTurfNames = deletedTurfNames.includes(',')?deletedTurfNames.split(','):[deletedTurfNames]
    }
    console.log("----------------------Del--------------",deletedTurfNames)
    let operatinghours = req.body.operatinghours;
    if(operatinghours==null){
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Display here: ",operatinghours)
    }
    operatinghours = calculateHours(operatinghours, Number(slots));
    console.log("~~~~~~~~~~~~~~~~~~~~~~This is today operating hours:",operatinghours);
    let sports = [];
    let features = [];
    let body = req.body;
    let date = req.body.date;
    console.log(date);
    let turftype = [];
    // operatinghoursQuery = {
    //   '$set':{
    //     'operatinghours.$.date': ophdate,
    //     'operatinghours.$.hours': operatinghours
    //   }
    // }
    for (let i = 0; i < deletedTurfNames.length; i++) {
      const element = deletedTurfNames[i];
      Turf.updateOne(
        { _id: id },
        {
          $pull: {
            turftype: {
              name: element,
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
    if (ophdate != null) {
      if (ophdate != '') {
        console.log("CHeck date which is not null:",ophdate);
        Turf.updateOne(
          { _id: id },
          {
            $push: {
              operatinghours: {
                date: ophdate,
                hours: operatinghours,
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
    }
    
   
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
        console.log(turfDataQuery)
        if (turfId!=`-1`) {
          console.log("update ran")
          Turf.updateOne(
            {
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
          console.log("push ran")
          Turf.updateOne(
            { _id: id },
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
    Turf.updateOne({_id: id},updateTurf, function (err, turf){
      console.log(turf)
      if(err){
        console.log(err);
      }else{
        res.redirect('/turf/list');
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
