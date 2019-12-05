var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 0.0,
        max: 5.0,
        required: true
    },
    comment: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
});

var albumSchema = new mongoose.Schema({
    artist: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        min: 0,
        max: 2019,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    PicURL: {
        type: String
    },
    reviews: [reviewSchema]
});

var Album = mongoose.model('Album', albumSchema);
var Review = mongoose.model('Review', reviewSchema);
module.exports = {
    Album: Album,
    Review: Review
};