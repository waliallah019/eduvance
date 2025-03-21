import React, { useState } from "react";
import UserData from "../../interface/user.interface";
const ResetPassword: React.FC = () => {
    const [searchInput, setSearchInput] = useState("");
    

    const [userData, setUserData] = useState<UserData | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSearch = async () => {
        setMessage("");
        setUserData(null);

        const response = await fetch("http://localhost:5000/api/user/get", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: searchInput })
        });

        if (response.ok) {
            const data = await response.json();
            setUserData(data);
        } else {
            setMessage("User not found.");
        }
    };

    const handlePasswordChange = async () => {
        setMessage("");

        if (!userData) {
            setMessage("User data is not available.");
            return;
        }

        const response = await fetch("http://localhost:5000/api/user/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: userData._id,
                email: userData.email,
                newPassword: newPassword
            })
        });

        if (response.ok) {
            setMessage("Password updated successfully!");
            setNewPassword("");
        } else {
            setMessage("Failed to update password.");
        }
    };

    return (
        <div className="bg-[#1e1e2f] p-8 rounded-xl shadow-lg border border-gray-700 max-w-lg mx-auto mt-10">
            <h3 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Reset Password</h3>
            
            {/* Search Input */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Enter Username or Email"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="bg-gray-800 border border-gray-600 text-white p-3 rounded-lg w-full focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
                />
                <button 
                    onClick={handleSearch} 
                    className="mt-4 bg-yellow-500 text-black px-6 py-3 rounded-lg text-lg font-semibold w-full hover:bg-yellow-600 transition-all duration-300"
                >
                    Search User
                </button>
            </div>

            {/* User Info Section */}
            {userData && (
                <div className="bg-gray-900 p-6 rounded-xl shadow-md mt-6 animate-fade-in">
                    <h4 className="text-xl font-semibold text-yellow-400 mb-4">User Details</h4>
                    <p className="text-lg text-gray-300"><strong>Username:</strong> {userData.username}</p>
                    <p className="text-lg text-gray-300"><strong>Email:</strong> {userData.email}</p>
                    <p className="text-lg text-gray-300"><strong>Role:</strong> {userData.role}</p>

                    {/* Password Update */}
                    <div className="mt-6">
                        <input
                            type="password"
                            placeholder="Enter New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="bg-gray-800 border border-gray-600 text-white p-3 rounded-lg w-full focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
                        />
                        <button
                            onClick={handlePasswordChange}
                            className="mt-4 bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold w-full hover:bg-green-600 transition-all duration-300"
                        >
                            Update Password
                        </button>
                    </div>
                </div>
            )}

            {/* Success/Error Message */}
            {message && (
                <p className={`mt-6 text-center text-lg font-semibold ${message.includes("successfully") ? "text-green-400" : "text-red-400"}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default ResetPassword;
