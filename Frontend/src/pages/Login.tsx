import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('admin'); // Default role is Admin

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh
    if (role === 'admin') navigate('/admin-dashboard');
    else if (role === 'teacher') navigate('/teacher-dashboard');
    else if (role === 'finance-manager') navigate('/finance-manager-dashboard');
    else navigate('/student-dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-black text-white px-6">
      {/* EduVance Branding */}
      <h1 className="text-6xl font-extrabold tracking-wide mb-8">
        edu<span className="text-yellow-400">vance</span>
      </h1>

      {/* Login Box */}
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-200">Welcome Back</h2>
        <p className="text-center text-gray-300 mb-6">Sign in to continue</p>

        <form className="space-y-4" onSubmit={handleSignIn}>
          <div>
            <label className="block text-gray-200 text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-gray-200 text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Role Selection Dropdown */}
          <div>
            <label className="block text-gray-200 text-sm mb-1">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="finance-manager">Finance Manager</option>
              <option value="student">Student</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-all"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-gray-300 mt-4 text-sm">
          Don't have an account? <span className="text-yellow-400 cursor-pointer hover:underline">Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
