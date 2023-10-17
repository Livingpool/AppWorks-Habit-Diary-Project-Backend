const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema(
    {
        user: String,
        content: [String], 
        AIresponse: String, 
        createAt:Date,
    },
    {
        timestamps: true // enable createAt field
    }
);

module.exports = mongoose.model('Session', SessionSchema);
