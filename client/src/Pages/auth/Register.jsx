import { useState } from "react"; 
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import API_BASE_URL from '../../config/api';


const InputField = ({ label, name, type = "text", placeholder, required = false, value, onChange, disabled }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-white">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className="w-full px-3 py-2.5 bg-[#1a0b2e]/60 border border-purple-500/30 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
    />
  </div>
);

const PasswordField = ({ label, name, show, setShow, value, onChange, disabled, strengthInfo }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-white">{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        required
        disabled={disabled}
        className="w-full px-3 py-2.5 bg-[#1a0b2e]/60 border border-purple-500/30 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all pr-10"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        disabled={disabled}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
      >
        <span className="material-symbols-outlined text-lg">
          {show ? "visibility_off" : "visibility"}
        </span>
      </button>
    </div>
    {strengthInfo && <p className="text-xs">{strengthInfo}</p>}
  </div>
);

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    role_name: "Male",
    interest: "",
  });
  const [passwordStrength, setPasswordStrength] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const mediumRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
    if (strongRegex.test(password)) return "strong";
    if (mediumRegex.test(password)) return "medium";
    return "weak";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "password") setPasswordStrength(checkPasswordStrength(value));
  };

  const resetForm = () => {
    setForm({
      first_name: "", 
      last_name: "", 
      email: "", 
      password: "",
      confirmPassword: "", 
      department: "", 
      role_name: "Male", 
      interest: ""
    });
    setPasswordStrength("");
    setShowPassword(false);
    setShowConfirm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (checkPasswordStrength(form.password) === "weak") {
      setMessage({
        text: "Please use a stronger password! Minimum 6 characters with letters and numbers.",
        type: "error"
      });
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      setMessage({ text: "Passwords do not match!", type: "error" });
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, form);
      setMessage({
        text: res.data.message || "Registration successful! Redirecting to login...",
        type: "success"
      });
      resetForm();
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (err) {
      console.log(err);
      setMessage({
        text: err.response?.data?.message || "Registration failed. Please try again.",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrengthInfo = () => {
    if (!form.password) return null;
    const colors = {
      strong: "text-green-400",
      medium: "text-yellow-400", 
      weak: "text-red-400"
    };
    return (
      <span className={colors[passwordStrength]}>
        Strength: {passwordStrength}
      </span>
    );
  };

  // Password match indicator
  const getPasswordMatchInfo = () => {
    if (!form.confirmPassword) return null;
    const isMatch = form.password === form.confirmPassword;
    return (
      <span className={isMatch ? "text-green-400" : "text-red-400"}>
        {isMatch ? "✓ Match" : "✗ Don't match"}
      </span>
    );
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0a0118] overflow-hidden p-4">
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

      {/* Branding */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 font-bold tracking-wide text-base mt-4
                      md:top-6 md:left-6 md:translate-x-0 md:text-lg md:text-white md:mt-0">
        PranjalMandhan.
      </div>

      {/* Register Card */}
      <div className="relative w-full max-w-2xl z-10 md:mt-10 mt-20">
        <div className="md:bg-gradient-to-br md:from-[#1a0b2e]/80 md:to-[#2d1b4e]/60 md:backdrop-blur-xl md:border md:border-purple-500/20 md:shadow-2xl md:pb-3 md:pt-4 md:px-8 md:space-y-3
                        bg-gradient-to-br from-[#1a0b2e]/80 rounded-2xl shadow-2xl p-6 space-y-6
        ">
          {/* Header */}
          <div className="space-y-0">
            <h1 className="text-white text-2xl font-bold">Create Your Account</h1>
            <p className="text-gray-400 text-xs">Join us and start your journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <InputField 
                label="First Name" 
                name="first_name" 
                placeholder="Enter first name" 
                required 
                value={form.first_name}
                onChange={handleChange}
                disabled={isLoading}
              />
              <InputField 
                label="Last Name" 
                name="last_name" 
                placeholder="Enter last name" 
                required 
                value={form.last_name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            {/* Email */}
            <InputField 
              label="Email" 
              name="email" 
              type="email" 
              placeholder="PranjalMandhan@gmail.com" 
              required 
              value={form.email}
              onChange={handleChange}
              disabled={isLoading}
            />

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <PasswordField 
                label="Password" 
                name="password" 
                show={showPassword} 
                setShow={setShowPassword}
                value={form.password}
                onChange={handleChange}
                disabled={isLoading}
                strengthInfo={getPasswordStrengthInfo()}
              />
              <PasswordField 
                label="Confirm Password" 
                name="confirmPassword" 
                show={showConfirm} 
                setShow={setShowConfirm}
                value={form.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                strengthInfo={getPasswordMatchInfo()}
              />
            </div>

            {/* Department, Gender, Interest */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white">Department</label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2.5 bg-[#1a0b2e]/60 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                >
                  <option value="" className="bg-[#1a0b2e]">Select</option>
                  <option className="bg-[#1a0b2e]">Computer Science</option>
                  <option className="bg-[#1a0b2e]">Mathematics</option>
                  <option className="bg-[#1a0b2e]">Business Admin</option>
                  <option className="bg-[#1a0b2e]">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white">Gender</label>
                <select
                  name="role_name"
                  value={form.role_name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2.5 bg-[#1a0b2e]/60 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                >
                  <option className="bg-[#1a0b2e]" value="Male">Male</option>
                  <option className="bg-[#1a0b2e]" value="Female">Female</option>
                </select>
              </div>

              <InputField 
                label="Interests" 
                name="interest" 
                placeholder="e.g., Web, AI" 
                value={form.interest}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

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
                  onClick={() => setMessage({ text: "", type: "" })}
                  className="text-lg hover:opacity-70 transition-opacity"
                  disabled={isLoading}
                >
                  ×
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 rounded-lg font-semibold text-white text-sm transition-all duration-300 ${
                isLoading 
                  ? "bg-purple-600/50 cursor-not-allowed" 
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/50"
              }`}
            >
              {isLoading ? (
                <span className="flex justify-center items-center gap-2">
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-purple-500/20"></div>
              <span className="flex-shrink mx-3 text-gray-500 text-xs">Or sign up with</span>
              <div className="flex-grow border-t border-purple-500/20"></div>
            </div>

            {/* Google Signup Button */}
            <button
              type="button"
              className="w-full py-2.5 bg-white/10 hover:bg-white/15 border border-purple-500/20 rounded-lg text-white text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 group"
              disabled={isLoading}
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

          {/* Login Link */}
          <div className="text-center pt-1">
            <p className="text-gray-400 text-xs">
              Already have an account?{" "}
              <Link 
                to="/auth/login" 
                className={`text-purple-400 hover:text-purple-300 font-semibold underline transition-colors ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
              >
                Login here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-white/60 text-xs">
            Developed by <span className="font-semibold text-white/80">Pranjal</span> <span className="font-semibold text-purple-400">Mandhan</span>
          </p>
        </div>
      </div>
    </div>
  );
}