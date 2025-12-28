import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/api";

const Wall = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterGender, setFilterGender] = useState("All");
  const [stats, setStats] = useState({ total: 0, male: 0, female: 0 });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return navigate("/auth/login");
    setUser(JSON.parse(storedUser));
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setFilteredUsers(data.users || []);
        calculateStats(data.users || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (list) => {
    setStats({
      total: list.length,
      male: list.filter((u) => u.role === "Male").length,
      female: list.filter((u) => u.role === "Female").length,
    });
  };

  useEffect(() => {
    let filtered = users;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.first_name?.toLowerCase().includes(q) ||
          u.last_name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      );
    }

    if (filterDepartment !== "All") {
      filtered = filtered.filter((u) => u.department === filterDepartment);
    }

    if (filterGender !== "All") {
      filtered = filtered.filter((u) => u.role === filterGender);
    }

    setFilteredUsers(filtered);
  }, [searchQuery, filterDepartment, filterGender, users]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <input
        placeholder="Search users"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 mb-4"
      />

      <div className="mb-4">
        Total: {stats.total} | Male: {stats.male} | Female: {stats.female}
      </div>

      {filteredUsers.map((u) => (
        <div key={u.id || u._id}>
          {u.first_name} {u.last_name}
        </div>
      ))}
    </div>
  );
};

export default Wall;
