import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styling/reminder.css";

const Reminder = () => {
  const [medicine, setMedicine] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [notes, setNotes] = useState("");
  const [tel, setTel] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!medicine || !selectedDate || !tel) {
      alert("Please fill in all required fields.");
      return;
    }

    const reminder = {
      medicine,
      time: selectedDate,
      notes,
      tel,
    };

    console.log("Reminder set:", reminder);
    alert("Reminder saved!");

    setMedicine("");
    setSelectedDate(null);
    setNotes("");
    setTel("");
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
              Notes*
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., After dinner"
              />
            </label>
            <label>
              Contact Number
              <input
                type="tel"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                required
              />
            </label>

            <button type="submit" className="calendar-button">
              Save Reminder
            </button>
          </form>
        </div>
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
