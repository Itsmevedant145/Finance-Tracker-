const moongose = require('mongoose'); // ✅ Fixed typo 'moongose' to 'mongoose'
const ExpenseSchema = new moongose.Schema({
    userId : {
        type: moongose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    icon : {
        type: String,
    },
    category : {
        type: String,
        required: true
    },
    amount : {
        type: Number,
        required: true
    },
    date : {
        type: Date,
        default: Date.now
    },}
, {
    timestamps: true
});
module.exports = moongose.model('Expense', ExpenseSchema); // ✅ Fixed typo 'moongose' to 'mongoose'
