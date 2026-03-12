import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../App.css";

export default function Navbar() {

  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));

  /* =========================
     Listen for login/logout
  ========================= */

  useEffect(() => {

    function checkToken() {
      setToken(localStorage.getItem("token"));
    }

    window.addEventListener("storage", checkToken);

    return () => {
      window.removeEventListener("storage", checkToken);
    };

  }, []);


  /* =========================
     Logout
  ========================= */

  function handleLogout() {

    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    setToken(null);

    navigate("/");

  }


  return (

    <nav className="navbar">

      <div
        className="nav-left"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
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


        {token && (
          <>
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
          </>
        )}


        {!token ? (

          <NavLink
            to="/auth"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Login
          </NavLink>

        ) : (

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        )}

      </div>

    </nav>

  );

}