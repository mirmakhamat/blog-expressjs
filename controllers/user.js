const Blog = require('../models/blog');
const Comments = require('../models/comment');
const fs = require('fs');
const blogs = async (req, res) => {
    if(req.user.role !== 1) {
        return res.redirect('/admin');
    }
    let blogs = await Blog.find({'author': req.user.id}).populate('author').lean();
    res.render('user', {
        title: 'Blogs',
        data: blogs,
        path: 'blogs',
        tableName: 'Postlar ro`yhati'
    })
}
const createBlog = async (req, res) => {
    try {
        if(req.user.role !== 1) {
            return res.redirect('/admin');
        }
        let { title, text, status } = req.body

        let blogs = await Blog.find({'author': req.user.id}).populate('author').lean();
        let options = {
            title: 'Blogs',
            data: blogs,
            path: 'blogs',
            tableName: 'Blog ro`yhati'
        }
        if(!req.files || !req.files.img){
            options.error = "Ma'lumotlar to'liq emas!";
            return res.render('user', options);
        }
        if (title && text){
            let file = req.files.img;
            let uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            let filepath = `public/images/${uniquePreffix}_${file.name}`;
            await file.mv(filepath);
            status = status?1:0
            let newBlog = await new Blog({title, text, status, author: req.user._id, img: `/images/${uniquePreffix}_${file.name}`})
            await newBlog.save()
            options.data = await Blog.find({'author': req.user.id}).populate('author').lean();
            return res.render('user', options);
        }
        options.error = "Ma'lumotlar to'liq emas!";
        return res.render('user', options);
    } catch (e) {
        console.error('error', e)
        return res.redirect('/user/blogs');
    }
}


const deleteBlog = async (req, res) => {
    if(req.user.role !== 1) {
        return res.redirect('/admin');
    }

    let { id } = req.body
    if(id){
        let blog = await Blog.findOne({_id:id})
        if(blog){
            if(fs.existsSync('public' + blog.img)){
                fs.unlinkSync('public' + blog.img);
            }
            for (const comment of blog.comments) {
                await Comments.findByIdAndDelete(comment);
            }
            await Blog.findByIdAndDelete(id)
        }
    }
    return res.redirect('/user/blogs');
}

const updateBlog = async (req, res) => {
    try {
        if(req.user.role !== 1) {
            return res.redirect('/admin');
        }
        let { title, status, text, _id } = req.body
        if (title && _id && text){
            status = status?1:0
            let blog = await Blog.findOne({_id});
            if (!blog){
                return res.redirect('/user/blogs');
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
        return res.redirect('/user/blogs');
    } catch (e) {
        console.error('error', e)
        return res.redirect('/user/blogs');
    }
}

module.exports = {  blogs, createBlog, deleteBlog, updateBlog }