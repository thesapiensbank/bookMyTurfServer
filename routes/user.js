const router = require('express').Router();
const bcrypt = require('bcrypt');
let User = require('../models/user.models');
const {isAdmin, isManager} = require('./commonutils');
const process = require('process');

var basePath = process.cwd();
const saltRounds = 10;

let serverPrivilege = null;

//Api calls
router.route('/login').post((req, res) => {
  console.log(req);
  const email = req.body.email;
  const password = req.body.password;
  const user = User.findOne({
    email: email,
  });
  User.findOne({ email: email }, function (err, user) {
    if (bcrypt.compareSync(password, user.password)) {
      req.session.context = { isLoggedIn: true, privilege: user.privilege, user_email:email };
      res.redirect('dashboard');
      //res.send([true,serverPrivilege])
    }
  });

  console.log(user.password);
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
    .then(() => res.json('User Added!'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

//HTTP calls

router.route('/').get((req, res) => {
  res.render('admin/index');
  // User.find()
  //     .then((users) => {
  //         let result = []
  //         users.forEach(user => {
  //             result.push(user.username)
  //         });
  //         res.json(result)
  //     })
  //     .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/dashboard').get((req, res) => {
  if (isAdmin(req)) {
    let context = req.session.context;
    email = context.user_email;
    res.render('admin/dashboard',{user_email:email});
  } else if (isManager(req)) {
    let context = req.session.context;
    email = context.user_email;
    res.render('manager/dashboard',{user_email:email});
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
