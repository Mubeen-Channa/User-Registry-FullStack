import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/api";

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
        setMessage({ text: data.message || "Login failed", type: "error" });
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage({ text: "Login successful!", type: "success" });

      setTimeout(() => navigate("/wall"), 2000);
    } catch {
      setMessage({ text: "Something went wrong", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0118]">
      <form
        onSubmit={handleLogin}
        className="bg-[#1a0b2e]/80 p-8 rounded-3xl space-y-5 w-full max-w-md"
      >
        <h1 className="text-white text-3xl font-bold">
          Nice to have you back!
        </h1>

        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-3 rounded-xl"
          required
        />

        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-3 rounded-xl"
          required
        />

        {message.text && <p className="text-white">{message.text}</p>}

        <button
          disabled={loading}
          className="w-full py-3 bg-purple-600 rounded-xl text-white"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-400">
          No account?{" "}
          <Link to="/auth/register" className="text-purple-400">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
