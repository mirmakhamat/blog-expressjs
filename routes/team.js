const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('team', { title: 'Authors', path: '/team' });
});

module.exports = router;
