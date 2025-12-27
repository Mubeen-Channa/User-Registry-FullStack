import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/api";

const Wall = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return navigate("/auth/login");

    setUser(JSON.parse(storedUser));
    fetchAllUsers();
  }, [navigate]);

  const fetchAllUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setFilteredUsers(data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin border-4 border-purple-600 border-t-transparent rounded-full w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6">
        Welcome back, {user?.first_name}
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((u) => (
          <div key={u.id} className="border p-4 rounded-xl">
            <p className="font-semibold">
              {u.first_name} {u.last_name}
            </p>
            <p className="text-sm">{u.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wall;
