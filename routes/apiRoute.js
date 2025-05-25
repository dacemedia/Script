const express = require("express");
const api_route = express.Router();
const apiController = require("../controllers/apiController");
const path = require('path');
const passportJwt = require('../config/passport');
const passport = require("passport");
const jwt = require("jsonwebtoken");
const NodeCache = require("node-cache");

// Multer for file uploads
const multer = require("multer");
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/assets/userImages'));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '-' + file.originalname;
    cb(null, name);
  }
});

const upload = multer({ storage: storage });

// Signup
api_route.post('/checkregistereduser', apiController.CheckRegisteredUser);
api_route.post('/usersignup', apiController.Signup);
api_route.post('/signupotp', apiController.GetUserOTP);
api_route.post('/userverification', apiController.UserVerification);

// Signin
api_route.post('/usersignin', apiController.SignIn);
api_route.post("/isVerifyAccount", apiController.isVerifyAccount);
api_route.post("/resendOtp",apiController.resendOtp);

// Forgot Password
api_route.post('/userforgotpassword', apiController.ForgotPassword);
api_route.post('/forgotpasswordotp', apiController.GetForgotPasswordOTP);
api_route.post('/userforgotpasswordverification', apiController.ForgotPasswordVerification);
api_route.post('/userresetpassword', apiController.ChangePassword);

// Edit User Profile
api_route.post('/getuser', passport.authenticate('jwt', { session: false }), apiController.GetUser);
api_route.post('/usereditprofile', passport.authenticate('jwt', { session: false }), upload.single('image'), apiController.EditUser);

// Upload Image
api_route.post('/uploadimage', passport.authenticate('jwt', { session: false }), upload.single('image'), apiController.UploadImage);

// Intro
api_route.post('/getintro',apiController.GetIntro);

// Banner
api_route.post('/getallbanner',apiController.GetBanner);

// Category
api_route.post('/getallcategories',apiController.GetCategories);

// Quizzes
api_route.post('/getallquizzes', (req, res, next) => {
  // Check if the authorization header is present
  if (req.headers.authorization) {
      passport.authenticate('jwt', { session: false })(req, res, next);
  } else {
      // If no token, proceed to the GetQuizzes method without authentication
      next();
  }
}, apiController.GetQuizzes);


// Quiz By Category
api_route.post('/getquizbycategory', (req, res, next) => {
  // Check if the authorization header is present
  if (req.headers.authorization) {
      passport.authenticate('jwt', { session: false })(req, res, next);
  } else {
      // If no token, proceed to the GetQuizzes method without authentication
      next();
  }
}, apiController.GetQuizByCategory);

// Questions
api_route.post('/getallquestions', passport.authenticate('jwt', { session: false }), apiController.GetQuestions);
api_route.post('/getquestionsbyquizid', passport.authenticate('jwt', { session: false }), apiController.GetQuestionsByQuizId);
api_route.post('/getquestionsbycategoryid', passport.authenticate('jwt', { session: false }), apiController.GetQuestionsByCategoryId);

// Favourite Quiz
api_route.post('/addfavouritequiz', passport.authenticate('jwt', { session: false }), apiController.AddFavouriteQuiz);
api_route.post('/getfavouritequiz', passport.authenticate('jwt', { session: false }), apiController.GetFavouriteQuiz);
api_route.post('/removefavouritequiz', passport.authenticate('jwt', { session: false }), apiController.RemoveFavouriteQuiz);

//Self Challange Quiz
api_route.post('/selfchallangequiz', passport.authenticate('jwt', { session: false }), apiController.AddSelfChallangeQuiz);

// FeaturedCategory
api_route.post('/getfeaturedcategory', (req, res, next) => {
  // Check if the authorization header is present
  if (req.headers.authorization) {
      passport.authenticate('jwt', { session: false })(req, res, next);
  } else {
      // If no token, proceed to the GetQuizzes method without authentication
      next();
  }
}, apiController.GetFeaturedCategory);

// Ads Settings
api_route.post('/getadssettings', apiController.GetAdsSettings);

// Points Setting
api_route.post('/getpointssetting', passport.authenticate('jwt', { session: false }), apiController.GetPointsSetting);

// Points Plan
api_route.post('/get_plan', passport.authenticate('jwt', { session: false }), apiController.GetPlans);
api_route.post('/buy_plan', passport.authenticate('jwt', { session: false }), apiController.BuyPlan);
api_route.post('/plan_history', passport.authenticate('jwt', { session: false }), apiController.PlanHistory);

// User Quiz
api_route.post('/startquiz', passport.authenticate('jwt', { session: false }), apiController.StartQuiz);
api_route.post('/quizhistory', passport.authenticate('jwt', { session: false }), apiController.QuizHistory);
api_route.post('/addPoints', passport.authenticate('jwt', { session: false }), apiController.AddPoints);
api_route.post('/getPoints', passport.authenticate('jwt', { session: false }), apiController.GetPoints);

//LeaderBoard 
api_route.post('/leaderboard', passport.authenticate('jwt', { session: false }), apiController.LeaderBoard);
api_route.post('/getuserrank', passport.authenticate('jwt', { session: false }), apiController.GetUserRank);

// Pages
api_route.post('/pages', apiController.getPages);

// Notification
api_route.post('/notifications', passport.authenticate('jwt', { session: false }), apiController.GetNotifications);

module.exports = api_route;
