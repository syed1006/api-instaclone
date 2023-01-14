const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    image:{
        data: Buffer,
        contentType: String
    },
    user: {
        type: Schema.Types.ObjectId
    }
}, {timestamps: true});

const Post = mongoose.model('posts', postSchema);
module.exports = Post;