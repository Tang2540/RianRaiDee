const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/users');
const bcrypt = require('bcrypt');

router.post("/register", async (req, res) => {
  const {displayName, email, password} = req.body;
  try {
    const existedEmail = await User.findOne({ username: email });
    const existedName = await User.findOne({ display_name: displayName });
    if (existedEmail) {
      res.status(400).send('อีเมลนี้ได้ถูกใช้งานแล้ว');
    }
    else if (existedName) {
      res.status(400).send('ชื่อนี้ถูกใช้งานแล้ว');
    } 
    else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        username: email,
        display_name: displayName,
        password: hashedPassword,
      });
      res.status(201).send("User registered successfully");
    }
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({err_msg:'Username or email already exists'});
    } else {
      res.status(500).send('Error registering user');
    }
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ message: 'Logged in successfully' });
    });
  })(req, res, next);
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', {
    access_type: "offline",
    scope: ["email", "profile"],
    failureRedirect: '/login',
    successRedirect: 'http://localhost:5173'
  })
);

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send({ message: "Error logging out" });
    res.send({ message: "Logged out successfully" });
  });
});

module.exports = router;