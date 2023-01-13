const {model, Schema} = require('mongoose');

const Blog = new Schema({
    title: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    text: String,
    viewed: {
        type: Number,
        default: 0
    },
    img: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updateAt: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: Number,
        default:0
    }
});

module.exports = model('Blog', Blog);