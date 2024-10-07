const express = require('express');
const User = require('../models/User');
const Profile = require('../models/Profile');
const router = express.Router();





// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser', async (req, res) => {

  
  const { username, phone, profile } = req.body;


  try {

    // Create the user
    const newUser = new User({ username, phone });
    const savedUser = await newUser.save();

    // Create the profile
    const newProfile = new Profile({
      email: profile.email,
      gender: profile.gender,
      address: profile.address,
      pincode: profile.pincode,
      city: profile.city,
      state: profile.state,
      country: profile.country,
      userId: savedUser._id
    });
    const savedProfile = await newProfile.save();

    // Link profile to user
    savedUser.profile = savedProfile._id;
    await savedUser.save();

    res.status(201).json(savedUser);
  }




  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})




// ROUTE 2: Get loggedin User Details using: POST "/api/auth/getAlluser".
router.get('/getAlluser', async (req, res) => {

  try {
    const users = await User.find().populate('profile').exec();
    res.json(users);
  }

  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})


// ROUTE 3: Get particular user by id : GET "/api/auth/getuserbyid".
router.get('/getuserbyid/:id', async (req, res) => {

  const { id } = req.params;
  try {
    const user = await User.findById(id).populate('profile').exec();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  }

  catch (err) {
    res.status(500).json({ error: 'Error retrieving user' });
  }


});


//ROUTE 4 Delete user by id : DELETE "/api/auth/delete".
router.delete('/delete/:id', async (req, res) => {


  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Delete the associated profile
    await Profile.findByIdAndDelete(user.profile);
    // Delete the user
    await User.findByIdAndDelete(id);

    res.json({ message: 'User and profile deleted successfully' });
  }


  catch (err) {
    res.status(500).json({ error: 'Error deleting user' });
  }


})


//ROUTE 5 Update user by id : PATCH "api/auth/update".
router.patch('/update/:id', async (req, res) => {

  const { id } = req.params;
  const { username, phone, profile } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update user fields
    if (username) user.username = username;
    if (phone) user.phone = phone;
    await user.save();
    // If profile data exists, update the profile
    if (profile) {
      const userProfile = await Profile.findById(user.profile);
      if (profile.email) userProfile.email = profile.email;
      if (profile.address) userProfile.address = profile.address;
      if (profile.gender) userProfile.gender = profile.gender;
      if (profile.pincode) userProfile.pincode = profile.pincode;
      if (profile.city) userProfile.city = profile.city;
      if (profile.state) userProfile.state = profile.state;
      if (profile.country) userProfile.country = profile.country;
      await userProfile.save();
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error updating user' });
  }

})












module.exports = router