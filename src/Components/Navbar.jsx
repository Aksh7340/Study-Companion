import { NavLink } from "react-router-dom";
import "../App.css";

export default function Navbar() {
  return (
    <nav className="navbar">

      <div className="nav-left">
        <h2 className="logo">Study Companion</h2>
      </div>

      <div className="nav-right">

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/setup"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Setup
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Dashboard
        </NavLink>

      </div>

    </nav>
  );
}