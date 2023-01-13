const express = require('express');
const router = express.Router();

const { blogsView, blogView, blogComment } = require('../controllers/blog');

router.get('/', blogsView);

router.get('/:id', blogView);

router.post('/:id', blogComment);

module.exports = router;
