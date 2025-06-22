import logo from "../assets/medi.png";
import "../styling/navbar.css";
const Navbar = () => {
  return (
    <nav className="navbar">
      <img src={logo} className="logo" />
      <div className="navigation">
        <a href="#"> Home </a>
        <a href="#">About</a>
        <a href="#">Med guide</a>
        <a href="#">Reminders</a>
      </div>
    </nav>
  );
};
export default Navbar;
