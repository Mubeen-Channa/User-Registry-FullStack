import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import API_BASE_URL from '../../config/api';

const Wall = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterGender, setFilterGender] = useState("All");
  const [darkMode, setDarkMode] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState({ total: 0, male: 0, female: 0, departments: {} });
  
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return navigate("/auth/login");
    
    setUser(JSON.parse(storedUser));
    setDarkMode(localStorage.getItem("darkMode") === "true");
    fetchAllUsers();
  }, [navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const fetchAllUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/all`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        const usersList = data.users || [];
        setUsers(usersList);
        setFilteredUsers(usersList);
        calculateStats(usersList);
        
        // Update current user's profile image from the fetched users list
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const currentUserData = usersList.find(u => u.id === storedUser.id || u._id === storedUser.id);
        if (currentUserData && currentUserData.profileImage) {
          const updatedUser = { ...storedUser, profileImage: currentUserData.profileImage };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (list) => {
    const stats = {
      total: list.length,
      male: list.filter(u => u.role === "Male").length,
      female: list.filter(u => u.role === "Female").length,
      departments: {}
    };
    list.forEach(u => {
      if (u.department) stats.departments[u.department] = (stats.departments[u.department] || 0) + 1;
    });
    setStats(stats);
  };

  useEffect(() => {
    let filtered = users;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(u => 
        u.first_name?.toLowerCase().includes(query) ||
        u.last_name?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query)
      );
    }
    if (filterDepartment !== "All") filtered = filtered.filter(u => u.department === filterDepartment);
    if (filterGender !== "All") filtered = filtered.filter(u => u.role === filterGender);
    setFilteredUsers(filtered);
  }, [searchQuery, filterDepartment, filterGender, users]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX = 400;
        let { width, height } = img;
        
        if (width > height) {
          if (width > MAX) { height *= MAX / width; width = MAX; }
        } else {
          if (height > MAX) { width *= MAX / height; height = MAX; }
        }
        
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        
        const compressed = canvas.toDataURL('image/jpeg', 0.7);
        
        try {
          const res = await fetch(`${API_BASE_URL}/users/profile-image`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, imageData: compressed })
          });
          
          if (res.ok) {
            const data = await res.json();
            const updated = { ...user, profileImage: data.profileImage };
            setUser(updated);
            localStorage.setItem("user", JSON.stringify(updated));
            fetchAllUsers();
          } else {
            const error = await res.json();
            alert(`Upload failed: ${error.message}`);
          }
        } catch (err) {
          console.error("Upload error:", err);
          alert('Upload failed. Please try again.');
        } finally {
          setUploading(false);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0118]">
        <div className="animate-spin border-4 border-purple-600 border-t-transparent rounded-full w-12 h-12" />
      </div>
    );
  }

  const departments = ["All", ...new Set(users.map(u => u.department).filter(Boolean))];

  console.log(user)

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b ${
        darkMode ? 'bg-[#1a0b2e]/80 border-purple-500/20' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>MubeenChanna.</h1>
          
          <div className="flex items-center gap-4">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg ${
              darkMode ? 'bg-purple-600/20 text-purple-400' : 'bg-gray-200 text-gray-700'
            }`}>
              <span className="material-symbols-outlined">{darkMode ? "light_mode" : "dark_mode"}</span>
            </button>
            
            <div className="flex items-center gap-2 hover:opacity-80">
              <Avatar user={user} size="w-10 h-10" uploading={uploading} />
              <span className={`hidden md:block font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {user?.first_name}
              </span>
            </div>
            
            <button onClick={handleLogout} className={`px-4 py-2 rounded-lg font-medium ${
              darkMode ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
              : 'bg-red-100 text-red-600 hover:bg-red-200'
            }`}>Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <p className={darkMode ? 'text-white' : 'text-gray-900'}>Content will be added here</p>
      </main>
    </div>
  );
};

// Components
const Avatar = ({ user, size = "w-12 h-12", uploading = false }) => (
  <div className={`${size} rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold overflow-hidden relative`}>
    {uploading && (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <div className="animate-spin border-2 border-white border-t-transparent rounded-full w-6 h-6" />
      </div>
    )}
    {user?.profileImage ? (
      <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
    ) : `${user?.first_name?.charAt(0) || ''}${user?.last_name?.charAt(0) || ''}`}
  </div>
);

export default Wall;