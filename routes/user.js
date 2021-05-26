const router = require('express').Router();
const bcrypt = require('bcrypt');
let User = require('../models/user.models');
let Turf = require('../models/turf.models');
const { checkPrivilege, sendRegisterMail, sendOTP } = require('./commonutils');
const process = require('process');
var basePath = process.cwd();
const saltRounds = 10;
var createUserErr = null;

function generateOtp() {
  min = Math.ceil(1000);
  max = Math.floor(10000);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

/* -------------------------------------------------------Api calls------------------------------------------------------------------------ */

router.route('/logout').get((req,res) => {
  if(checkPrivilege(req)){
    req.session.context.isLoggedIn = false;
    req.session.context.privilege = null;
    console.log(checkPrivilege(req),req.session)
    res.redirect('/admin')
  }else{
    res.redirect('/admin')
  }
})

router.route('/login').post((req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  console.log(req.body);
  User.find({ email: email }, function (err, user) {
    if (user.length) {
      if (user[0].otp == otp) {
        req.session.context = {
          isLoggedIn: true,
          privilege: user[0].privilege,
          user_email: email,
          admin_data: null,
        };
        // res.redirect('dashboard');
        res.redirect('/turf/list');
      }

      //res.send([true,serverPrivilege])
    } else {
      req.session.context = { err: 'OTP Mismatch' };
      res.redirect('/admin');
    }
    if (err) {
      console.log(err);
      res.redirect('/admin');
    }
  });
});

router.route('/otp').post((req, res) => {
  const email = req.body.email;
  User.find({ email: email }, function (err, user) {
    if (user.length) {
      let otp = generateOtp();
      User.updateOne({ email: email }, { otp: otp }, function (err, user, res) {
        if (err == null) {
          // uncomment this line for production
          // sendOTP(email,otp)
          console.log(otp);
        }
        if (err) {
          console.log(err);
        }
      });
      res.send(true);
    } else {
      req.session.context = { err: 'User Not Registered' };
      res.send({ err: req.session.context.err });
    }
    if (err) {
      console.log(err);
    }
  });
});

router.route('/add').post((req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const mobile = req.body.mobile;
  const privilege = req.body.privilege;
  let otp = 0;
  console.log(req.body);
  const newUser = new User({ name, email, mobile, privilege, otp });
  User.find({ email: email }, function (err, turf) {
    if (turf.length > 0) {
      req.session.context.error = 'User Already Registered';
      res.redirect('register');
    }
  });

  newUser
    .save()
    .then(() => {
      sendRegisterMail(email, name);
      if (req.session.hasOwnProperty('context')) {
        if (req.session.context.hasOwnProperty('error')) {
          req.session.context.error = null;
        }
      }
      res.redirect('/admin');
    })
    .catch((err) => {
      console.log(err);
    });
});

/* -------------------------------------------------------HTTP calls------------------------------------------------------------------------ */
router.route('/').get((req, res) => {
  console.log(req.session)
  if (req.session.hasOwnProperty('context')) {
    if (req.session.hasOwnProperty('err')) {
      res.render('admin/index', { err: req.session.context.err });
    }else{
      res.render('admin/index',{err:false});
    }
  } else {
    res.render('admin/index', { err: false });
  }
});

router.route('/register').get((req, res) => {
  let err;
  if (req.session.hasOwnProperty('context')) {
    if (req.session.context.hasOwnProperty('error')) {
      if (req.session.context.error != null) {
        err = req.session.context.error;
      }
    }
  }

  if (checkPrivilege(req)) {
    if (req.session.context.privilege == 'admin') {
      res.render('create-new', { context: true, err: err });
    }
  } else {
    res.render('create-new', { context: null, err: err });
  }
});

router.route('/dashboard-edit/:id').get((req, res) => {
  console.log(req.params.id);
  console.log(req.session.context);
  if (checkPrivilege(req) && req.params.id.length == 24) {
    Turf.find({ _id: req.params.id }, function (err, turf) {
      if (turf.length) {
        let email = req.session.context.user_email;
        console.log(
          turf,
          req.session.context.user_email,
          req.session.context.privilege
        );
        console.log(
          req.session.context.privilege == 'manager',
          turf[0].email == req.session.context.user_email,
          req.session.context.privilege == 'admin'
        );
        if (
          (req.session.context.privilege == 'manager' &&
            turf[0].email == email) ||
          req.session.context.privilege == 'admin'
        ) {
          let date = new Date().toISOString().slice(0, 10);
          let minDate = new Date();
          let operatinghours = turf[0].operatinghours;
          for (let i = 0; i < operatinghours.length; i++) {
            const element = operatinghours[i];
            if(element.date==date){
              minDate.setDate(new Date(date).getDate()+1);
              break;
            }
          }
          minDate = minDate.toISOString().slice(0, 10);
          
          let context = {
            date: date,
            minDate: minDate,
            user_email: email,
            turfid: req.params.id,
          };
          let turfNames = [];
          for (let i = 0; i < turf[0].turftype.length; i++) {
            turfNames.push(turf[0].turftype[i].name);
          }
          res.render('admin/dashboard_edit', {
            turf: turf[0],
            context: context,
            turfNames: turfNames,
          });
        } else {
          res.send('You dont have the privilege');
        }
      } else {
        res.send('No Turf found');
      }
      if (err) {
        console.log(err);
        res.sendStatus(400).json(err);
      }
    });
  } else {
    res.redirect('/admin');
  }
  // res.render('admin/index');
});

router.route('/dashboard').get((req, res) => {
  if (checkPrivilege(req)) {
    let context = req.session.context;
    let usercontext = {
      date: new Date().toISOString().slice(0, 10),
      user_email: context.privilege == 'manager' ? context.user_email : null,
      privilege: context.privilege,
    };
    res.render('admin/dashboard', { context: usercontext });
  } else {
    res.redirect('/admin');
  }
});

router.route('/booking/:id').get((req, res) => {
  // console.log(req.params.id);
  // console.log(req.session.context);
  if (checkPrivilege(req) && req.params.id.length == 24) {
    let id = req.params.id;
    let context = req.session.context;
    email = context.user_email;

    Turf.findOne({ _id: id }, function (err, turf) {
      // console.log(
      //   turf,
      //   req.session.context.user_email,
      //   req.session.context.privilege
      // );
      // console.log(
      //   req.session.context.privilege == 'manager',
      //   turf.email == req.session.context.user_email,
      //   req.session.context.privilege == 'admin'
      // );
      if (turf) {
        if (
          (req.session.context.privilege == 'manager' &&
            turf.email == email) ||
          req.session.context.privilege == 'admin'
        ) {
          let context = {
            date: new Date().toISOString().slice(0, 10),
            user_email: email,
          };

          res.render('admin/booking', { turf: turf, context: context });
        } else {
          res.send('You dont have the privilege');
        }
      } else {
        res.redirect('/admin/dashboard');
      }
    });
  } else {
    res.redirect('/admin');
  }
});

module.exports = router;

/*const express = require('express');
const app = express();
const session = require('express-session');
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));
so before redirection just save the context for the session

app.post('/category', function(req, res) {
    // add your context here 
req.session.context ='your context here' ;
    res.redirect('/');
});
Now you can get the context anywhere for the session. it can get just by req.session.context

app.get('/', function(req, res) {

    // So prepare the context
var context=req.session.context;
    res.render('home.jade', context);
}); */
