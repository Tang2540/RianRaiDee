const express = require('express');
const router = express.Router();
const Review = require('../models/reviews');
const User = require('../models/users');
const Course = require('../models/course');
const { ObjectId } = require('mongoose').Types;

router.post("/:id", async (req, res) => {
  const {username, content, grade, sec, year, publish_date} = req.body;
  const {id} = req.params;
  try {
    const user = await User.findOne({username: username});
    await Review.create({
      course_id: id,
      user_id: user._id,
      content,
      grade,
      sec,
      year,
      publish_date
    });
    
    const course = await Course.findById(id);
    const review = await Review.aggregate([
      { $match: { course_id: new ObjectId(id) } },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          _id: 1,
          user_id: 1,
          course_id: 1,
          content: 1,
          grade: 1,
          sec: 1,
          year: 1,
          publish_date: 1,
          "user.display_name": 1,
          "user.picture": 1
        }
      }
    ]);

    res.status(201).send({course: course, review: review});
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;