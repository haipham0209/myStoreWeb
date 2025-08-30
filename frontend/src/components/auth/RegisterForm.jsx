import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/authService';
import '../css/Login.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');   // trạng thái lỗi
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({ userName, email, password });
      navigate('/login');  // đăng ký thành công chuyển về login
    } catch (err) {
      let message = 'Register failed';
      if (err.response) {
        const status = err.response.status;
        if (status === 400 || status === 409) {
          message = err.response.data.message || 'Invalid input data';
        } else if (status >= 500) {
          message = 'Server error, please try again later';
        }
      } else {
        message = 'Cannot connect to the server';
      }
      setError(message); // hiện ra lỗi ở UI
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card p-4 shadow custom-width mx-auto">
            <h2 className="text-center mb-4">Register</h2>
            <form onSubmit={handleSubmit}>
              {error && <p className="text-danger">{error}</p>}

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>

            <p className="text-center mt-3">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
