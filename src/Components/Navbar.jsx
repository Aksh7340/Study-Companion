import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {

  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));

  /* Listen for login/logout */

  useEffect(() => {

    function checkToken() {
      setToken(localStorage.getItem("token"));
    }

    window.addEventListener("storage", checkToken);

    return () => {
      window.removeEventListener("storage", checkToken);
    };

  }, []);


  /* Logout */

  function handleLogout() {

    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    setToken(null);

    navigate("/");

  }

  const linkStyle =
    "px-4 py-2 rounded-lg text-sm font-medium transition duration-200 hover:bg-indigo-100";

  const activeStyle =
    "px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white";


  return (

    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}

        <div
          className="text-xl font-bold text-indigo-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Study Companion
        </div>


        {/* Navigation */}

        <div className="flex items-center gap-4">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? activeStyle : linkStyle
            }
          >
            Home
          </NavLink>


          {token && (
            <>
              <NavLink
                to="/setup"
                className={({ isActive }) =>
                  isActive ? activeStyle : linkStyle
                }
              >
                Setup
              </NavLink>

              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? activeStyle : linkStyle
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
                isActive ? activeStyle : linkStyle
              }
            >
              Login
            </NavLink>

          ) : (

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
            >
              Logout
            </button>

          )}

        </div>

      </div>

    </nav>

  );

}