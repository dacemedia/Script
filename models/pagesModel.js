const mongoose = require("mongoose");
const pagesSchema = new mongoose.Schema ({

    terms_and_conditions:{
        type:String,
        required:true
    },
    privacy_policy:{
        type:String,
        required:true
    },
    about_us:{
        type:String,
        required:true
    }
},

{ timestamps: true });

module.exports = mongoose.model('Page', pagesSchema);