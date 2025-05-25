const fs = require("fs");
const path = require('path')
const userimages = path.join('./public/assets/userImages/');
const verifyAdminAccess = (req, res, next) => { next(); };
const Banner = require("../models/bannerModel");
const Admin = require("../models/adminModel");
const Quiz = require("../models/quizModel");

// Load banner
const loadBanner = async (req, res) => {
    try {
        const quiz = await Quiz.find({});
        res.render('addBanner', { quiz: quiz });
    } catch (error) {
        console.log(error.message);
    }
}

// Add banner
const addBanner = async (req, res) => {
    try {
        let loginData = await Admin.findById({_id:req.session.user_id});
            if (loginData.is_admin == 1) {
                const bannerData = new Banner({
                    image: req.file.filename,
                    quizId: req.body.quizId,
                    is_active: req.body.is_active = "on" ? 1 : 0
                });
                const saveBanner = await bannerData.save();
                const quiz = await Quiz.find({});
                if (saveBanner) {
                    res.render('addBanner', { message: "Banner Added Succesfully..!!", quiz: quiz });
                }
                else {
                    res.render('addBanner', { message: "Banner Not Added..!!*" });
                }
            }
            else {
                req.flash('error', 'You have no access to add banner , You are not super admin !! *');
                return res.redirect('back');
            }
    } catch (error) {
        console.log(error.message);
    }
}

// Utility function to check if an image exists
const imageExists = (imageName) => {
    if (!imageName) return false; // If no image is provided, return false

    // Adjust the path to match where your images are stored
    const imagePath = path.join(__dirname, '../public/assets/userImages/', imageName);
    return fs.existsSync(imagePath);  // Returns true if the image exists
};

// View banner
const viewBanner = async (req, res) => {
    try {
        await verifyAdminAccess(req, res, async () => {
            let loginData = await Admin.findById({_id:req.session.user_id});
            const allBanner = await Banner.find({}).sort({ updatedAt: -1 }).populate('quizId');
            // Check if images exist
            allBanner.forEach(banner => {
                if (!imageExists(banner.image)) {
                    banner.image = 'placeholder.png';  // Set to placeholder if the image doesn't exist
                }
            });
            res.render('viewBanner', { banner: allBanner, loginData: loginData });
        });
    } catch (error) {
        console.log(error.message);
    }
}

// Edit Banner
const editBanner = async (req, res) => {
    try {
        const id = req.query.id;
        const quiz = await Quiz.find({});
        const editData = await Banner.findById({ _id: id });
        if (editData) {
            // Construct the path to the image
            const imagePath = path.join(__dirname, '../public/assets/userImages/', editData.image);
            // Check if the image exists
            if (!editData.image || !fs.existsSync(imagePath)) {
                editData.image = 'placeholder.png'; // Use placeholder if image is missing
            }
            res.render('editBanner', { banner: editData, quiz: quiz });
        } else {
            res.render('editBanner', { message: 'Banner Not Added' });
        }
    } catch (error) {
        console.log(error.message);
    }
}

// Update banner
const UpdateBanner = async (req, res) => {
    try {
        let loginData = await Admin.findById({_id:req.session.user_id});
            if (loginData.is_admin == 1) {
                const id = req.body.id;
                const currentBanner = await Banner.findById(id);
                if (req.file) {
                    if (currentBanner) {
                        if (fs.existsSync(userimages + currentBanner.image)) {
                            fs.unlinkSync(userimages + currentBanner.image)
                        }
                    }
                    const UpdateData = await Banner.findByIdAndUpdate({ _id: id },
                        {
                            $set: {
                                image: req.file.filename,
                                quizId: req.body.quizId
                            }
                        });
                    res.redirect('/view-banner');
                }
                else {
                    const UpdateData = await Banner.findByIdAndUpdate({ _id: id },
                        {
                            $set: {
                                //title: req.body.title,
                                quizId: req.body.quizId
                            }
                        });
                    res.redirect('/view-banner');
                }
            }
            else {
                req.flash('error', 'You have no access to edit banner , You are not super admin !! *');
                return res.redirect('back');
            }
    } catch (error) {
        console.log(error.message);
    }
}

// Delete banner
const deleteBanner = async (req, res) => {
    try {
        const id = req.query.id;
        const currentBanner = await Banner.findById(id);
        if (currentBanner) {
            if (fs.existsSync(userimages + currentBanner.image)) {
                fs.unlinkSync(userimages + currentBanner.image)
            }
        }
        const delBanner = await Banner.deleteOne({ _id: id });
        res.redirect('/view-banner');
    } catch (error) {
        console.log(error.message);
    }
}

// Active status
const activeStatus = async(req,res) => {
    try {
        let loginData = await Admin.findById({_id:req.session.user_id});
        if (loginData.is_admin == 1) {
            const banner = await Banner.findById({_id: req.params.id});
            banner.is_active = banner.is_active == 1 ? 0 : 1;
            await banner.save();
            res.redirect("/view-banner");
            return;
        } else {
            req.flash('error', 'You have no access to change status of Banner, You are not super admin !! *');
            return res.redirect('back');
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    loadBanner,
    addBanner,
    viewBanner,
    editBanner,
    UpdateBanner,
    deleteBanner,
    activeStatus
}