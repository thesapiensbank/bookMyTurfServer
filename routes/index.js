const router = require('express').Router();
// let User = require('../models/user.models');

// app.set('view engine', 'ejs');
router.route('/').get((req, res) => {
    res.render('index');
});

// router.route('/add').post((req, res) => {
//   const username = req.body.username;
//   const newUser = new User({ username });
  
//   newUser
//     .save()
//     .then(() => res.json('User Added!'))
//     .catch((err) => res.status(400).json('Error: ' + err));

// });

module.exports = router;
