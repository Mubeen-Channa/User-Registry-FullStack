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
  const navigate = useNavigate();

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

          {/* Form will be added here */}
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