import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/api";
import "./Auth.css";

export default function Auth() {

  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [educationLevel, setEducationLevel] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);


  /* =========================
     Redirect if already logged in
  ========================= */

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }

  }, [navigate]);


  /* =========================
     Validation
  ========================= */

  function validate() {

    if (!email.trim()) {
      alert("Email is required");
      return false;
    }

    if (!password.trim()) {
      alert("Password is required");
      return false;
    }

    if (!isLogin) {

      if (!name.trim()) {
        alert("Name is required");
        return false;
      }

      if (!educationLevel.trim()) {
        alert("Education level is required");
        return false;
      }

    }

    return true;

  }


  /* =========================
     Submit
  ========================= */

  async function handleSubmit() {

    if (!validate()) return;

    try {

      setLoading(true);

      const endpoint = isLogin
        ? "/auth/login"
        : "/auth/register";

      const payload = isLogin
        ? { email, password }
        : { name, email, password, educationLevel };

      const res = await api.post(endpoint, payload);

      const data = res.data;

      if (isLogin) {

        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);

        // Reload app so App.jsx fetches data
        window.location.href = "/dashboard";

      } 
      else {

        alert("Registration successful");

        setIsLogin(true);

        setName("");
        setEducationLevel("");
        setEmail("");
        setPassword("");

      }

    }
    catch (error) {

      const message =
        error?.response?.data?.message ||
        error.message ||
        "Authentication failed";

      alert(message);

    }
    finally {

      setLoading(false);

    }

  }


  /* =========================
     Enter Key Submit
  ========================= */

  function handleKeyDown(e) {

    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }

  }


  return (

    <div className="auth-container">

      <div className="auth-card">

        <h2>
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {!isLogin && (

          <>
            <input
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <input
              placeholder="Education Level"
              value={educationLevel}
              onChange={e => setEducationLevel(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </>

        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
        >

          {loading
            ? "Processing..."
            : isLogin
              ? "Login"
              : "Sign Up"}

        </button>

        <p
          className="toggle-auth"
          onClick={() => setIsLogin(!isLogin)}
        >

          {isLogin
            ? "New user? Sign up"
            : "Already have an account? Login"}

        </p>

      </div>

    </div>

  );

}