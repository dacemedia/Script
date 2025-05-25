const mongoose = require('mongoose');
const QuizSchema = mongoose.Schema({

    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    quizId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    },
    question_type:{
        type: String,
        required: true,
        trim: true
    },
    question_title: {
        type: String,
        required: true,
        trim: true
    },
    image:{
        type: String
    },
    audio:{
        type: String
    },
    option:{
        a: {
            type: String,
            trim: true
        },
        b: {
            type: String,
            trim: true
        },
        c: {
            type: String,
            trim: true
        },
        d: {
            type: String,
            trim: true
        }
    },
    answer:{
        type:String,
        required:true,
        trim: true
    },
    description:{
        type:String 
    },
    is_active:{
        type:Number,
        default:1
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Question',QuizSchema);