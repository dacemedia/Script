const path = require('path');
const fs = require('fs');
const userimages = path.join('./public/assets/userImages/');
const Admin = require('../models/adminModel');
const Media = require('../models/mediaModel');

// Load Media
const loadMedia = async (req, res) => {
    try {
        const media = await Media.find({});
        res.render('uploadMedia');
    } catch (error) {
        console.log(error.message);
    }
}

// Add Media
const addMedia = async (req, res) => {
    try {
        let loginData = await Admin.findById({_id:req.session.user_id});
        if (loginData.is_admin == 1) {
            const mediaFiles = req.files; // Access multiple files
            const mediaPromises = mediaFiles.map(file => {
                const mediaData = new Media({
                    type: file.mimetype.startsWith('image/') ? 'image' : 'audio',
                    url: file.filename
                });
                return mediaData.save(); // Return the promise for saving each media
            });
            await Promise.all(mediaPromises); // Wait for all media to be saved
            res.redirect('/view-media');
        } else {
            req.flash('error', 'You have no access to add Media, You are not super admin !! *');
            return res.redirect('back');
        }
    } catch (error) {
        console.log(error.message);
    }
}

// View Media
const viewMedia = async (req, res) => {
    try {
        const media = await Media.find({});
        res.render('media', { media: media });
    } catch (error) {
        console.log(error.message);
    }
}

// Delete Media
const deleteMedia = async (req, res) => {
    try {
        const id = req.query.id;
        const currentMedia = await Media.findById(id);
        if (currentMedia) {
            if (fs.existsSync(userimages + currentMedia.url)) {
                fs.unlinkSync(userimages + currentMedia.url)
            }
        }
        const delMedia = await Media.deleteOne({ _id: id });
        res.redirect('/view-media');
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loadMedia,
    addMedia,
    viewMedia,
    deleteMedia
}
