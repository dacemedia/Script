const Plan = require('../models/planModel');
const Admin = require("../models/adminModel");
const verifyAdminAccess = (req, res, next) => { next(); };

// Load Plan
const loadPlan = async (req, res) => {
    try {
        const plan = await Plan.find({});
        res.render('addPlan', { plan: plan });
    } catch (error) {
        console.log(error.message);
    }
}

// Add Plan
const addPlan = async (req, res) => {
    try {
        let loginData = await Admin.findById({_id:req.session.user_id});
        if (loginData.is_admin == 1) {
            const planData = new Plan({
                points: req.body.points,
                price:req.body.price
            });
            const savePlan = await planData.save();
            const plan = await Plan.find({});
            if (savePlan) {
                res.render('addPlan', { message: "Plan Added Succesfully..!!", plan: plan });
            }
            else {
                res.render('addPlan', { message: "Plan Not Added..!!*" });
            }
        }
        else {
            req.flash('error', 'You have no access to add Plan , You are not super admin !! *');
            return res.redirect('back');
        }
    } catch (error) {
        console.log(error.message);
    }
}

// View Plan
const viewPlan = async (req, res) => {
    try {
        await verifyAdminAccess(req, res, async () => {
            let loginData = await Admin.findById({_id:req.session.user_id});
            const allPlan = await Plan.find({}).sort({ updatedAt: -1 });
            if (allPlan) {
                res.render('viewPlan', { plan: allPlan, loginData: loginData });
            }
            else {
                console.log(error.message);
            }
        });
    } catch (error) {
        console.log(error.message);
    }
}

// Edit Plan
const editPlan = async(req,res)=>{
    try {
        const id = req.query.id;
        const editData = await Plan.findById({ _id: id });
        if (editData) {
            res.render('editPlan', { plan: editData});
        }
        else {
            res.render('editPlan', { message: 'Plan Not Added' });
        }
    } catch (error) {
        console.log(error.message);
    }
}

// Update Plan
const updatePlan = async (req, res) => {
    try {
        let loginData = await Admin.findById({_id:req.session.user_id});
        if (loginData.is_admin == 1) {
            const id = req.body.id;
            const currentPlan = await Plan.findById(id);
                const UpdateData = await Plan.findByIdAndUpdate({ _id: id },
                    {
                        $set: {
                            points: req.body.points,
                            price: req.body.price
                        }
                    });
                res.redirect('/view-plan');
        }
        else {
            req.flash('error', 'You have no access to edit plan , You are not super admin !! *');
            return res.redirect('back');
        }
    } catch (error) {
        console.log(error.message);
    }
}

// Delete Plan
const deletePlan = async (req, res) => {
    try {
        const id = req.query.id;
        const delPlan = await Plan.deleteOne({ _id: id });
        res.redirect('/view-plan');
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loadPlan,
    addPlan,
    viewPlan,
    editPlan,
    updatePlan,
    deletePlan
}