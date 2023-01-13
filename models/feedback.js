const {model, Schema} = require('mongoose');

const Feedback = new Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
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

module.exports = model('Feedback', Feedback);