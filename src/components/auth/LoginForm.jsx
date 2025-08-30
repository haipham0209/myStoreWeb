import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { getUserRole } from '../../utils/jwtUtils';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      const role = getUserRole();
      if (role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/home');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <br />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <br />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
