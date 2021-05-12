const router = require('express').Router();
const bcrypt = require('bcrypt');
let User = require('../models/user.models');
let Turf = require('../models/turf.models');
const { isAdmin, isManager } = require('./commonutils');
const process = require('process');

var basePath = process.cwd();
const saltRounds = 10;

let serverPrivilege = null;

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
      };
      res.redirect('dashboard');
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
  const password = bcrypt.hashSync(req.body.password, saltRounds);
  const privilege = req.body.privilege;
  // const turfid = req.body.turfid
  const newUser = new User({ name, email, password, privilege });

  newUser
    .save()
    .then(() => res.redirect('/admin/dashbaord'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

/* -------------------------------------------------------HTTP calls------------------------------------------------------------------------ */
router.route('/').get((req, res) => {
  res.render('admin/index');
});

router.route('/dashboard').get((req, res) => {
  if (isAdmin(req)) {
    let context = req.session.context;
    email = context.user_email;
    Turf.findOne({ email: email }, function (err, turf) {
      let context = {
        date: new Date().toISOString().slice(0, 10),
        user_email: email,
      };
      if (turf) {
        let turfNames = [];
        for (let i = 0; i < turf.turftype.length; i++) {
          turfNames.push(turf.turftype[i].name);
        }
        res.render('admin/dashboard_update', { turf: turf, context: context, turfNames:turfNames });
      } else {
        res.render('admin/dashboard', { context: context });
      }
    });
  }
  else {
    res.redirect('/admin');
  }
});

router.route('/booking').get((req, res) => {
  if (isAdmin(req)) {
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
