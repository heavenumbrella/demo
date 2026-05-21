import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.username || !formData.password) {
      setError('Введите логин и пароль');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.user, data.token);
        navigate('/dashboard');
      } else {
        if (data.non_field_errors) {
          setError(data.non_field_errors[0]);
        } else {
          setError('Неверный логин или пароль');
        }
      }
    } catch (error) {
      setError('Ошибка соединения с сервером');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Авторизация</h2>
              
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setError('')}
                  ></button>
                </div>
              )}
              
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Логин</label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Введите логин"
                    autoComplete="username"
                    disabled={loading}
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Пароль</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Введите пароль"
                    autoComplete="current-password"
                    disabled={loading}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Вход...' : 'Войти'}
                </button>
              </form>
              
              <div className="text-center">
                <p className="mb-0">
                  Еще не зарегистрированы?{' '}
                  <Link to="/register" className="text-decoration-none">
                    Регистрация
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;