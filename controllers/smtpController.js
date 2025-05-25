require('dotenv').config();
const verifyAdminAccess = (req, res, next) => { next(); };
const Admin = require("../models/adminModel");
const SMTP = require("../models/smtpModel");

// Load SMTP page
const smtpLoad = async (req, res) => {
    try {
        await verifyAdminAccess(req, res, async () => {
            const smtp = await SMTP.findOne({});
            res.render('smtp', { smtp: smtp });
        });
    } catch (error) {
        console.log(error.message);
    }
}

// Add SMTP
const setSMTP = async (req, res) => {
    try {
        const loginData = await Admin.findById({ _id: req.session.user_id });
        if (loginData.is_admin !== 1) {
            req.flash('error', 'Only super admin can update SMTP settings');
            return res.redirect('back');
        }

        const smtpData = {
            host: req.body.host,
            port: req.body.port, 
            email: req.body.email,
            password: req.body.password,
            encryption: req.body.encryption
        };

        const existingSMTP = await SMTP.findOne();
        if (!existingSMTP) {
            await new SMTP(smtpData).save();
            req.flash('success', 'SMTP Added Successfully');
        } else {
            await SMTP.findOneAndUpdate({}, { $set: smtpData });
            req.flash('success', 'SMTP Updated Successfully');
        }

        res.redirect('back');

    } catch (error) {
        console.log(error.message);
        req.flash('error', 'SMTP Update Failed');
        res.redirect('back');
    }
}

// Export SMTP functions
module.exports = { smtpLoad, setSMTP }