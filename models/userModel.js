const mongoose = require("mongoose");
const userSchema = new mongoose.Schema ({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    countryCode:{
        type:String
    },
    phone:{
        type:String
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    points:{
        type:Number
    },
    total_questions:{
        type:Number
    },
    total_correct_answers:{
        type:Number
    },
    total_wrong_answers:{
        type:Number
    },
    is_verified:{
        type:Number,
        default:0
    },
    active:{
        type:Boolean,
        default:true
    }
},
{ timestamps: true });

module.exports = mongoose.model('User',userSchema);
