import { useState } from "react";
import "./Auth.css"
function Auth({onSuccess}) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container" >
     <div className="auth-card">
         <h2>{isLogin ? "Login" : "Sign Up"}</h2>

      <input type="email" placeholder="Email" />
      <br /><br />

      <input type="password" placeholder="Password" />
      <br /><br />

      <button onClick={onSuccess}>
        {isLogin ? "Login" : "Sign Up"}
      </button>

      <p onClick={() => setIsLogin(!isLogin)}>
        {isLogin
          ? "New user? Sign up"
          : "Already have an account? Login"}
      </p>
     </div>
    </div>
  );
}





export default Auth;