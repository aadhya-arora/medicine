import logo from "../assets/medi.png";
import { Link } from "react-router-dom";
import "../styling/navbar.css";
const Navbar = () => {
  return (
    <nav className="navbar">
      <img src={logo} className="logo" />
      <div className="navigation">
        <Link to="/"> Home </Link>
        <a href="#">About</a>
        <Link to="/guide">Med guide</Link>
        <Link to="/reminder">Reminders</Link>
      </div>
    </nav>
  );
};
export default Navbar;
