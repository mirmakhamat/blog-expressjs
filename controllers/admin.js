const User = require('../models/user');
const Blog = require('../models/blog');
const Feedback = require('../models/feedback');
const Comments = require('../models/comment');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const create = async (req, res) => {
    let superAdmin = await User.findOne({role: 0}).lean();
    if(superAdmin){
        return res.send('admin uje yest');
    }
    let hashPass = await bcrypt.hash(config.get('password'), 10)
    let newAdmin = await new User({
        name: 'Supper Admin',
        login: config.get('login'),
        mail: 'supper@admin.man',
        password: hashPass,
        role: 0
    })
    await newAdmin.save()
    return res.send('admin yaratildi!')
}

const login = async (req, res) => {
    try {
        let { login, password } = req.body
        if (login && password){
            let user = await User.findOne({login});
            if (!user){
                return res.render('login', {title: 'Login', error: "Bunday login mavjud emas!"});
            }
            const isValid = await bcrypt.compare(password, user.password)
            if(!isValid){
                return res.render('login', {title: 'Login', error: "Noto'g'ri parol kiritildi!"});
            }
            const token = jwt.sign({id: user._id}, config.get("secretKey"), {expiresIn: "1d"})
            let url = '/admin/users'
            if(user.role === 1)
                 url = '/user/blogs'
            return res.cookie('token', token, {maxAge: 60*60*24*1000}).redirect(url);
        }
        res.render('login', {title: 'Login'});
    } catch (e) {
        res.render('login', {title: 'Login'});
        console.error('error', e)
    }
}

const users = async (req, res) => {
    if(req.user.role !== 0) {
        return res.redirect('/admin');
    }
    let users = await User.find({}).lean();
    res.render('admin', {
        title: 'Users',
        data: users,
        path: 'users',
        tableName: 'Foydalanuvchilar ro`yhati',
    })
}

const createUser = async (req, res) => {
    try {
        if(req.user.role !== 0) {
            return res.redirect('/admin');
        }
        let { name, login, mail, password } = req.body

        let users = await User.find({}).lean();
        let options = {
            title: 'Users',
            data: users,
            path: 'users',
            tableName: 'Foydalanuvchilar ro`yhati'
        }
        if (login && password && name && mail){
            let user = await User.findOne({login});
            if (user){
                options.error = "Bunday login mavjud!";
                return res.render('admin', options);
            }
            const hashPass = await bcrypt.hash(password, 10);
            let newUser = await new User({login, password: hashPass, name, mail, role: 1});
            await newUser.save();
            options.data = await User.find({}).lean()
            return res.render('admin', options)
        }
        options.error = "Ma'lumotlar to'liq emas!";
        return res.render('admin', options)
    } catch (e) {
        console.error('error', e)
        return res.redirect('/admin/users');
    }
}

const deleteUser = async (req, res) => {
    if(req.user.role !== 0) {
        return res.redirect('/admin');
    }

    let { id } = req.body
    if(id){
        let user = await User.findOne({_id:id})
        if(user){
            await User.findByIdAndDelete(id)
        }
    }
    return res.redirect('/admin/users');
}

const updateUser = async (req, res) => {
    try {
        if(req.user.role !== 0) {
            return res.redirect('/admin');
        }
        let { name, login, mail, password, _id } = req.body
        if (login && _id && name && mail){
            let user = await User.findOne({_id});
            if (!user){
                return res.redirect('/admin/users');
            }
            let upUser = {}
            if(password){
                upUser.password = await bcrypt.hash(password, 10)
            }
            upUser.login = login
            upUser.name = name
            upUser.mail = mail
            upUser.updateAt = Date.now()
            await User.findByIdAndUpdate(user._id, upUser)
        }
        return res.redirect('/admin/users');
    } catch (e) {
        console.error('error', e)
        return res.redirect('/admin/users');
    }
}

const blogs = async (req, res) => {
    if(req.user.role !== 0) {
        return res.redirect('/admin');
    }
    let blogs = await Blog.find({}).populate('author').lean();
    res.render('admin', {
        title: 'Blogs',
        data: blogs,
        path: 'blogs',
        tableName: 'Postlar ro`yhati'
    })
}

const createBlog = async (req, res) => {
    try {
        if(req.user.role !== 0) {
            return res.redirect('/admin');
        }
        let { title, text, status } = req.body

        let blogs = await Blog.find({}).populate('author').lean();
        let options = {
            title: 'Blogs',
            data: blogs,
            path: 'blogs',
            tableName: 'Blog ro`yhati'
        }
        if(!req.files || !req.files.img){
            options.error = "Ma'lumotlar to'liq emas!";
            return res.render('admin', options);
        }
        if (title && text){
            let file = req.files.img;
            let uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            let filepath = `public/images/${uniquePreffix}_${file.name}`;
            await file.mv(filepath);
            status = status?1:0
            let newBlog = await new Blog({title, text, status, author: req.user._id, img: `/images/${uniquePreffix}_${file.name}`})
            await newBlog.save()
            options.data = await Blog.find({}).populate('author').lean();
            return res.render('admin', options);
        }
        options.error = "Ma'lumotlar to'liq emas!";
        return res.render('admin', options);
    } catch (e) {
        console.error('error', e)
        return res.redirect('/admin/blogs');
    }
}


const deleteBlog = async (req, res) => {
    if(req.user.role !== 0) {
        return res.redirect('/admin');
    }

    let { id } = req.body
    if(id){
        let blog = await Blog.findOne({_id:id})
        if(blog){
            if(fs.existsSync('public' + blog.img)){
                fs.unlinkSync('public' + blog.img);
            }
            await Blog.findByIdAndDelete(id)
        }
    }
    return res.redirect('/admin/blogs');
}

const updateBlog = async (req, res) => {
    try {
        if(req.user.role !== 0) {
            return res.redirect('/admin');
        }
        let { title, status, text, _id } = req.body
        if (title && _id && text){
            status = status?1:0
            let blog = await Blog.findOne({_id});
            if (!blog){
                return res.redirect('/admin/blogs');
            }
            let upBlog = {
                title, text, status, updateAt:Date.now()
            }
            if (req.files){
                if(req.files.img) {
                    let file = req.files.img;
                    let uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    let filepath = `public/images/${uniquePreffix}_${file.name}`;
                    await file.mv(filepath);
                    if(fs.existsSync('public' + blog.img)){
                        fs.unlinkSync('public' + blog.img);
                    }
                    upBlog.img = `/images/${uniquePreffix}_${file.name}`;
                }
            }

            await Blog.findByIdAndUpdate(blog._id, upBlog)
        }
        return res.redirect('/admin/blogs');
    } catch (e) {
        console.error('error', e)
        return res.redirect('/admin/blogs');
    }
}

const feedbacks = async (req, res) => {
    if(req.user.role !== 0) {
        return res.redirect('/admin');
    }
    let feedbacks = await Feedback.find({}).sort({_id: -1}).lean();
    res.render('admin', {
        title: 'Feedbacks',
        data: feedbacks,
        path: 'feedbacks',
        tableName: 'Fikr-mulohazalar ro`yhati'
    })
}

const comments = async (req, res) => {
    if(req.user.role !== 0) {
        return res.redirect('/admin');
    }
    let comments = await Comments.find({}).sort({_id: -1}).populate('blog').lean();
    res.render('admin', {
        title: 'Comments',
        data: comments,
        path: 'comments',
        tableName: 'Commentlar ro`yhati'
    })
}

const deleteComment = async (req, res) => {
    if(req.user.role !== 0) {
        return res.redirect('/admin');
    }

    let { id } = req.body
    if(id){
        let comment = await Comments.findOne({_id:id}).lean();
        if(comment){
            await Comments.findByIdAndDelete(id);
            await Blog.findByIdAndUpdate(
                comment.blog,
                { $pull: { comments: id } },
                {safe: true, multi: false}
            );
        }
    }
    return res.redirect('/admin/comments');
}

module.exports = { create, login, users, createUser, deleteUser, updateUser, blogs, createBlog, deleteBlog, updateBlog, feedbacks, comments, deleteComment }