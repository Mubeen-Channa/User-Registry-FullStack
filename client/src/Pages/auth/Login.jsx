import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API_BASE_URL from '../../config/api';


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({
          text: data.message || "Login failed. Please check your credentials.",
          type: "error"
        });
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log(data.user)

      setMessage({
        text: "Login successful!",
        type: "success"
      });

      setTimeout(() => {
        navigate("/wall");
      }, 2000);

    } catch (err) {
      setMessage({
        text: "Something went wrong! Please try again.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const closeMessage = () => {
    setMessage({ text: "", type: "" });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0a0118] overflow-hidden">
      {/* Starry Background */}
      <div className="absolute inset-0">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-16 right-16 w-72 h-72 bg-purple-600/30 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-16 left-16 w-64 h-64 bg-pink-600/20 rounded-full blur-[80px] animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-24 right-32 w-48 h-48 bg-purple-800/40 rounded-full blur-[60px]"></div>
      
      {/* Branding */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 font-bold tracking-wide text-base mt-4
                      md:top-6 md:left-6 md:translate-x-0 md:text-lg md:text-white md:mt-0">
        PranjalMandhan.
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-sm mx-4 z-10 md:mt-10 mt-20">
        <div className="md:bg-gradient-to-br md:from-[#1a0b2e]/80 md:to-[#2d1b4e]/60 md:backdrop-blur-xl md:border md:border-purple-500/20 md:shadow-2xl 
                        bg-gradient-to-br from-[#1a0b2e]/80 rounded-2xl shadow-2xl p-6 space-y-6
        ">
          
          {/* Header */}
            <div className="space-y-1 text-center md:text-left">
              <h1 className="text-white text-xl md:text-2xl font-bold">Nice to have you back!</h1>
              <p className="text-gray-400 text-[11px] md:text-xs">
                Manage users, track performance, and stay in control
              </p>
            </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-white text-xs font-medium">Email</label>
              <input
                type="text"
                placeholder="PranjalMandhan@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#1a0b2e]/60 border border-purple-500/30 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                disabled={loading}
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-white text-xs font-medium">Password</label>
                <Link 
                  to="/forgot-password"
                  className={`text-white/70 hover:text-white text-xs transition-colors ${loading ? 'pointer-events-none opacity-50' : ''}`}>
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password here"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#1a0b2e]/60 border border-purple-500/30 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all pr-10"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  disabled={loading}
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-2 text-white/80 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-purple-500/30 bg-transparent text-purple-600 focus:ring-purple-500 cursor-pointer"
                disabled={loading}
              />
              <span className="text-xs group-hover:text-white transition-colors">Remember me</span>
            </label>

            {/* Success/Error Message */}
            {message.text && (
              <div className={`p-3 rounded-lg border flex items-center justify-between ${
                message.type === "success" 
                  ? "bg-green-500/10 border-green-500/30 text-green-400" 
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">
                    {message.type === "success" ? "check_circle" : "error"}
                  </span>
                  <span className="text-xs font-medium">{message.text}</span>
                </div>
                <button 
                  onClick={closeMessage}
                  className="text-lg hover:opacity-70 transition-opacity"
                  disabled={loading}
                >
                  ×
                </button>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-lg font-semibold text-white text-sm transition-all duration-300 ${
                loading 
                  ? "bg-purple-600/50 cursor-not-allowed" 
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/50"
              }`}
            >
              {loading ? (
                <span className="flex justify-center items-center gap-2">
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                  Signing in...
                </span>
              ) : (
                "Login"
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-purple-500/20"></div>
              <span className="flex-shrink mx-3 text-gray-500 text-xs">Or sign in with</span>
              <div className="flex-grow border-t border-purple-500/20"></div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              className="w-full py-2.5 bg-white/10 hover:bg-white/15 border border-purple-500/20 rounded-lg text-white text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 group"
              disabled={loading}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center pt-1">
            <p className="text-gray-400 text-xs">
              Don't have an account?{" "}
              <Link 
                to="/auth/register" 
                className={`text-purple-400 hover:text-purple-300 font-semibold underline transition-colors ${loading ? 'pointer-events-none opacity-50' : ''}`}
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-xs">
            Developed by <span className="font-semibold text-white/80">Pranjal</span> <span className="font-semibold text-purple-400">Mandhan</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;