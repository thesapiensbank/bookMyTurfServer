const router = require('express').Router();
const bcrypt = require('bcrypt')
let Admin = require('../models/admin.models');
const process = require('process');

var basePath = process.cwd();
const saltRounds = 10;

router.route('/login').post((req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    if(bcrypt.compareSync(myPlaintextPassword, hash); // true


})

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
  const name = req.body.name;
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, saltRounds);

  const newUser = new Admin({ name,email,password });
  
  newUser
    .save()
    .then(() => res.json('User Added!'))
    .catch((err) => res.status(400).json('Error: ' + err));

});

module.exports = router;
