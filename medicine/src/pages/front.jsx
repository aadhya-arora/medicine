import front from "../assets/front.png";
import { Clock } from "lucide-react";
import { BiSearch } from "react-icons/bi";
import "../styling/front.css";

const Front = () => {
  return (
    <div className="main_page">
      <img src={front} alt="front-display" className="main_img" />

      <div className="cta-wrapper">
        <div className="cta-section">
          <h2 className="cta-heading">
            Start Taking Control of Your Health Today
          </h2>
          <p className="cta-subtext">
            Set reminders, search for medicines, and stay informed — all in one
            place. Your well-being deserves consistency.
          </p>
          <button className="cta-button">Set Your First Reminder</button>
        </div>
      </div>

      <div className="container-1">
        <h1 className="con-1">What we do?</h1>
        <div className="task">
          <div className="reminder-card">
            <div className="reminder-inner">
              <div className="reminder-front"></div>
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
                <button className="explore-1">Explore</button>
              </div>
            </div>
          </div>

          <div className="search-card">
            <div className="search-inner">
              <div className="search-front"></div>
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
                <button className="explore-1">Explore</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Front;
