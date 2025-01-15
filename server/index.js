const express = require("express");
const session = require("express-session");
const cors = require("cors");
const connectMongoDB = require('./config/database');
const passport = require('./config/passport');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "your_session_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
connectMongoDB();

// Routes
app.use('/auth', authRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/profile', userRoutes);
app.use('/api/review', reviewRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});