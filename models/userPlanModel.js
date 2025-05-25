const mongoose = require("mongoose");
const UserPlanSchema = new mongoose.Schema ({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan'
    },
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

module.exports = mongoose.model('UserPlan',UserPlanSchema);