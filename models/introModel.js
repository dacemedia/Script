const mongoose = require("mongoose");
const introSchema = new mongoose.Schema ({

    title:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    is_active:{
        type:Number,
        default:0
    }
},

{ timestamps: true });

module.exports = mongoose.model('Intro',introSchema);
