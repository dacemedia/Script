const mongoose = require('mongoose');
const MediaSchema = mongoose.Schema({
    type: {
        type: String,
        enum: ['image', 'audio'],
        required: true
    },
    url:{
        type: String,
        required: true
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('Media', MediaSchema);
