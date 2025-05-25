const Admin = require("../models/adminModel");
const isLogin = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            const admin = await Admin.findById({ _id: req.session.user_id });
            if (admin) {
                res.locals.user = admin;
                next();
            } else {
                res.redirect('/');
            }
        }
        else {
            res.redirect('/');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            res.redirect('/dashboard');
        } else {
            next();
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = { isLogin, isLogout }