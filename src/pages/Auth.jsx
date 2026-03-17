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

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }

  }, [navigate]);


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
          onClick={() => setIsLogin(!isLogin)}
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