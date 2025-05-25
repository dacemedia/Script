const mongoose = require("mongoose");
const bannerSchema = new mongoose.Schema ({

    // title:{
    //     type:String,
    //     required:true
    // },
    image:{
        type:String,
        required:true
    },
    quizId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    },
    is_active:{
        type:Number,
        default:0
    }
},

{ timestamps: true });

module.exports = mongoose.model('Banner',bannerSchema);
