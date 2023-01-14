const {model, Schema} = require('mongoose');

const User = new Schema({
    name: String,
    mail: String,
    login: String,
    password: String,
    role: Number,
    position: String,
    desc: String,
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
        default:1
    }
});

module.exports = model('User', User);