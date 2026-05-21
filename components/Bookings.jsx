
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
const isAdmin = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;
      return true; 
    } catch {
      return false;
    }
  };

function Bookings() {
  const [searchParams] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    room_type: 'auditorium',
    start_time: '',
    payment_method: 'cash'
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState('');

  const token = localStorage.getItem('token');


  useEffect(() => {

    if (searchParams.get('create') === 'true') {
      setShowCreateForm(true);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, []); 

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Сервер вернул не JSON ответ. Проверьте backend сервер.');
      }
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Ошибка загрузки заявок');
      }
    } catch (error) {
      console.error('Fetch bookings error:', error);
      setError(error.message || 'Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (submitMessage) setSubmitMessage('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.start_time) {
      newErrors.start_time = 'Выберите дату и время начала';
    } else {
      const selectedDate = new Date(formData.start_time);
      const now = new Date();
      if (selectedDate < now) {
        newErrors.start_time = 'Нельзя выбрать прошедшую дату';
      }
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const response = await fetch('/api/bookings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          room_type: formData.room_type,
          start_time: formData.start_time,
          payment_method: formData.payment_method
        })
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Сервер вернул не JSON ответ. Проверьте, запущен ли backend сервер.');
      }
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitMessage('Заявка успешно создана!');
        setFormData({
          room_type: 'auditorium',
          start_time: '',
          payment_method: 'cash'
        });
        await fetchBookings(); 
        setShowCreateForm(false);
      } else {
        if (data.start_time) {
          setFormErrors({ start_time: data.start_time[0] });
        } else if (data.detail) {
          setSubmitMessage(data.detail);
        } else {
          setSubmitMessage('Ошибка создания заявки. Проверьте данные.');
        }
      }
    } catch (error) {
      console.error('Create booking error:', error);
      setSubmitMessage(error.message || 'Ошибка соединения с сервером');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'waiting':
        return <span className="badge bg-warning">Новая</span>;
      case 'approved':
        return <span className="badge bg-success">Мероприятие назначено</span>;
      case 'completed':
        return <span className="badge bg-info">Мероприятие завершено</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const getRoomTypeName = (type) => {
    const types = {
      'auditorium': 'Аудитория',
      'coworking': 'Коворкинг',
      'cinema': 'Кинозал'
    };
    return types[type] || type;
  };

  const getPaymentMethodName = (method) => {
    const methods = {
      'cash': 'Наличные',
      'card': 'Банковская карта',
      'cashless': 'Безналичный расчёт'
    };
    return methods[method] || method;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Заявки на бронирование</h2>
        <button 
          className="btn btn-success"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? ' Отмена' : 'Создать заявку'}
        </button>
      </div>

      {submitMessage && (
        <div className={`alert ${submitMessage.includes('успешно') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}>
          {submitMessage}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setSubmitMessage('')}
          ></button>
        </div>
      )}

      {showCreateForm && (
        <div className="card shadow mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Новая заявка</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Тип помещения</label>
                  <select 
                    className="form-select"
                    name="room_type"
                    value={formData.room_type}
                    onChange={handleChange}
                  >
                    <option value="auditorium">Аудитория</option>
                    <option value="coworking">Коворкинг</option>
                    <option value="cinema">Кинозал</option>
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Дата и время начала</label>
                  <input
                    type="datetime-local"
                    className={`form-control ${formErrors.start_time ? 'is-invalid' : ''}`}
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  {formErrors.start_time && (
                    <div className="invalid-feedback">{formErrors.start_time}</div>
                  )}
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Способ оплаты</label>
                  <select 
                    className="form-select"
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleChange}
                  >
                    <option value="cash">Наличные</option>
                    <option value="card">Банковская карта</option>
                    <option value="cashless">Безналичный расчёт</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                Отправить заявку
              </button>
            </form>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError('')}
          ></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="alert alert-info">
          <h5>У вас пока нет заявок</h5>
          <p>Создайте новую заявку на бронирование помещения!</p>
        </div>
      ) : (
        <div className="row">
          {bookings.map(booking => (
            <div key={booking.id} className="col-md-6 mb-4">
              <div className="card shadow h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Заявка #{booking.id}</span>
                  {getStatusBadge(booking.status)}
                </div>
                <div className="card-body">
                  <div className="mb-2">
                    <strong> Тип помещения:</strong> {getRoomTypeName(booking.room_type)}
                  </div>
                  <div className="mb-2">
                    <strong> Дата и время:</strong> {formatDate(booking.start_time)}
                  </div>
                  <div className="mb-2">
                    <strong> Способ оплаты:</strong> {getPaymentMethodName(booking.payment_method)}
                  </div>
                  <div className="mb-2">
                    <strong> Дата создания:</strong> {formatDate(booking.created_at)}
                  </div>
                  {booking.user_name && (
                    <div className="mb-2">
                      <strong>Пользователь:</strong> {booking.user_name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookings;