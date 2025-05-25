const mongoose = require('mongoose');
const QuizSchema = mongoose.Schema({

    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    image:{
        type:String
    },
    timer_status:{
        type:Number,
        default:0
    },
    minimum_required_points: {
        type: Number,
        required: true,
        trim: true
    },
    minutes_per_quiz: {
        type: String,
        required: true,
        trim: true
    },
    description:{
        type:String 
    },
    is_active:{
        type:Number,
        default:0
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Quiz',QuizSchema);