const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback');

router.get('/', function(req, res, next) {
  res.render('contact', { title: 'Contact', path: '/contact' });
});

router.post('/', async function(req, res, next) {
  const { name, email, subject, message } = req.body;
  let newFeedback = await new Feedback({name, email, subject, message});
  await newFeedback.save();
  res.render('contact', { title: 'Contact', path: '/contact' });
});

module.exports = router;
