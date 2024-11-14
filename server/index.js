const express = require("express");
const mongoose = require("mongoose");
const {ObjectId} = require('mongoose').Types
const dotenv = require("dotenv");
const Course = require("./models/course");
const User = require("./models/users");
const Review = require("./models/reviews");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require("bcrypt");
const session = require("express-session");
const multer = require('multer');
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
app.use(express.static('public'));

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Use secure cookies in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null,'public/images')
  },
  filename: (req,file,cb) => {
    cb(null, 'file-' + Date.now() + '.' +
    file.originalname.split('.')[file.originalname.split('.').length-1])
  }
})

const upload = multer({
  storage: storage
})

const connectMongoDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error(
        "MONGODB_URI is not defined in the environment variables"
      );
    }
    await mongoose.connect(uri);
    console.log("db connected");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};
connectMongoDB();

// Passport local strategy
passport.use(
  new LocalStrategy(async ( username,password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) return done(null, false, { message: "อีเมลไม่ถูกต้อง" });

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword)
        return done(null, false, { message: "รหัสผ่านไม่ถูกต้อง" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Added Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
},
async function(accessToken, refreshToken, profile, done) {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        username: profile.displayName,
        picture: profile.photos[0].value
        // You might want to handle the case where the username already exists
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.get("/api", (req, res) => {
  res.send("fuck my life");
});

app.get("/api/place", async (req, res) => {
  const courses = await Course.find({});
  res.send(courses);
});

app.get('/api/place/suggestions', async (req, res) => {
  const { q } = req.query;
  if (q && q.length > 2) {
    try {
      const placeSuggestions = await Course.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { course_id: { $regex: q, $options: 'i' } }
        ]
      }).limit(5);

      const suggestions = [
        ...placeSuggestions.map(course => ({
          type: 'course',
          ...course.toObject()
        }))
      ];

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

app.get("/api/profile", async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

app.get("/api/profile/:id",async(req,res)=>{
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
        // Add other fields you want to include
      }
    }
  ]);
  res.send({user:user,reviews:reviews});
})

app.get("/api/place/:id", async (req, res) => {
  const {id} = req.params
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
        "user.picture":1
        // Add other fields you want to include
      }
    }
  ]);
  res.send({course:course,review:review});
});

app.post("/api/review/:id", async (req,res)=>{
  const {username,content, grade,sec,year,publish_date} = req.body
  const {id} = req.params
  try{
    const user = await User.findOne({username:username})
    await Review.create({
      course_id: id,
      user_id: user._id,
      content,
      grade,
      sec,
      year,
      publish_date
    })
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
          course_id: 1,
          content: 1,
          ratings: 1,
          "user.username": 1
          // Add other fields you want to include
        }
      }
    ])

    res.status(201).send({course:course,review:review})
  } catch (err) {
    res.status(500).send(err)
  }
})

//routes
app.post("/register", async (req, res) => {
  const {displayName, email, password} = req.body
  try {
    const existedEmail = await User.findOne({ username: email });
    const existedName = await User.findOne({ display_name: displayName })
    if (existedEmail) {
      res.status(400).send('อีเมลนี้ได้ถูกใช้งานแล้ว')
    }
    else if (existedName) {
      res.status(400).send('ชื่อนี้ถูกใช้งานแล้ว')
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
      // MongoDB duplicate key error
      res.status(400).json({err_msg:'Username or email already exists'});
    } else {
      res.status(500).send('Error registering user');
    }
  }
});

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Authentication failed
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Authentication successful
      return res.json({ message: 'Logged in successfully' });
    });
  })(req, res, next);
});

// Added Google auth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
passport.authenticate('google', {
  access_type: "offline",
  scope: ["email", "profile"],
  failureRedirect: '/login',
  successRedirect: 'http://localhost:5173' // Redirect to your frontend app
})
);

app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send({ message: "Error logging out" });
    }
    res.send({ message: "Logged out successfully" });
  });
});

app.get('/user', (req, res) => {
    console.log('Session:', req.session);
    console.log('User:', req.user);
    console.log('Is Authenticated:', req.isAuthenticated());
  if (req.isAuthenticated()) {
    res.send({ user: req.user });
  } else {
    res.status(401).send({ message: "Not authenticated" });
  }
});

app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.isAuthenticated()) {
    console.log(req.isAuthenticated())
    return res.status(401).json({ error: 'User not authenticated' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  const image = req.file.filename;
  const user = req.user;

  try {
    await User.findByIdAndUpdate(user._id,{picture:image});
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen((port = 3000), () => {
  console.log("Listening on port " + port);
});

