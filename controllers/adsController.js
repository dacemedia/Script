const Ads = require("../models/adsModel");
const Admin = require("../models/adminModel");

// Load ads setting
const loadAds = async (req, res) => {
    try {
        verifyAdminAccess(req, res, async () => {
            const adsdata = await Ads.findOne();
            res.render('addAds',{adsdata : adsdata});
        });
    } catch (error) {
        console.log(error.message);
    }
}

// Add ads setting
const addAdsSetting = async (req, res) => {
    try {
        let loginData = await Admin.findById({_id: req.session.user_id});
        if (loginData.is_admin == 1) {
            const adsRecord = await Ads.find();
            if (adsRecord.length <= 0) {
                const adsData = new Ads({
                    banner_ad: req.body.banner_ad == "on" ? 1 : 0,
                    interstitial_ad: req.body.interstitial_ad == "on" ? 1 : 0,
                    rewarded_video_ad: req.body.rewarded_video_ad == "on" ? 1 : 0,
                    rewarded_points_for_each_video_ads: req.body.rewarded_points_for_each_video_ads
                });

                const saveSetting = await adsData.save();
                if (saveSetting) {
                    res.redirect('back');
                } else {
                    res.render('addAds', { message: "Ads Setting Not Updated" });
                }
            } 
            else if (adsRecord.length > 0) {
                const adsData = await Ads.findOneAndUpdate(
                    { 
                        banner_ad:req.body.banner_ad == "on" ?  1 : 0,
                        interstitial_ad:req.body.interstitial_ad == "on" ?  1 : 0,
                        rewarded_video_ad:req.body.rewarded_video_ad == "on" ?  1 : 0,
                        rewarded_points_for_each_video_ads:req.body.rewarded_points_for_each_video_ads
                    }
                );
                const saveSetting = await adsData.save();
                if (saveSetting) {
                    res.redirect('back');
                } else {
                    res.render('addAds', { message: "Ads Setting Not Updated" });
                }
            }
        } else {
            req.flash('error', 'You have no access to update setting, You are not a super admin!!');
            return res.redirect('back');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const verifyAdminAccess = (req, res, next) => { next(); };

module.exports = {
    loadAds,
    addAdsSetting
}