const Currency = require('../models/currencyModel');
const admin = require('../models/adminModel');

// Load currency
const currency = async (req, res) => {
    try {
        const currencyData = await Currency.findOne({})
        const selectedCurrency = currencyData ? currencyData.currency : "";

        return res.render('currency', { selectedCurrency });
    } catch (error) {
        console.error('Error fetching currency:', error);
    }
}

// Add currency
const currencydata = async (req, res) => {
    try {
        let loginData = await admin.findById({_id:req.session.user_id});
        if (loginData.is_admin == 1) {
            const findCurrency = await Currency.findOne({});
            if(!findCurrency){
                const currencyData = Currency.create({currency: req.body.currency});
                return res.redirect('back');
            }
            else{
                const currencyData = await Currency.updateOne({ currency: req.body.currency });
                return res.redirect('/dashboard');
            }
        } else {
            req.flash('error', 'You have no access to change currency , You are not super admin !! *');
            return res.redirect('back');
        }
    } catch (error) {
        console.error('Error fetching currency :', error);
    }
}

module.exports = {
    currency,
    currencydata
}