const mongoose = require("mongoose");
const adsSchema = new mongoose.Schema ({

    banner_ad:{
        type:Number,
        default:0
    },
    interstitial_ad:{
        type:Number,
        default:0
    },
    rewarded_video_ad:{
        type:Number,
        default:0
    },
    rewarded_points_for_each_video_ads:{
        type:Number,
        default:0
    }
},

{ timestamps: true });

module.exports = mongoose.model('Ad',adsSchema);