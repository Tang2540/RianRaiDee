const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Review = require('../models/reviews');
const { ObjectId } = require('mongoose').Types;
const upload = require('../config/multer');

router.get("/", async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.send({ user: req.user });
  } else {
    res.status(401).send({ message: "Not authenticated" });
  }
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  const reviews = await Review.aggregate([
    { $match: { user_id: new ObjectId(req.params.id) } },
    {
      $lookup: {
        from: "courses",
        localField: "course_id",
        foreignField: "_id",
        as: "course"
      }
    },
    {
      $unwind: "$course"
    },
    {
      $project: {
        _id: 1,
        course_id: 1,
        content: 1,
        "course.name": 1
      }
    }
  ]);
  res.send({user: user, reviews: reviews});
});

router.post('/changeName', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  const user = req.user;
  const {displayName} = req.body;
  try {
    await User.findByIdAndUpdate(user._id, {display_name: displayName});
    res.send({user: user});
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  const image = req.file.filename;
  const user = req.user;

  try {
    await User.findByIdAndUpdate(user._id, {picture: image});
    res.json({ message: 'Profile picture updated successfully' });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;