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
  const [repeatType, setRepeatType] = useState("none");
  const [selectedDays, setSelectedDays] = useState([]);
  const [reminders, setReminders] = useState([]);

  const backendUrl = process.env.VITE_BACKEND_URL || "http://localhost:5000";

  const fetchReminders = async () => {
    try {
      const res = await axios.get(`${backendUrl}/reminders`, {
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

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!medicine || !selectedDate) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await axios.post(
        `${backendUrl}/add-reminder`,
        {
          medicine,
          time: selectedDate,
          notes,
          repeatType,
          selectedDays,
        },
        { withCredentials: true }
      );
      alert("Reminder saved!");
      setMedicine("");
      setSelectedDate(null);
      setNotes("");
      setRepeatType("none");
      setSelectedDays([]);
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
      await axios.delete(`${backendUrl}/delete-reminder/${id}`, {
        withCredentials: true,
      });
      alert("Reminder deleted!");
      fetchReminders();
    } catch (err) {
      console.error(err);
      alert("Failed to delete reminder");
    }
  };

  const now = new Date();

  const upcomingReminders = reminders.filter(
    (r) => new Date(r.time) > now && !r.sent
  );
  const previousReminders = reminders.filter(
    (r) => new Date(r.time) <= now || r.sent
  );

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

            <label>
              Repeat
              <select
                value={repeatType}
                onChange={(e) => setRepeatType(e.target.value)}
                className="repeat-select"
              >
                <option value="none">No Repeat</option>
                <option value="daily">Daily</option>
                <option value="selected">Selected Days</option>
              </select>
            </label>

            {repeatType === "selected" && (
              <div className="day-selector">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <label key={day} className="day-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedDays.includes(day)}
                        onChange={() => toggleDay(day)}
                      />
                      {day}
                    </label>
                  )
                )}
              </div>
            )}

            <button type="submit" className="calendar-button">
              Save Reminder
            </button>
          </form>
        </div>
      </div>

      <div className="reminders-wrapper">
        <div className="reminder-column">
          <h3>Upcoming Reminders</h3>
          {upcomingReminders.length === 0 ? (
            <p>No upcoming reminders.</p>
          ) : (
            upcomingReminders.map((reminder) => (
              <div key={reminder._id} className="reminder-item">
                <div className="reminder-content">
                  <strong>{reminder.medicine}</strong>
                  <small>{new Date(reminder.time).toLocaleString()}</small>
                  {reminder.notes && <small>Note: {reminder.notes}</small>}
                  {reminder.repeatType !== "none" && (
                    <small>
                      Repeat:{" "}
                      {reminder.repeatType === "daily"
                        ? "Daily"
                        : Array.isArray(reminder.selectedDays)
                        ? `Selected Days: ${reminder.selectedDays.join(", ")}`
                        : ""}
                    </small>
                  )}
                </div>
                <FaTrash
                  className="delete-icon"
                  onClick={() => deleteReminder(reminder._id)}
                />
              </div>
            ))
          )}
        </div>

        <div className="reminder-column">
          <h3>Previous Reminders</h3>
          {previousReminders.length === 0 ? (
            <p>No previous reminders.</p>
          ) : (
            previousReminders.map((reminder) => (
              <div key={reminder._id} className="reminder-item">
                <div className="reminder-content">
                  <strong>{reminder.medicine}</strong>
                  <small>{new Date(reminder.time).toLocaleString()}</small>
                  {reminder.notes && <small>Note: {reminder.notes}</small>}
                  {reminder.repeatType !== "none" && (
                    <small>
                      Repeat:{" "}
                      {reminder.repeatType === "daily"
                        ? "Daily"
                        : `Selected Days: ${reminder.selectedDays.join(", ")}`}
                    </small>
                  )}
                  {reminder.sent && <span className="sent-label">Sent</span>}
                </div>
                <FaTrash
                  className="delete-icon"
                  onClick={() => deleteReminder(reminder._id)}
                />
              </div>
            ))
          )}
        </div>
      </div>

      <footer className="footer">
        <div className="footer-main">
          <div className="footer-section">
            <h3>MediTrack</h3>
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
          <p>&copy; 2025 MediTrack | Designed with care.</p>
        </div>
      </footer>
    </div>
  );
};

export default Reminder;
