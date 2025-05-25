const fs = require("fs");
const path = require('path')
const userimages = path.join('./public/assets/userImages/');
const Payment = require("../models/paymentMethodModel");
const Admin = require("../models/adminModel");

// Load payment method
const loadPayment = async (req, res) => {
    try {
        res.render('addPayment');

    } catch (error) {
        console.log(error.message);
    }
}

// Add payment method
const addPaymentMethod = async (req, res) => {
    try {
        let loginData = await Admin.findById({_id:req.session.user_id});
        if (loginData.is_admin == 1) {
        const payment_method = new Payment({
            name: req.body.name,
            image:req.file.filename,
            is_enable:req.body.is_enable == "on" ? 1 : 0
        });
        const saveMethod = await payment_method.save();
            if (saveMethod) {
                res.redirect('/view-payment-method');
            }
            else {
                res.render('addPayment', { message: "Payment Method Not Added" });
            }
        }
        else {
            req.flash('error', 'You have no access to add payment method , You are not super admin !! *');
            return res.redirect('back');
        }
    } catch (error) {
        console.log(error.message);
    }
}

// View payment method
const viewPaymentMethod = async (req, res) => {
    try {
        let loginData = await Admin.find({});
        const allMethod = await Payment.find({}).sort({updatedAt: -1});
        if (allMethod) {
            res.render('paymentMethod', { paymentMethod: allMethod,loginData: loginData });
        }
        else {
            console.log(error.message);
        }

    } catch (error) {
        console.log(error.message);
    }
}

// Enable or disable payment method
const is_enableStatus = async(req,res)=>{
    try {
        const { id } = req.params;
        const status = await Payment.findById(id);
        const is_enable = req.body.is_enable ? req.body.is_enable : "false";
        if (!status) {
            return res.sendStatus(404);
        }
        status.is_enable = !status.is_enable;
        await status.save();
        res.redirect('/view-payment-method');
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

// Edit payment method
const editPaymentMethod = async (req, res) => {
    try {
        const id = req.query.id;
        const editData = await Payment.findById({ _id: id });
        if (editData) {
            res.render('editPaymentMethod', { payment_method: editData});
        }
        else {
            res.render('editPaymentMethod', { message: 'Category Not Added' });
        }
    } catch (error) {
        console.log(error.message);
    }
}

// Update payment method
const updatePaymentMethod = async(req,res)=>{
    try {
        let loginData = await Admin.findById({_id:req.session.user_id});
            if (loginData.is_admin == 1) {
                const id = req.body.id;
                const currentPayment = await Payment.findById(id);
                if (req.file) {
                    if (currentPayment) {
                        fs.unlinkSync(userimages + currentPayment.image);
                    }
                    const updatemethod = await Payment.findByIdAndUpdate({_id:id},
                        { $set: { 
                            name: req.body.name,
                            image:req.file.filename
                        }});
                    res.redirect('/view-payment-method');
                }
                else{
                    const updatemethod = await Payment.findByIdAndUpdate({_id:id},
                        { $set: { 
                            name: req.body.name
                        }});
                    res.redirect('/view-payment-method');
                }
            }
            else {
                req.flash('error', 'You have no access to edit payment method , You are not super admin !! *');
                return res.redirect('back');
            }
    } catch (error) {
        console.log(error.message);
    }
}

// Delete payment method
const deletePaymentMethod = async(req,res)=>{
    try {
        const id = req.query.id;
        const currentPayment = await Payment.findById(id);
        if (currentPayment) {
            fs.unlinkSync(userimages + currentPayment.image);
        }
        const delpayment = await Payment.deleteOne({ _id: id });
        res.redirect('/view-payment-method');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadPayment,
    addPaymentMethod,
    viewPaymentMethod,
    is_enableStatus,
    editPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod
}