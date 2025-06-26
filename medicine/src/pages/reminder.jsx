import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import "../styling/reminder.css";

const Reminder = () => {
  const [medicine, setMedicine] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [notes, setNotes] = useState("");
  const [reminders, setReminders] = useState([]);

  const fetchReminders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/reminders", {
        withCredentials: true,
      });
      setReminders(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch reminders");
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!medicine || !selectedDate) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/add-reminder",
        { medicine, time: selectedDate, notes },
        { withCredentials: true }
      );
      alert("Reminder saved!");
      setMedicine("");
      setSelectedDate(null);
      setNotes("");
      fetchReminders();
    } catch (err) {
      console.error(err);
      alert("Failed to save reminder");
    }
  };

  const deleteReminder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reminder?"))
      return;
    try {
      await axios.delete(`http://localhost:5000/delete-reminder/${id}`, {
        withCredentials: true,
      });
      alert("Reminder deleted!");
      fetchReminders();
    } catch (err) {
      console.error(err);
      alert("Failed to delete reminder");
    }
  };

  return (
    <div>
      <div className="calendar-container">
        <div className="calendar-card">
          <h2 className="calendar-heading">Set a Reminder</h2>
          <form className="calendar-form" onSubmit={handleSubmit}>
            <label>
              Medicine Name
              <input
                type="text"
                value={medicine}
                onChange={(e) => setMedicine(e.target.value)}
                required
              />
            </label>

            <label>
              Choose Date & Time
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                showTimeSelect
                dateFormat="Pp"
                placeholderText="Click to select date and time"
                className="datepicker-input"
              />
            </label>

            <label>
              Notes
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., After dinner"
              />
            </label>

            <button type="submit" className="calendar-button">
              Save Reminder
            </button>
          </form>
        </div>
      </div>

      <div className="reminder-list">
        <h3>Your Reminders:</h3>
        {reminders.length === 0 ? (
          <p>No reminders set yet.</p>
        ) : (
          reminders.map((reminder) => (
            <div key={reminder._id} className="reminder-item">
              <div className="reminder-content">
                <strong>{reminder.medicine}</strong>
                <small>{new Date(reminder.time).toLocaleString()}</small>
                {reminder.notes && <small>Note: {reminder.notes}</small>}
              </div>
              <FaTrash
                className="delete-icon"
                onClick={() => deleteReminder(reminder._id)}
              />
            </div>
          ))
        )}
      </div>
      <footer className="footer">
        <div className="footer-main">
          <div className="footer-section">
            <h3>MedTrack</h3>
            <p>
              Helping you stay consistent, aware, and on track with your health
              every day.
            </p>
          </div>
          <div className="footer-section">
            <h4>Explore</h4>
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Med Guide</a>
              </li>
              <li>
                <a href="#">Reminders</a>
              </li>
              <li>
                <a href="#">Search</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: support@medtrack.com</p>
            <p>Phone: +91-12345-67890</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 MedTrack | Designed with care.</p>
        </div>
      </footer>
    </div>
  );
};

export default Reminder;
