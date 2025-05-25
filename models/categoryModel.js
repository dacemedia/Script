const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema ({

    image:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true,
        trim: true
    },
    is_feature:{
        type:Number,
        default:0
    },
    is_active:{
        type:Number,
        default:0
    }
},

{ timestamps: true });

module.exports = mongoose.model('Category',categorySchema);