const express = require('express');
const router = express.Router();

const Blog = require('../models/blog');


router.get('/', async function(req, res, next) {
  const blogs = await Blog.find({status: 1}).sort({viewed: -1}).limit(3).populate('author').lean();
  res.render('index', { title: 'Main page', path: '/', data: blogs});
});

module.exports = router;
