const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question_title: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    audio:{
        type: String
    },
    question_type: {
        type: String,
        required: true
    },
    option: {
        a: {
            type: String
        },
        b: {
            type: String
        },
        c: {
            type: String
        },
        d: {
            type: String
        }
    },
    answer: {
        type: String,
        required: true
    },
    user_answer: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});

const quizDetailSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    },
    questionDetails: [questionSchema], // Array of question objects
    total_questions: {
        type: Number
    },
    correct_answers: {
        type: Number
    },
    wrong_answers: {
        type: Number
    },
    score: {
        type: Number
    }
}, { timestamps: true });

module.exports = mongoose.model('UserQuiz', quizDetailSchema);
