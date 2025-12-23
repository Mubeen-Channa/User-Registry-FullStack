import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0a0118] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Branding */}
      <div className="absolute top-8 left-8 text-white text-xl font-bold">
        MubeenChanna.
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md mx-4 z-10">
        <div className="bg-[#1a0b2e]/80 rounded-3xl p-8 space-y-6 border border-purple-500/20">
          <h1 className="text-white text-3xl font-bold">
            Nice to have you back!
          </h1>

          <form className="space-y-5">
            <div>
              <label className="text-white text-sm">Email</label>
              <input
                type="text"
                placeholder="email@example.com"
                className="w-full px-4 py-3 bg-[#1a0b2e]/60 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="text-white text-sm">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-[#1a0b2e]/60 rounded-xl text-white"
              />
            </div>

            <button className="w-full py-3 bg-purple-600 rounded-xl text-white">
              Login
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link to="/auth/register" className="text-purple-400">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
