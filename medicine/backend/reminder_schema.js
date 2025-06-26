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
});

const Reminder = mongoose.model("Reminder", reminderSchema);
export default Reminder;
