const mongoose = require("mongoose");
const pointsSchema = new mongoose.Schema ({

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    points:{
        type:Number
    },
    description:{
        type:String,
        required:true
    }
},

{ timestamps: true });

module.exports = mongoose.model('Points',pointsSchema);