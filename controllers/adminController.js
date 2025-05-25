const sha256 = require("sha256");
const fs = require("fs");
const path = require('path')
const userimages = path.join('./public/assets/userImages/');
const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const Questions = require("../models/questionsModel");
const Category = require("../models/categoryModel");
const Quiz = require("../models/quizModel");

const verifyAdminAccess = (req, res, next) => { next(); };

// Load login page
const loginLoad = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

// Login
const login = async (req, res) => {
    try {
        const password = sha256.x2(req.body.password);
        const email = req.body.email;
        console.log('Login attempt:', { email, enteredPassword: req.body.password, hashedPassword: password });
        const AdminData = await Admin.findOne({ email: email, password: password });
        console.log('AdminData found:', AdminData);
        const AdminsWithEmail = await Admin.find({ email: email });
        console.log('Admins with entered email:', AdminsWithEmail);
        if (AdminData) {
            req.session.user_id = AdminData._id;
            res.redirect('/dashboard');
        }
        else {
            res.render('login', { message: "Email and Passowrd not correct" });
        }

    } catch (error) {
        console.log(error.message);
    }
}

// Load dashboard
const dashboardLoad = async (req, res) => {
    try { 
        await verifyAdminAccess(req, res, async () => {
            const users = await User.find();
            const questions = await Questions.find();
            const categories = await Category.find();
            const feat_categories = await Category.find({ is_feature: 1 })
            const quizzes = await Quiz.find();
            res.render('dashboard', { users: users, questions: questions, categories: categories, quizzes: quizzes,feat_categories:feat_categories });
        });
    } catch (error) {
        console.log(error.message);
    }
}

// Load admin profile
const adminProfile = async (req, res) => {
    try {
        const adminData = await Admin.findById(req.session.user_id);
        if (adminData) {
            res.render('profile', { admin: adminData });
        }
        else {
            console.log(error);
        }
    } catch (error) {
        console.log(error.message);
    }
}

// Edit admin profile
const editProfile = async (req, res) => {
    try {
        const id = req.session.user_id;
        const currentAdmin = await Admin.findById(id);
        if (req.file) {
            if (currentAdmin) {
                if (fs.existsSync(userimages + currentAdmin.image)) {
                    fs.unlinkSync(userimages + currentAdmin.image)
                }
            }
            const updateProfile = await Admin.findByIdAndUpdate(id, { username: req.body.username, phone: req.body.phone, image: req.file.filename });
            if (updateProfile) {
                res.redirect('/dashboard');
            }
        }
        else {

            const updateProfile = await Admin.findByIdAndUpdate(id, { username: req.body.username, phone: req.body.phone });
        }
        res.redirect('/dashboard');


    } catch (error) {
        console.log(error);
    }
}

// Logout
const adminLogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect("/login");
    } catch (error) {
        console.log(error.message);
    }
}

// Change password
const changePassword = async (req, res) => {
    try {
        res.render('changePassword');
    } catch (error) {
        console.log(error.message);
    }
}

// Reset admin password
const resetAdminPassword = async (req, res) => {
    try {
        const oldpassword = sha256.x2(req.body.oldpassword);
        const newpassword = req.body.newpassword;
        const confirmPassword = req.body.cpassword;
        const id = req.session.user_id;
        const admin = await Admin.findOne({ _id: id, password: oldpassword });
        if (admin) {
            if (newpassword == confirmPassword) {
                const securePass = sha256.x2(newpassword);
                const adminInfo = await Admin.findByIdAndUpdate({ _id: id }, { $set: { password: securePass } });
                res.redirect('/dashboard');
            }
            else {
                res.render('changePassword', { message: "Confirm password not matched" });
            }
        }
        else {
            res.render('changePassword', { message: "old password not matched" });
        }
    }
    catch (error) {
        console.log(error.message);
    }
}

// View all users
const viewUsers = async (req, res) => {
    try {
        await verifyAdminAccess(req, res, async () => {
            let loginData = await Admin.findById({_id: req.session.user_id});
            const user = await User.find().sort({ updatedAt: -1 });
            res.render("viewUsers", { users: user, loginData: loginData });
        });
    } catch (error) {
        console.log(error.message);
    }
}

// Change user status
const userStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const status = await User.findById(id);
        if (!status) {
            return res.status(404).json({ success: 0, message: 'User not found' });
        }

        status.active = !status.active;
        await status.save();

        // Return JSON response indicating the new status
        res.status(200).json({ success: 1, active: status.active });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: 0, message: 'Internal server error' });
    }
}

module.exports = {
    loginLoad,
    login,
    dashboardLoad,
    adminProfile,
    editProfile,
    adminLogout,
    changePassword,
    resetAdminPassword,
    viewUsers,
    userStatus
}