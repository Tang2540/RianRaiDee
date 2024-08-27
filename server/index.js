const express = require("express");
const mongoose = require("mongoose");
const {ObjectId} = require('mongoose').Types
const dotenv = require("dotenv");
const Place = require("./models/places");
const User = require("./models/users");
const Review = require("./models/reviews");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require("bcrypt");
const session = require("express-session");
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

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
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) return done(null, false, { message: "Incorrect username." });

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword)
        return done(null, false, { message: "Incorrect password." });

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
  res.send("Hello user");
});

app.get("/api/place", async (req, res) => {
  const parks = await Place.find({});
  res.send(parks);
});

app.get('/api/place/suggestions', async (req, res) => {
  const { q } = req.query;
  if (q && q.length > 2) {
    try {
      const placeSuggestions = await Place.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { province: { $regex: q, $options: 'i' } }
        ]
      }).limit(5);

      const provinceSuggestions = await Place.distinct('province', {
        province: { $regex: q, $options: 'i' }
      });

      const suggestions = [
        ...provinceSuggestions.slice(0, 5).map(province => ({
          type: 'province',
          name: province
        })),
        ...placeSuggestions.map(place => ({
          type: 'place',
          ...place.toObject()
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
  res.send(user);
})

app.get("/api/place/:id", async (req, res) => {
  const {id} = req.params
  const park = await Place.findById(id);
  const review = await Review.aggregate([
    { $match: { place_id: new ObjectId(id) } },
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
        place_id: 1,
        user_id: 1,
        content: 1,
        ratings: 1,
        "user.username": 1
        // Add other fields you want to include
      }
    }
  ])
  res.send({park:park,review:review});
});

app.post("/api/review/:id", async (req,res)=>{
  const {username,content,ratings} = req.body
  const {id} = req.params
  try{
    const user = await User.findOne({username:username})
    await Review.create({
      place_id: id,
      user_id: user._id,
      content,
      ratings
    })
    const park = await Place.findById(id);
    const review = await Review.aggregate([
      { $match: { place_id: new ObjectId(id) } },
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
          place_id: 1,
          content: 1,
          ratings: 1,
          "user.username": 1
          // Add other fields you want to include
        }
      }
    ])
    res.status(201).send({park:park,review:review})
  } catch (err) {
    res.status(500).send(err)
  }
})

//routes
app.post("/register", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      res.status(400).send('Username or email already exists')
    } else {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      username: req.body.username,
      password: hashedPassword,
    });
    res.status(201).send("User registered successfully");
  }
  } catch (err) {
    if (err.code === 11000) {
      // MongoDB duplicate key error
      res.status(400).send('Username or email already exists');
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
  if (req.isAuthenticated()) {
    res.send({ user: req.user });
    console.log('yes')
  } else {
    res.status(401).send({ message: "Not authenticated" });
  }
});

app.listen((port = 3000), () => {
  console.log("Listening on port " + port);
});
