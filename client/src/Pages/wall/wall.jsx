import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Wall = () => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return navigate("/auth/login");

    setUser(JSON.parse(storedUser));
    setDarkMode(localStorage.getItem("darkMode") === "true");
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin border-4 border-purple-600 border-t-transparent rounded-full w-12 h-12" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#0a0118]" : "bg-gray-50"}`}>
      <header className="sticky top-0 backdrop-blur-xl border-b p-4 flex justify-between">
        <h1 className="text-2xl font-bold">MubeenChanna.</h1>

        <div className="flex gap-3">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light" : "Dark"}
          </button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="p-6">
        <Card>
          <h2 className="text-xl font-bold">
            Welcome back, {user?.first_name}
          </h2>
          <p>{user?.email}</p>
        </Card>
      </main>
    </div>
  );
};

const Card = ({ children }) => (
  <div className="bg-white dark:bg-[#1a0b2e]/60 p-6 rounded-xl border">
    {children}
  </div>
);

export default Wall;
