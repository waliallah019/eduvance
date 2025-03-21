import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      } else {
        const data = await response.json();
        console.error("Logout failed:", data.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-600 hover:text-white transition-all"
    >
      <FaSignOutAlt /> Logout
    </button>
  );
};

export default LogoutButton;
