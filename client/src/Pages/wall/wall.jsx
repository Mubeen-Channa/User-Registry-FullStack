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
        <div className="animate-spin border-4 border-purple-600 border-t-transparent rounded-full w-10 h-10" />
      </div>
    );
  }

  const departments = ["All", ...new Set(users.map(u => u.department).filter(Boolean))];

  console.log(user)


  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 px-5 z-50 backdrop-blur-xl border-b ${
        darkMode ? 'bg-[#1a0b2e]/80 border-purple-500/20' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="md:max-w-7xl md:mx-auto md:px-4 md:py-3
                        max-w-7xl mx-auto px-4 py-3 flex justify-between items-center
        ">
          <h1 className={`md:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>PranjalMandhan.</h1>
          
          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className={`md:p-2 pt-1 px-1 rounded-lg ${
              darkMode ? 'bg-purple-600/20 text-purple-400' : 'bg-gray-200 text-gray-700'
            }`}>
              <span className="material-symbols-outlined text-xl">{darkMode ? "light_mode" : "dark_mode"}</span>
            </button>
            
            <button onClick={() => setShowProfileModal(true)} className="flex items-center gap-2 hover:opacity-80">
              <Avatar user={user} size="md:w-8 md:h-8  w-6 h-6" uploading={uploading} />
              <span className={`hidden md:block font-medium md:text-sm text-[xs] ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {user?.first_name}
              </span>
            </button>
            
            <button onClick={handleLogout} className={`md:px-3 md:py-1.5 md:text-sm  px-2 py-1 text-xs rounded-lg font-medium ${
              darkMode ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
              : 'bg-red-100 text-red-600 hover:bg-red-200'
            }`}>Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-6">
        {/* Welcome */}
        <Card darkMode={darkMode} className="p-4 mb-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20">
          <h2 className={`md:text-xl text-[17px] font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Welcome back, {user?.first_name}! 👋
          </h2>
          <p className={`md:text-sm text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {user?.email} • {user?.department} • {user?.role}
          </p>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <StatCard title="Total Users" value={stats.total} icon="group" color="purple" darkMode={darkMode} />
          <StatCard title="Male" value={stats.male} icon="male" color="blue" darkMode={darkMode} />
          <StatCard title="Female" value={stats.female} icon="female" color="pink" darkMode={darkMode} />
          <StatCard title="Departments" value={Object.keys(stats.departments).length} icon="business" color="green" darkMode={darkMode} />
        </div>

        {/* Filters */}
        <Card darkMode={darkMode} className="p-4 mb-5">
          <h3 className={`text-base font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Search & Filter Users
          </h3>
          <div className="grid md:grid-cols-3 gap-3">
            <Input icon="search" placeholder="Search..." value={searchQuery} onChange={setSearchQuery} darkMode={darkMode} />
            <Select value={filterDepartment} onChange={setFilterDepartment} options={departments} darkMode={darkMode} />
            <Select value={filterGender} onChange={setFilterGender} options={["All", "Male", "Female"]} darkMode={darkMode} />
          </div>
          <p className={`mt-3 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </Card>

        {/* Users Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredUsers.map(u => <UserCard key={u.id || u._id} user={u} darkMode={darkMode} />)}
        </div>

        {!filteredUsers.length && (
          <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
            <p className="text-sm">No users found</p>
          </div>
        )}
      </main>

      {showProfileModal && (
        <ProfileModal user={user} darkMode={darkMode} onClose={() => setShowProfileModal(false)} 
          onUpload={handleImageUpload} uploading={uploading} />
      )}
    </div>
  );
};



// Components
const Avatar = ({ user, size = "w-10 h-10", uploading = false }) => (
  <div className={`${size} rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm font-semibold overflow-hidden relative`}>
    {uploading && (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <div className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5" />
      </div>
    )}
    {user?.profileImage ? (
      <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
    ) : `${user?.first_name?.charAt(0) || ''}${user?.last_name?.charAt(0) || ''}`}
  </div>
);


const Card = ({ darkMode, className = "", children }) => (
  <div className={`rounded-xl border ${
    darkMode ? 'bg-[#1a0b2e]/60 border-purple-500/20' : 'bg-white border-gray-200'
  } ${className}`}>{children}</div>
);


const StatCard = ({ title, value, icon, color, darkMode }) => {
  const colors = {
    purple: darkMode ? 'from-purple-600/20 to-purple-800/20 border-purple-500/30' : 'from-purple-100 to-purple-200 border-purple-300',
    blue: darkMode ? 'from-blue-600/20 to-blue-800/20 border-blue-500/30' : 'from-blue-100 to-blue-200 border-blue-300',
    pink: darkMode ? 'from-pink-600/20 to-pink-800/20 border-pink-500/30' : 'from-pink-100 to-pink-200 border-pink-300',
    green: darkMode ? 'from-green-600/20 to-green-800/20 border-green-500/30' : 'from-green-100 to-green-200 border-green-300'
  };
  return (
    <div className={`rounded-lg p-3 border bg-gradient-to-br ${colors[color]}`}>
      <div className="flex justify-between items-center mb-1">
        <span className={`material-symbols-outlined text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>{icon}</span>
        <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</span>
      </div>
      <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{title}</p>
    </div>
  );
};


const Input = ({ icon, placeholder, value, onChange, darkMode }) => (
  <div className="relative">
    <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg ${
      darkMode ? 'text-gray-400' : 'text-gray-500'
    }`}>{icon}</span>
    <input type="text" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
      className={`w-full pl-10 pr-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-purple-500/50 outline-none ${
        darkMode ? 'bg-[#0a0118]/60 border-purple-500/30 text-white' 
        : 'bg-gray-50 border-gray-300 text-gray-900'
      }`} />
  </div>
);


const Select = ({ value, onChange, options, darkMode }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)}
    className={`px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-purple-500/50 outline-none ${
      darkMode ? 'bg-[#0a0118]/60 border-purple-500/30 text-white' 
      : 'bg-gray-50 border-gray-300 text-gray-900'
    }`}>
    {options.map(opt => (
      <option key={opt} value={opt} className={darkMode ? 'bg-[#1a0b2e]' : ''}>
        {opt === "All" ? `All ${options[1] ? "Options" : ""}` : opt}
      </option>
    ))}
  </select>
);


const UserCard = ({ user, darkMode }) => (
  <Card darkMode={darkMode} className="p-4 hover:scale-105 transition-all">
    <div className="flex gap-2.5 mb-2.5">
      <Avatar user={user} />
      <div className="flex-1 min-w-0">
        <h4 className={`font-semibold text-sm truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {user.first_name} {user.last_name}
        </h4>
        <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
      </div>
    </div>
    <div className="space-y-1.5">
      <InfoRow icon="business" text={user.department || "N/A"} darkMode={darkMode} />
      <InfoRow icon={user.role === "Male" ? "male" : "female"} text={user.role} darkMode={darkMode} />
      {user.interest && <InfoRow icon="interests" text={user.interest} darkMode={darkMode} />}
    </div>
  </Card>
);


const InfoRow = ({ icon, text, darkMode }) => (
  <div className="flex items-center gap-2">
    <span className={`material-symbols-outlined text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{icon}</span>
    <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{text}</span>
  </div>
);


const ProfileModal = ({ user, darkMode, onClose, onUpload, uploading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <Card darkMode={darkMode} className="w-full max-w-md p-5">
      <div className="flex justify-between mb-5">
        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>My Profile</h3>
        <button onClick={onClose} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`} disabled={uploading}>
          <span className={`material-symbols-outlined text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>close</span>
        </button>
      </div>

      <div className="flex flex-col items-center mb-5">
        <div className="relative mb-3">
          <Avatar user={user} size="w-20 h-20" uploading={uploading} />
          <label className={`absolute bottom-0 right-0 p-1.5 bg-purple-600 rounded-full cursor-pointer hover:bg-purple-700 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <span className="material-symbols-outlined text-white text-sm">
              {uploading ? "hourglass_empty" : "edit"}
            </span>
            <input type="file" accept="image/*" onChange={onUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
        <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {user?.first_name} {user?.last_name}
        </h4>
        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user?.email}</p>
        {uploading && <p className="text-xs text-purple-400 mt-2">Uploading image...</p>}
      </div>

      <div className="space-y-2.5">
        <ProfileInfo label="Department" value={user?.department} icon="business" darkMode={darkMode} />
        <ProfileInfo label="Gender" value={user?.role} icon={user?.role === "Male" ? "male" : "female"} darkMode={darkMode} />
        <ProfileInfo label="Interests" value={user?.interest || "Not specified"} icon="interests" darkMode={darkMode} />
      </div>

      <button onClick={onClose} disabled={uploading} className={`w-full mt-5 py-2.5 text-sm rounded-lg font-semibold text-white ${
        uploading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
      }`}>
        Close
      </button>
    </Card>
  </div>
);


const ProfileInfo = ({ label, value, icon, darkMode }) => (
  <div className={`flex gap-2.5 p-2.5 rounded-lg ${darkMode ? 'bg-[#0a0118]/40' : 'bg-gray-50'}`}>
    <span className={`material-symbols-outlined text-lg ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{icon}</span>
    <div className="flex-1">
      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
      <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
    </div>
  </div>
);


export default Wall;