import mongoose from "mongoose";
const reminderSchema = new mongoose.Schema({
  medicine: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
  },
  tel: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  sent: {
    type: Boolean,
    default: false,
  },
  repeatType: {
    type: String,
    enum: ["none", "daily", "selected"],
    default: "none",
  },
  selectedDays: {
    type: [String],
    default: [],
  },
});

const Reminder = mongoose.model("Reminder", reminderSchema);
export default Reminder;
