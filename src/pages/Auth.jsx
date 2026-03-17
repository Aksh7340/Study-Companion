import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/api";

export default function Auth() {

  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [educationLevel, setEducationLevel] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }

  }, [navigate]);


  function validate() {

    setError("");

    // ✅ IMPROVED: Better email validation
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    // ✅ FIXED: Better email regex that validates domain properly
    // Checks: valid-chars@valid-domain.valid-extension
    const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address (e.g., user@example.com)");
      return false;
    }

    // ✅ Check for consecutive dots
    if (email.includes("..")) {
      setError("Email cannot contain consecutive dots");
      return false;
    }

    // ✅ Better password validation
    if (!password.trim()) {
      setError("Password is required");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (!isLogin) {

      if (!name.trim()) {
        setError("Name is required");
        return false;
      }

      if (name.length < 2) {
        setError("Name must be at least 2 characters");
        return false;
      }

      if (!educationLevel.trim()) {
        setError("Education level is required");
        return false;
      }

    }

    return true;

  }


  async function handleSubmit() {

    if (!validate()) return;

    try {

      setLoading(true);
      setError("");

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

        setSuccess("Login successful!");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 500);

      } 
      else {

        setSuccess("Registration successful! Redirecting to login...");

        setTimeout(() => {
          setIsLogin(true);
          setName("");
          setEducationLevel("");
          setEmail("");
          setPassword("");
          setSuccess("");
        }, 1000);

      }

    }
    catch (error) {

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";

      setError(message);
      console.error("Auth error:", error);

    }
    finally {

      setLoading(false);

    }

  }


  function handleKeyDown(e) {

    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }

  }


  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">

      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-sm">

        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Create Account"}
        </h2>

        {/* Error Message Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message Display */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        <div className="space-y-4">

          {!isLogin && (
            <>
              <input
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />

              <input
                placeholder="Education Level"
                value={educationLevel}
                onChange={e => setEducationLevel(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >

          {loading
            ? "Processing..."
            : isLogin
              ? "Login"
              : "Sign Up"}

        </button>

        <p
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
            setSuccess("");
          }}
          className="text-center text-sm text-indigo-600 mt-6 cursor-pointer hover:underline"
        >

          {isLogin
            ? "New user? Sign up"
            : "Already have an account? Login"}

        </p>

      </div>

    </div>

  );

}
