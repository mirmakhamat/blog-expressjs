const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { blogs, createBlog, deleteBlog, updateBlog } = require('../controllers/user');

router.get('/', auth, function(req, res){
    if(req.user.role === 0)
        res.redirect('/admin/users')
    else
        res.redirect('/user/blogs')
});

router.get('/blogs', auth, blogs);

router.post('/blogs', auth, createBlog);

router.post('/blogs/delete', auth, deleteBlog);

router.post('/blogs/update', auth, updateBlog);

module.exports = router;
