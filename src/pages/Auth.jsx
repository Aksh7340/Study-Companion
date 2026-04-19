import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/api";

export default function Auth() {

  const navigate = useNavigate();

  const [isLogin, setIsLogin]         = useState(true);
  const [name, setName]               = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPass, setShowPass]       = useState(false);

  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/dashboard");
  }, [navigate]);

  function validate() {
    setError("");

    if (!email.trim()) { setError("Email is required"); return false; }

  const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._%-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
    if (!emailRegex.test(email)) { setError("Please enter a valid email address"); return false; }
    if (email.includes(".."))   { setError("Email cannot contain consecutive dots"); return false; }
    if (!password.trim())       { setError("Password is required"); return false; }
    if (password.length < 6)    { setError("Password must be at least 6 characters"); return false; }

    if (!isLogin) {
      if (!name.trim())            { setError("Name is required"); return false; }
      if (name.length < 2)         { setError("Name must be at least 2 characters"); return false; }
      if (!educationLevel.trim())  { setError("Education level is required"); return false; }
    }

    return true;
  }

  async function handleSubmit() {
    if (!validate()) return;

    try {
      setLoading(true);
      setError("");

      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload  = isLogin
        ? { email, password }
        : { name, email, password, educationLevel };

      const res  = await api.post(endpoint, payload);
      const data = res.data;

      if (isLogin) {
        localStorage.setItem("token",  data.token);
        localStorage.setItem("userId", data.userId);
        setSuccess("Login successful!");
        setTimeout(() => { window.location.href = "/dashboard"; }, 500);
      } else {
        setSuccess("Account created! Redirecting to login…");
        setTimeout(() => {
          setIsLogin(true);
          setName(""); setEducationLevel(""); setEmail(""); setPassword(""); setSuccess("");
        }, 1000);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") { e.preventDefault(); handleSubmit(); }
  }

  /* Shared input style */
  const inp = "input-field";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">

      {/* Gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)" }} />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-300 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="w-full max-w-md animate-slide-up">

        {/* Card */}
        <div className="glass rounded-2xl shadow-xl p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-extrabold text-xl">SC</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              {isLogin ? "Welcome back 👋" : "Create your account"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {isLogin ? "Sign in to continue your preparation." : "Start your smart study journey today."}
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 animate-fade-in">
              <span className="text-red-500 mt-0.5">⚠️</span>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2 animate-fade-in">
              <span className="text-emerald-500 mt-0.5">✅</span>
              <p className="text-emerald-700 text-sm">{success}</p>
            </div>
          )}

          {/* Fields */}
          <div className="space-y-3">

            {!isLogin && (
              <>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Full Name</label>
                  <input className={inp} placeholder="e.g. Akshay Gurjar"
                    value={name} onChange={e => setName(e.target.value)} onKeyDown={handleKeyDown} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Education Level</label>
                  <input className={inp} placeholder="e.g. Undergraduate / Class 12"
                    value={educationLevel} onChange={e => setEducationLevel(e.target.value)} onKeyDown={handleKeyDown} />
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Email</label>
              <input type="email" className={inp} placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKeyDown} />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} className={`${inp} pr-10`}
                  placeholder="Minimum 6 characters"
                  value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown} />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition"
                >
                  {showPass ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full mt-6 py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Processing…
                </span>
              : isLogin ? "Sign In" : "Create Account"}
          </button>

          {/* Toggle */}
          <p
            onClick={() => { setIsLogin(l => !l); setError(""); setSuccess(""); }}
            className="text-center text-sm text-indigo-600 mt-5 cursor-pointer hover:text-indigo-800 font-medium transition-colors"
          >
            {isLogin ? "New here? Create an account →" : "Already have an account? Sign in →"}
          </p>

        </div>

      </div>
    </div>
  );
}
