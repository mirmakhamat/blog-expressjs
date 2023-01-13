const {Router} = require('express');
const router = Router();


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');
const aboutRouter = require('./routes/about');
const teamRouter = require('./routes/team');
const contactRouter = require('./routes/contact');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');


router.use('/', indexRouter);
router.use('/users', usersRouter);
router.use('/blog', blogRouter);
router.use('/about', aboutRouter);
router.use('/team', teamRouter);
router.use('/contact', contactRouter);
router.use('/admin', adminRouter);
router.use('/user', userRouter);
router.use('/logout', function(req, res){res.clearCookie('token').redirect('/admin')});
router.use('/404', function(req, res){res.render('404', {title: 'Sahija mavjud emas!'})});

module.exports = router