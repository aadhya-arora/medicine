import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import User from "./user_schema.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Reminder from "./reminder_schema.js";
import twilio from "twilio";
const accSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
import cron from "node-cron";
const client = twilio(accSid, authToken);

const sendSMS = (phone, medicine) => {
  client.messages
    .create({
      body: `Reminder! It's time to take your medicine ${medicine}`,
      from: process.env.PHONE_NUMBER,
      to: `+91${phone}`,
    })
    .then((msg) => console.log("Reminder sent"))
    .catch((err) => console.log(err));
};

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Server running...");
});

app.post("/create", (req, res) => {
  let { username, email, phone, password } = req.body;
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return;
    }
    bcrypt.hash(password, salt, async (err, hash) => {
      let createUser = await User.create({
        username,
        email,
        phone,
        password: hash,
      });
      let token = jwt.sign({ email }, process.env.JWT_SECRET);
      res.cookie("token", token, { httpOnly: true });
      res.send(createUser);
    });
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: "Email not found" });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { email: user.email, username: user.username, phone: user.phone },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/verify", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not logged in" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    res.status(200).json({ user: decoded.username });
  });
});

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("Logged out");
});

app.get("/reminders", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not logged in" });

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    try {
      const reminders = await Reminder.find({ userEmail: decoded.email }).sort({
        time: 1,
      });
      res.status(200).json(reminders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch reminders" });
    }
  });
});

app.post("/add-reminder", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not logged in" });

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    const { medicine, time, notes } = req.body;

    try {
      const newReminder = await Reminder.create({
        medicine,
        time,
        notes,
        tel: decoded.phone,
        userEmail: decoded.email,
      });
      res
        .status(200)
        .json({ message: "Reminder saved!", reminder: newReminder });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save reminder" });
    }
  });
});

app.delete("/delete-reminder/:id", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not logged in" });

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    try {
      // Safe deletion: delete only if it belongs to the logged-in user
      const reminder = await Reminder.findOneAndDelete({
        _id: req.params.id,
        userEmail: decoded.email,
      });

      if (!reminder) {
        return res
          .status(404)
          .json({ error: "Reminder not found or not authorized" });
      }

      res.status(200).json({ message: "Reminder deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete reminder" });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
cron.schedule("* * * * *", async () => {
  const now = new Date();
  const reminders = await Reminder.find({
    time: {
      $lte: now,
    },
    sent: { $ne: true },
  });
  reminders.forEach(async (reminder) => {
    try {
      sendSMS(reminder.tel, reminder.medicine);
      reminder.sent = true;
      await reminder.save();
    } catch (err) {
      console.log(err);
    }
  });
});
