const fs = require("fs");
const path = require('path')
const userimages = path.join('./public/assets/userImages/');
const verifyAdminAccess = (req, res, next) => { next(); };
const Quiz = require("../models/quizModel");
const Questions = require("../models/questionsModel");
const Admin = require("../models/adminModel");
const Category = require("../models/categoryModel");

// Load Quiz
const loadQuiz= async (req, res) => {
    try {
        const category = await Category.find();
        res.render('addQuiz',{category : category});
    } catch (error) {
        console.log(error.message);
    }
}

// Add Quiz
const addQuiz = async(req,res)=>{
    try {
        let loginData = await Admin.findById({_id:req.session.user_id});
        if (loginData.is_admin == 1) {
            const QuizData = new Quiz({
                categoryId: req.body.categoryId,
                name: req.body.name,
                image:req.file.filename,
                points_require_to_play:req.body.points_require_to_play,
                timer_status:req.body.timer_status == "on" ? 1 : 0,
                minutes_per_quiz:req.body.minutes_per_quiz,
                minimum_required_points:req.body.minimum_required_points,
                description: req.body.description,
                is_active: req.body.is_active == "on" ? 1 : 0
            });
            const saveQuiz = await QuizData.save();
            res.redirect('/view-quiz')
        }
        else {
            req.flash('error', 'You have no access to add Quiz , You are not super admin !! *');
            return res.redirect('back');
        }
    } catch (error) {
        console.log(error.message);
    }
}

// View Quiz
const viewQuiz = async(req,res)=> {
    try {
        await verifyAdminAccess(req, res, async () => {
            let loginData = await Admin.findById({_id:req.session.user_id});
            const QuizData = await Quiz.find().populate('categoryId').sort({updatedAt: -1});
            const QuestionData = await Questions.find().populate('quizId');
            res.render('viewQuiz',{quiz:QuizData,loginData: loginData,question:QuestionData});
        });
    } catch (error) {
        console.log(error.message);
    }
}

// Edit Quiz
const editQuiz = async(req,res)=>{
    try {
        const id = req.query.id;
        const category = await Category.find();
        const editData = await Quiz.findById({ _id: id }).populate('categoryId');
        if (editData) {
            res.render('editQuiz', { editquiz: editData,category:category});
        }
        else {
            res.render('editQuiz', { message: 'Quiz Not Added' });
        }
    } catch (error) {
        console.log(error.message);
    }
}

// Update Quiz
const UpdateQuiz = async(req,res)=>{
    try {
        let loginData = await Admin.findById({_id:req.session.user_id});
            if (loginData.is_admin == 1) {
                const id = req.body.id;
                const currentQuiz = await Quiz.findById(id);
                if (req.file) {
                    if (currentQuiz) {
                        if (fs.existsSync(userimages + currentQuiz.image))
                            {
                                fs.unlinkSync(userimages + currentQuiz.image)
                            }
                    }
                    const UpdateData = await Quiz.findByIdAndUpdate({ _id: id }, 
                        { $set: { 
                            categoryId: req.body.categoryId,
                            name: req.body.name,
                            image:req.file.filename,
                            points_require_to_play:req.body.points_require_to_play,
                            timer_status:req.body.timer_status == "on" ? 1 : 0,
                            minutes_per_quiz:req.body.minutes_per_quiz,
                            minimum_required_points:req.body.minimum_required_points,
                            description: req.body.description
                        }
                        });
                    res.redirect('/view-quiz');
                }
                else {
                    const UpdateData = await Quiz.findByIdAndUpdate({ _id: id }, 
                        { $set: { 
                            categoryId: req.body.categoryId,
                            name: req.body.name,
                            points_require_to_play:req.body.points_require_to_play,
                            timer_status:req.body.timer_status == "on" ? 1 : 0,
                            minutes_per_quiz:req.body.minutes_per_quiz,
                            minimum_required_points:req.body.minimum_required_points,
                            description: req.body.description
                        }
                    });
                    res.redirect('/view-quiz');
                }
            }
            else {
                req.flash('error', 'You have no access to edit quiz , You are not super admin !! *');
                return res.redirect('back');
            }
    } catch (error) {
        console.log(error.message);
    }
}

// Delete Quiz
const deleteQuiz = async(req,res)=>{
    try {
        const id = req.query.id;
        const currentQuiz = await Quiz.findById(id);
        if (currentQuiz) {
            if (fs.existsSync(userimages + currentQuiz.image))
            {
                fs.unlinkSync(userimages + currentQuiz.image)
            }
        }
        const delBanner = await Quiz.deleteOne({ _id: id });
        res.redirect('/view-quiz');
    } catch (error) {
        console.log(error.message);
    }
}

// Active status
const activeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const status = await Quiz.findById({_id:id});
        const is_active = req.body.is_active ? req.body.is_active : "false";
        if (!status) {
            return res.sendStatus(404);
        }
        status.is_active = !status.is_active;
        await status.save();
        res.redirect('/view-quiz');
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

module.exports = { loadQuiz, addQuiz, viewQuiz, editQuiz, UpdateQuiz, deleteQuiz, activeStatus }