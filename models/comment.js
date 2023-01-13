const {model, Schema} = require('mongoose');

const Comment = new Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    blog: {
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    },
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

module.exports = model('Comment', Comment);