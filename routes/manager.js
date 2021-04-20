const router = require('express').Router();
let Manager = require('../models/manager.models');

router.route('/').get((req, res) => {
  Manager.find()
    .then((manager) => res.json(manager))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const username = req.body.username;
  const description = req.body.description;
  const duration = Number(req.body.duration);
  const date = Date.parse(req.body.date);

  const newManager = new Manager({
    username,
    description,
    duration,
    date,
  });

  newUser
    .save()
    .then(() => res.json('Manager Added!'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

module.exports = router;
