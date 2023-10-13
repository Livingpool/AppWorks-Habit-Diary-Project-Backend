const mongoose = require('mongoose')

const SessionSchema = new mongoose.Schema(
    {
	    user: String,
	    title: String,
	    messages: [String],
    }, 
    {
        timestamps: true // enable createAt field
    }
)

module.exports = mongoose.model('Session', SessionSchema)