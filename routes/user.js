const router = require('express').Router();
const bcrypt = require('bcrypt');
let User = require('../models/user.models');
let Turf = require('../models/turf.models');
const { checkPrivilege, sendRegisterMail } = require('./commonutils');
const process = require('process');
var basePath = process.cwd();
const saltRounds = 10;
var createUserErr = null;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

/* -------------------------------------------------------Api calls------------------------------------------------------------------------ */
router.route('/login').post((req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = User.findOne({
    email: email,
  });
  User.findOne({ email: email }, function (err, user) {
    if (bcrypt.compareSync(password, user.password)) {
      req.session.context = {
        isLoggedIn: true,
        privilege: user.privilege,
        user_email: email,
        admin_data: null
      };
      // res.redirect('dashboard');
      res.redirect('/turf/list');
      //res.send([true,serverPrivilege])
    }
    if (err) {
      console.log(err);
      res.redirect('admin');
    }
  });
});

router.route('/add').post((req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const mobile = req.body.mobile;
  const privilege = req.body.privilege;
  console.log(req.body)
  const newUser = new User({ name, email, mobile, privilege });
  User.find({email:email},function(err,turf){
    if(turf.length>0){
      req.session.context.error = 'User Already Registered';
      res.redirect('register')
    }
  })
  
  newUser
    .save()
    .then(() => {
      sendRegisterMail(email,name);
      if (req.session.hasOwnProperty('context')) {
        if (req.session.context.hasOwnProperty('error')) {
          req.session.context.error=null
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
  res.render('admin/index');
});

router.route('/register').get((req, res) => {
  let err;
  if(req.session.hasOwnProperty('context')){
    if(req.session.context.hasOwnProperty('error')){
      if(req.session.context.error!=null){
        err = req.session.context.error
      }
    }
  }
  
  if (checkPrivilege(req)) {
    if (req.session.context.privilege == 'admin') {
      res.render('create-new', { context: true, err:err });
    }
  } else {
    res.render('create-new', { context: null, err:err });
  }
});

router.route('/dashboard-edit/:id').get((req, res) => {
  console.log(req.params.id);
  if (checkPrivilege(req)) {
    Turf.find({ _id: req.params.id }, function (err, turf) {
      if (turf.length) {
        let email = req.session.context.user_email;
        console.log(turf,req.session.context.user_email,req.session.context.privilege)
        console.log(req.session.context.privilege == 'manager',
        turf[0].email == req.session.context.user_email,
      req.session.context.privilege == 'admin')
        if (
          (req.session.context.privilege == 'manager' &&
            turf[0].email == email) ||
          req.session.context.privilege == 'admin'
        ) {
          let context = {
            date: new Date().toISOString().slice(0, 10),
            user_email: email,
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
      } else{
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
      user_email:
        context.privilege == 'manager' ? context.user_email : null,
      privilege: context.privilege
    };
    res.render('admin/dashboard', { context: usercontext });
  } else {
    res.redirect('/admin');
  }
});

router.route('/booking').get((req, res) => {
  if (checkPrivilege(req)) {
    let context = req.session.context;
    email = context.user_email;
    Turf.findOne({ email: email }, function (err, turf) {
      let context = {
        date: new Date().toISOString().slice(0, 10),
        user_email: email,
      };
      if (turf) {
        res.render('admin/booking', { turf: turf, context: context });
      } else {
        res.redirect('admin/dashboard');
      }
    });
  }
  else {
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
