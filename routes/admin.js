const router = require('express').Router();
let Admin = require('../models/admin.models');
const process = require('process');

var basePath = process.cwd();

router.route('/').get((req, res) => {
    res.render('admin/index');
    // Admin.find()
    //     .then((users) => {
    //         let result = []
    //         users.forEach(user => {
    //             result.push(user.username)
    //         });
    //         res.json(result)
    //     })
    //     .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const username = req.body.username;
  const newUser = new User({ username });
  
  newUser
    .save()
    .then(() => res.json('User Added!'))
    .catch((err) => res.status(400).json('Error: ' + err));

});

module.exports = router;
