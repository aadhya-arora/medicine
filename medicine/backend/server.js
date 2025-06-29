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
    origin: [
      "http://localhost:5173",
      "https://medicine-psi-seven.vercel.app",
      "https://meditrack-ibgj.onrender.com",
      "https://medicine-nmpckp9aq-aadhya-aroras-projects.vercel.app",
    ],
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
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
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

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
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

    const { medicine, time, notes, repeatType, selectedDays } = req.body;

    try {
      const newReminder = await Reminder.create({
        medicine,
        time,
        notes,
        tel: decoded.phone,
        userEmail: decoded.email,
        repeatType,
        selectedDays,
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
let isRunning = false;

cron.schedule("* * * * *", async () => {
  if (isRunning) {
    console.log("Previous cron still running, skipping this cycle.");
    return;
  }
  isRunning = true;

  try {
    const now = new Date();
    const currentDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      now.getDay()
    ];

    // Filter reminders: skip already sent non-repeating ones
    const reminders = await Reminder.find({
      time: { $lte: now },
      $or: [
        { repeatType: { $ne: "none" } },
        { repeatType: "none", sent: false },
      ],
    });

    console.log(`Processing ${reminders.length} reminders at ${now}`);

    await Promise.all(
      reminders.map(async (reminder) => {
        let shouldSend = false;

        if (reminder.repeatType === "daily") {
          shouldSend = true;
        } else if (
          reminder.repeatType === "selected" &&
          Array.isArray(reminder.selectedDays) &&
          reminder.selectedDays.includes(currentDay)
        ) {
          shouldSend = true;
        } else if (reminder.repeatType === "none" && !reminder.sent) {
          shouldSend = true;
        }

        if (shouldSend) {
          try {
            await sendSMS(reminder.tel, reminder.medicine);

            if (reminder.repeatType === "none") {
              reminder.sent = true;
            }
            await reminder.save();

            console.log(
              `Reminder sent to ${reminder.tel} for ${reminder.medicine}`
            );
          } catch (err) {
            console.error("Failed to send reminder:", err);
          }
        }
      })
    );
  } catch (err) {
    console.error("Cron job error:", err);
  } finally {
    isRunning = false;
  }
});
