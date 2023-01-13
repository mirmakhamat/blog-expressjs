const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { create, login, users, createUser, deleteUser, updateUser, blogs, createBlog, deleteBlog, updateBlog, feedbacks, comments, deleteComment } = require('../controllers/admin');

router.get('/', auth, function(req, res){
    if(req.user.role === 0)
        res.redirect('/admin/users')
    else
        res.redirect('/user/blogs')
});

router.get('/create', create);

router.post('/', login);

router.get('/users', auth, users);

router.post('/users', auth, createUser);

router.post('/users/delete', auth, deleteUser);

router.post('/users/update', auth, updateUser);

router.get('/blogs', auth, blogs);

router.post('/blogs', auth, createBlog);

router.post('/blogs/delete', auth, deleteBlog);

router.post('/blogs/update', auth, updateBlog);

router.get('/feedbacks', auth, feedbacks);

router.get('/comments', auth, comments);

router.post('/comments/delete', auth, deleteComment);


module.exports = router;
