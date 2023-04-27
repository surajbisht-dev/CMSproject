const mongoose = require('mongoose')
const regSchema = mongoose.Schema({
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    mobile: Number,
    img: String,
    status: { type: String, default: 'Suspended' },
    emailStatus: { type: String, default: 'Not verified' },
    aboutus: String,
    role: { type: String, default: 'public' }
})
module.exports = mongoose.model('reg', regSchema)