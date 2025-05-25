const Setting = require("../models/settingModel");
const Admin = require("../models/adminModel");

// Load setting
const loadSetting = async (req, res) => {
    try {
        const settingdata = await Setting.findOne();
        res.render('settings', { settingData: settingdata });
    } catch (error) {
        console.log(error.message);
        res.render('settings', { settingData: null, message: "Failed to load settings" });
    }
}

// Add setting
const addSetting = async (req, res) => {
    try {
        let loginData = await Admin.findById({ _id: req.session.user_id });
        if (loginData.is_admin == 1) {
            const settingRecord = await Setting.find();
            if (settingRecord.length <= 0) {
                const settingData = new Setting({
                    new_user_reward_points: req.body.new_user_reward_points,
                    correct_ans_reward_per_question: req.body.correct_ans_reward_per_question,
                    penalty_per_question: req.body.penalty_per_question,
                    self_challenge_mode: req.body.self_challenge_mode == "on" ? 1 : 0,
                    self_challenge_correct_ans_reward_per_question: req.body.self_challenge_correct_ans_reward_per_question,
                    self_challenge_penalty_per_question: req.body.self_challenge_penalty_per_question
                });
                const saveSetting = await settingData.save();
                if (saveSetting) {
                    res.redirect('back');
                } else {
                    res.render('settings', { message: "Setting Not Updated" });
                }
            } else {
                const settingData = await Setting.findOneAndUpdate(
                    {},
                    {
                        $set: {
                            new_user_reward_points: req.body.new_user_reward_points,
                            correct_ans_reward_per_question: req.body.correct_ans_reward_per_question,
                            penalty_per_question: req.body.penalty_per_question,
                            self_challenge_mode: req.body.self_challenge_mode == "on" ? 1 : 0,
                            self_challenge_correct_ans_reward_per_question: req.body.self_challenge_correct_ans_reward_per_question,
                            self_challenge_penalty_per_question: req.body.self_challenge_penalty_per_question
                        }
                    },
                    { new: true }
                );
                if (settingData) {
                    res.redirect('back');
                } else {
                    res.render('settings', { message: "Setting Not Updated" });
                }
            }
        } else {
            req.flash('error', 'You have no access to update setting, You are not super admin !! *');
            return res.redirect('back');
        }
    } catch (error) {
        console.log(error.message);
        res.render('settings', { message: "Error updating settings" });
    }
}

module.exports = {
    loadSetting,
    addSetting
}