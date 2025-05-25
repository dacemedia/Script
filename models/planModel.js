const mongoose = require("mongoose");
const palnSchema = new mongoose.Schema ({

    points:{
        type:Number,
        default:0,
        required:true
    },
    price:{
        type:Number,
        default:0,
        required:true
    },
},

{ timestamps: true });

module.exports = mongoose.model('Plan',palnSchema);
