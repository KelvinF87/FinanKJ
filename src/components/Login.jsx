import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      // Successfully logged in
        navigate('/');
    } else {
      // Handle login error
      alert('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center h-screen">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input input-bordered mb-4"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input input-bordered mb-4"
      />
      <button type="submit" className="btn btn-primary">Login</button>
    </form>
  );
};
