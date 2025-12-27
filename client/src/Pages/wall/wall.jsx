import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Wall = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/auth/login");
      return;
    }

    setUser(JSON.parse(storedUser));
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin border-4 border-purple-600 border-t-transparent rounded-full w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold">MubeenChanna.</h1>
      </header>

      <main className="p-6">
        <h2 className="text-xl font-semibold">
          Welcome back, {user?.first_name}
        </h2>
      </main>
    </div>
  );
};

export default Wall;
