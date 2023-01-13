const Blog = require('../models/blog');
const Comment = require('../models/comment');

const blogsView = async (req, res) => {
    const lastBlogs = await Blog.find({status: 1}).sort({createdAt: -1}).limit(5).populate('author').lean();
    let q = req.query.q || null;
    let blogs;
    if(q) {
        let fil = {};
        if (q) fil = {...fil, 'title': { $regex: new RegExp( q.toLowerCase(), 'i')}};
        blogs = await Blog.find({...fil})
            .populate('comments')
            .populate('author')
            .sort({_id:-1})
            .lean()
    } else {
        const randomBlogs = await Blog.aggregate([{$sample: {size: 5}}, {$match: {status: 1}}]);
        blogs = await Blog.populate(randomBlogs, {path:'author'});
    }
    res.render('blogs', {
        title: 'Blog',
        path: '/blog',
        lastBlogs,
        blogs
    });
}
const blogView = async (req, res) => {
    try {
        let _id = req.params.id;
        let blog = await Blog.findOne({_id, status: 1}).populate('author').populate('comments');
        blog.viewed++;
        await blog.save();
        blog.text = blog.text.split('\r\n').join('<br>');
        res.render('blog', { title: blog.title, path: 'blog', blog });
    } catch (e) {
        console.error('error', e)
        return res.redirect('/404')
    }
}

const blogComment = async (req, res) => {
    let _id = req.params.id
    const {name, email, subject, message} = req.body
    const newComment = await new Comment({name, email, subject, message, blog:_id});
    await newComment.save();

    const blog = await Blog.findOne({_id});
    blog.comments.push(newComment._id)
    await blog.save()
    blog.text = blog.text.split('\r\n').join('<br>')
    res.render('blog', {
        title: 'Blog',
        path: '/blog',
        blog: await Blog.findOne({_id}).populate('author').populate('comments').lean()
    });
}

const getAll = async (req, res)=>{
    let quantity = 30
    let next = req.query.next || 1
    next = (next-1)*quantity
    let title = req.query.title || null
    let blogs
    let fil = {}
    if (title) fil = {...fil, 'title': { $regex: new RegExp( title.toLowerCase(), 'i')}}
    blogs = await Blog.find({...fil})
        .populate('comments')
        .populate('author')
        .sort({_id:-1})
        .limit(quantity)
        .skip(next).lean()
    res.status(200).send(blogs)
}

const getLast = async (req, res) => {
    let limit = req.query.limit || 5
    let blogs = await Blog.find({})
        .sort({createdAt: -1})
        .limit(limit)
        .populate('comments')
        .populate('author')
        .lean()
    res.status(200).send(blogs)
}

module.exports = { getAll, getLast, blogsView, blogView, blogComment }