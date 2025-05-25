const mongoose = require('mongoose');
const SettingSchema = mongoose.Schema({

    new_user_reward_points :{
        type:Number,
        default:0
    },
    correct_ans_reward_per_question :{
        type:Number,
        default:0
    },
    penalty_per_question:{
        type:Number,
        default:0
    },
    self_challenge_mode:{
        type:Number,
        default:0
    },
    // self_challenge_points:{
    //     type:Number,
    //     default:0
    // },
    self_challenge_correct_ans_reward_per_question :{
        type:Number,
        default:0
    },
    self_challenge_penalty_per_question :{
        type:Number,
        default:0
    },
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Setting',SettingSchema);