import { useState } from "react"; 
import { useNavigate } from "react-router-dom";

const InputField = ({ label, name, type = "text", placeholder, required = false, value, onChange, disabled }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-white">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className="w-full px-4 py-3.5 bg-[#1a0b2e]/60 border border-purple-500/30 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
    />
  </div>
);

const PasswordField = ({ label, name, show, setShow, value, onChange, disabled, strengthInfo }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-white">{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        required
        disabled={disabled}
        className="w-full px-4 py-3.5 bg-[#1a0b2e]/60 border border-purple-500/30 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all pr-12"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        disabled={disabled}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
      >
        <span className="material-symbols-outlined text-xl">
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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0a0118] overflow-hidden pt-20 pb-5">
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
      <div className="absolute top-20 right-20 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-pink-600/20 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '1s'}}></div>

      {/* Branding */}
      <div className="absolute top-8 left-8 text-white text-xl font-bold tracking-wide">
        MubeenChanna.
      </div>

      {/* Register Card */}
      <div className="relative w-full max-w-3xl z-10">
        <div className="bg-gradient-to-br from-[#1a0b2e]/80 to-[#2d1b4e]/60 backdrop-blur-xl rounded-3xl border border-purple-500/20 shadow-2xl p-8 space-y-2">
          
          {/* Header */}
          <div className="space-y-0">
            <h1 className="text-white text-3xl font-bold">Create Your Account</h1>
            <p className="text-gray-400 text-sm">Join us and start your journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
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
              placeholder="mubeenchanna.dev@gmail.com" 
              required 
              value={form.email}
              onChange={handleChange}
              disabled={isLoading}
            />

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <PasswordField 
                label="Password" 
                name="password" 
                show={showPassword} 
                setShow={setShowPassword}
                value={form.password}
                onChange={handleChange}
                disabled={isLoading}
              />
              <PasswordField 
                label="Confirm Password" 
                name="confirmPassword" 
                show={showConfirm} 
                setShow={setShowConfirm}
                value={form.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            {/* Department, Gender, Interest */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Department</label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3.5 bg-[#1a0b2e]/60 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                >
                  <option value="" className="bg-[#1a0b2e]">Select</option>
                  <option className="bg-[#1a0b2e]">Computer Science</option>
                  <option className="bg-[#1a0b2e]">Mathematics</option>
                  <option className="bg-[#1a0b2e]">Business Admin</option>
                  <option className="bg-[#1a0b2e]">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Gender</label>
                <select
                  name="role_name"
                  value={form.role_name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3.5 bg-[#1a0b2e]/60 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/50"
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center pt-2 mb-[-20px]">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <a 
                href="/auth/login" 
                className="text-purple-400 hover:text-purple-300 font-semibold underline transition-colors"
              >
                Login here
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-10">
          <p className="text-white/60 text-sm">
            Developed by <span className="font-semibold text-white/80">Mubeen</span> <span className="font-semibold text-purple-400">Channa</span>
          </p>
        </div>
      </div>
    </div>
  );
}