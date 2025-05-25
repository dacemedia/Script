const mongoose = require("mongoose");
const favouriteQuizSchema = new mongoose.Schema ({

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    quizId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    }
},

{ timestamps: true });

module.exports = mongoose.model('FavouriteQuiz',favouriteQuizSchema);