import front from "../assets/front.png";
import { Clock } from "lucide-react";
import { BiSearch } from "react-icons/bi";
import { FaLightbulb } from "react-icons/fa";
import { MdHealthAndSafety } from "react-icons/md";
import { BsCalendarCheck } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import "../styling/front.css";

const Front = () => {
  const navigate = useNavigate();

  const handleExploreSearch = () => {
    navigate("/guide");
  };
  const handleExploreReminder = () => {
    navigate("/reminder");
  };

  return (
    <div className="main_page">
      <img src={front} alt="front-display" className="main_img" />

      <div className="aim-section">
        <h2 className="aim-heading">What We Aim For</h2>
        <div className="aim-cards">
          <div className="aim-card">
            <FaLightbulb className="aim-icon" />
            <h3>Awareness</h3>
            <p>
              Educating users about medicines — their purpose, how they work,
              and what conditions they treat — to promote informed health
              decisions.
            </p>
          </div>
          <div className="aim-card">
            <MdHealthAndSafety className="aim-icon" />
            <h3>Prevention</h3>
            <p>
              Encouraging timely and consistent medication use to prevent
              complications and improve long-term health outcomes.
            </p>
          </div>
          <div className="aim-card">
            <BsCalendarCheck className="aim-icon" />
            <h3>Consistency</h3>
            <p>
              Helping users stay on track with daily reminders and tools that
              support healthy habits and medication adherence.
            </p>
          </div>
        </div>
      </div>

      <div className="cta-wrapper">
        <div className="cta-section">
          <h2 className="cta-heading">
            Start Taking Control of Your Health Today
          </h2>
          <p className="cta-subtext">
            Set reminders, search for medicines, and stay informed — all in one
            place. Your well-being deserves consistency.
          </p>
          <button className="cta-button" onClick={handleExploreReminder}>
            Set Up A Reminder
          </button>
        </div>
      </div>

      <div className="container-1">
        <h1 className="con-1">What we do?</h1>
        <div className="task">
          <div className="reminder-card">
            <div className="reminder-inner">
              <div className="reminder-front">
                <h1 className="remind_overlay">We Remind you</h1>
              </div>
              <div className="reminder-back">
                <Clock size={50} color="#333" />
                <p className="reminder-info">
                  Stay on top of your health with timely medication reminders
                  tailored to your schedule. Our smart alert system ensures you
                  never miss a dose, helping you manage your prescriptions with
                  confidence and consistency. Whether it’s a daily vitamin or a
                  critical prescription, we’ve got you covered — because your
                  health deserves reliability.
                </p>
                <button className="explore-1" onClick={handleExploreReminder}>
                  Explore
                </button>
              </div>
            </div>
          </div>

          <div className="search-card">
            <div className="search-inner">
              <div className="search-front">
                <h1 className="search_overlay">We Make you aware</h1>
              </div>
              <div className="search-back">
                <BiSearch size={50} color="#333" />
                <p className="search-info">
                  Instantly search for any medicine to discover its purpose,
                  usage, and the conditions it treats. Our system provides
                  detailed information to help users understand the role of each
                  medication in managing specific diseases. Empower yourself
                  with knowledge and make informed health decisions—all in one
                  place.
                </p>
                <button className="explore-1" onClick={handleExploreSearch}>
                  Explore
                </button>
              </div>
            </div>
          </div>
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

export default Front;
