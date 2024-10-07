const mongoose = require('mongoose');


const profileSchema = new mongoose.Schema({
    email: { type: String, required: true },
    gender: { type: String },
    address: { type: String },
    pincode: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to User
});





const Profile = mongoose.model('profile', profileSchema);
module.exports = Profile;