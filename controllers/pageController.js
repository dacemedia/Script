const Admin = require("../models/adminModel");
const Page = require("../models/pagesModel");

// Load Page
const pageLoad = async (req, res) => {
    try {
        const pages = await Page.findOne({});
        res.render('page', { pages: pages });
    } catch (error) {
        console.log(error.message);
    }
}

// Add Pages
const addPages = async (req, res) => {
    try {
        let loginData = await Admin.findById({_id: req.session.user_id});
        if (loginData.is_admin == 1) {
            const addPages = await Page.find();
            if (addPages.length <= 0) {
                const pageData = new Page({
                    terms_and_conditions: req.body.terms_and_conditions,
                    privacy_policy: req.body.privacy_policy,
                    about_us: req.body.about_us
                });
                const savePages = await pageData.save();
                if (savePages) {
                    res.redirect('/pages');
                }
                else {
                    res.render('page', { message: "Pages Not Updated" });
                }
            }
            if (addPages.length > 0) {
                const pageData = await Page.findOneAndUpdate(
                    { $set: { 
                        terms_and_conditions: req.body.terms_and_conditions,
                        privacy_policy: req.body.privacy_policy,
                        about_us: req.body.about_us
                    }});
                const savePages = await pageData.save();
                if (savePages) {
                    res.redirect('/pages');
                }
                else {
                    res.render('page', { message: "Pages Not Updated" });
                }
            }
        }
        else {
            req.flash('error', 'You have no access to update pages , You are not super admin !! *');
            return res.redirect('back');
        }

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    pageLoad,
    addPages
}