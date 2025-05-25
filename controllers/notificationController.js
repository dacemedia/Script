const Notification = require("../models/notificationModel");
const common_Notification = require("../models/commonNotificationModel");
const Admin = require("../models/adminModel");
const admin = require('../config/firebase');
require('dotenv').config();

// Load notification
const loadNotification = async (req, res) => {
    try {
        res.render('addNotification');
    } catch (error) {
        console.log(error.message);
    }
}

// Add notification
const addNotification = async (req, res) => {
    try {
        let loginData = await Admin.findById({_id:req.session.user_id});
        if (loginData.is_admin == 1) {
            const nottificationData = new common_Notification({
                title: req.body.title,
                description: req.body.description
            });
            const saveNotification = await nottificationData.save();

            const findAllToken = await Notification.find();
            const registrationTokensSet = new Set();
                findAllToken.forEach((user) => {
                    if (user.registrationToken) {
                        registrationTokensSet.add(user.registrationToken);
                    }
                });
            const registrationTokens = Array.from(registrationTokensSet);

            if(!registrationTokens.length) {
                res.render('addNotification', { message: 'Notification Sent Successfully..!!' });
            } else {
                const serverKey = process.env.SERVER_KEY; // Replace with your FCM server key
                const deviceTokens = registrationTokens;
                const title = nottificationData.title;
                const body = nottificationData.description;
    
                //sendPushNotifications(serverKey, deviceTokens, title, body);
                sendPushNotification(registrationTokens, title, body);
    
                if (nottificationData) {
                    res.render('addNotification', { message: 'Notification Sent Successfully..!!' });
                }
            }
        }
        else {
            req.flash('error', 'You have no access to send notification , You are not super admin !! *');
            return res.redirect('back');
        }
    } catch (error) {
        console.log(error.message);
    }
}

// Firebase Push Notification to all users
function sendPushNotification(registrationTokens, title, body) {
    const message = {
        notification: {
            title: title,
            body: body
        },
        tokens: registrationTokens
    };
  
    admin.messaging().sendEachForMulticast(message)
        .then((response) => {
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.error('Error sending message:', error);
        });
}


module.exports = {
    loadNotification,
    addNotification
}