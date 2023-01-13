const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = async (req, res, next) => {
    if(req.cookies.token) {
        let decoded = jwt.decode(req.cookies.token)
        if (!decoded) {
            return res.clearCookie('token').redirect('/');
        }
        let user = await User.findOne({_id: decoded.id});
        if (!user) {
            return res.clearCookie('token').redirect('/');
        }
        req.user = user

        next()
    } else {
        if(req.url !== '/')
            return res.redirect('/admin');
        return res.render('login', {title: 'Login'})
    }
}

module.exports = auth