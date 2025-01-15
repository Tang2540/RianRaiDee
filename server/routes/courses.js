const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const Review = require('../models/reviews');
const { ObjectId } = require('mongoose').Types;

router.get("/", async (req, res) => {
  const courses = await Course.find({});
  res.send(courses);
});

router.get('/suggestions', async (req, res) => {
  const { q } = req.query;
  if (q && q.length > 2) {
    try {
      const placeSuggestions = await Course.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { course_id: { $regex: q, $options: 'i' } }
        ]
      }).limit(5);

      const suggestions = placeSuggestions.map(course => ({
        type: 'course',
        ...course.toObject()
      }));

      res.send(suggestions);
    } catch (error) {
      console.error("Error querying database:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "An error occurred while fetching suggestions" });
      }
    }
  } else {
    if (!res.headersSent) {
      res.send([]);
    }
  }
});

router.get("/:id", async (req, res) => {
  const {id} = req.params;
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
        course_id: 1,
        user_id: 1,
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
  res.send({course: course, review: review});
});

module.exports = router;
