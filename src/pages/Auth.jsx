import { useState } from "react";
import "./Auth.css";

export default function Auth({ onSuccess }) {

  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit() {

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    onSuccess();
  }

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h2>{isLogin ? "Login" : "Sign Up"}</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSubmit}>
          {isLogin ? "Login" : "Sign Up"}
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