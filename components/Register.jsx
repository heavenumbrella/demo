import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register({ onRegister }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    phone: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 0) return '';
    let formatted = '8';
    
    if (cleaned.length > 1) {
      formatted += '(' + cleaned.substring(1, 4);
    }
    if (cleaned.length > 4) {
      formatted += ')' + cleaned.substring(4, 7);
    }
    if (cleaned.length > 7) {
      formatted += '-' + cleaned.substring(7, 9);
    }
    if (cleaned.length > 9) {
      formatted += '-' + cleaned.substring(9, 11);
    }
    
    return formatted;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      setFormData({ ...formData, [name]: formatPhone(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    if (generalError) setGeneralError('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    const loginRegex = /^[a-zA-Z0-9]{6,}$/;
    if (!formData.username) {
      newErrors.username = 'Логин обязателен для заполнения';
    } else if (!loginRegex.test(formData.username)) {
      newErrors.username = 'Логин должен содержать только латинские буквы и цифры, минимум 6 символов';
    }
    
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен для заполнения';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Пароль должен содержать минимум 8 символов';
    }
    const nameRegex = /^[а-яА-ЯёЁ\s]+$/;
    if (!formData.full_name) {
      newErrors.full_name = 'ФИО обязательно для заполнения';
    } else if (!nameRegex.test(formData.full_name)) {
      newErrors.full_name = 'ФИО должно содержать только кириллицу и пробелы';
    }

    const phoneRegex = /^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
    if (!formData.phone) {
      newErrors.phone = 'Телефон обязателен для заполнения';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Телефон должен быть в формате 8(XXX)XXX-XX-XX';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Введите корректный email адрес';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const response = await fetch('/api/users/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        onRegister(data.user, data.token);
        navigate('/dashboard');
      } else {

        if (data.username) {
          setErrors(prev => ({ ...prev, username: data.username[0] }));
        } else if (data.email) {
          setErrors(prev => ({ ...prev, email: data.email[0] }));
        } else if (data.phone) {
          setErrors(prev => ({ ...prev, phone: data.phone[0] }));
        } else if (data.full_name) {
          setErrors(prev => ({ ...prev, full_name: data.full_name[0] }));
        } else if (data.password) {
          setErrors(prev => ({ ...prev, password: data.password[0] }));
        } else {
          setGeneralError('Ошибка регистрации. Проверьте введенные данные.');
        }
      }
    } catch (error) {
      setGeneralError('Ошибка соединения с сервером. Попробуйте позже.');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Регистрация</h2>
              
              {generalError && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {generalError}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setGeneralError('')}
                  ></button>
                </div>
              )}
              
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Логин <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="латиница и цифры, мин. 6 символов"
                    autoComplete="username"
                  />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                  <small className="form-text text-muted">
                    Только латинские буквы и цифры
                  </small>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Пароль <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Минимум 8 символов"
                    autoComplete="new-password"
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                  <small className="form-text text-muted">
                    Минимальная длина: 8 символов
                  </small>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="full_name" className="form-label">
                    ФИО <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Иванов Иван Иванович"
                    autoComplete="name"
                  />
                  {errors.full_name && (
                    <div className="invalid-feedback">{errors.full_name}</div>
                  )}
                  <small className="form-text text-muted">
                    Только кириллица и пробелы
                  </small>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Телефон <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="phone"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="8(XXX)XXX-XX-XX"
                    autoComplete="tel"
                    maxLength="15"
                  />
                  {errors.phone && (
                    <div className="invalid-feedback">{errors.phone}</div>
                  )}
                  <small className="form-text text-muted">
                    Формат: 8(999)123-45-67
                  </small>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@mail.com"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                
                <div className="mb-3">
                  <small className="text-muted">
                    <span className="text-danger">*</span> Все поля обязательны для заполнения
                  </small>
                </div>
                
                <button type="submit" className="btn btn-primary w-100 mb-3">
                  Создать пользователя
                </button>
              </form>
              
              <div className="text-center">
                <p className="mb-0">
                  Уже зарегистрированы?{' '}
                  <Link to="/login" className="text-decoration-none">
                    Войти
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

export default Register;