import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOrUsername, username: emailOrUsername, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      // Redirect based on role
      switch (data.role) {
        case 'admin':
          localStorage.setItem('userRole', 'admin');
          navigate('/admin-dashboard');
          break;
        case 'super-admin':
          localStorage.setItem('userRole', 'super-admin');
          navigate('/admin-dashboard');
          break;
        case 'teacher':
          localStorage.setItem('userRole', 'teacher');
          navigate('/teacher-dashboard');
          break;
        case 'finance-manager':
          localStorage.setItem('userRole', 'finance_manager');
          navigate('/finance-dashboard');
          break;
        case 'student':
          localStorage.setItem('userRole', 'student');
          navigate('/student-dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-black text-white px-6">
      <h1 className="text-6xl font-extrabold tracking-wide mb-8">
        edu<span className="text-yellow-400">vance</span>
      </h1>

      <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-200">Welcome Back</h2>
        <p className="text-center text-gray-300 mb-6">Sign in to continue</p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-200 text-sm mb-1">Email or Username</label>
            <input
              type="text"
              placeholder="Enter email or username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-200 text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-all"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-gray-300 mt-4 text-sm">
          <span className="text-yellow-400 cursor-pointer hover:underline">Forgot Password?</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
