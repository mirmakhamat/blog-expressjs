const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.get('/', async function(req, res, next) {
  const users = await User.find({}).lean();
  res.render('team', { title: 'Authors', path: '/team', data:users });
});

module.exports = router;
