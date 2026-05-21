import { Link } from 'react-router-dom';

function Dashboard({ user }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserRole = () => {
    if (user?.is_superuser) return 'Администратор';
    if (user?.is_staff) return 'Персонал';
    return 'Пользователь';
  };

  const isAdmin = user?.is_staff || user?.is_superuser;

  return (
    <div className="container py-5">
      <h2 className="mb-4">Личный кабинет</h2>

      
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Профиль пользователя</h5>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-sm-4">
                  <strong>Логин:</strong>
                </div>
                <div className="col-sm-8">
                  {user?.username}
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-sm-4">
                  <strong>ФИО:</strong>
                </div>
                <div className="col-sm-8">
                  {user?.full_name}
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-sm-4">
                  <strong>Телефон:</strong>
                </div>
                <div className="col-sm-8">
                  {user?.phone}
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-sm-4">
                  <strong>Email:</strong>
                </div>
                <div className="col-sm-8">
                  {user?.email}
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-sm-4">
                  <strong>Роль:</strong>
                </div>
                <div className="col-sm-8">
                  <span className={`badge ${
                    user?.is_superuser ? 'bg-danger' : 
                    user?.is_staff ? 'bg-warning text-dark' : 'bg-info'
                  }`}>
                    {getUserRole()}
                  </span>
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-sm-4">
                  <strong>Дата регистрации:</strong>
                </div>
                <div className="col-sm-8">
                  {formatDate(user?.date_joined)}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card shadow mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0"> Действия</h5>
            </div>
            <div className="card-body">
              <Link to="/bookings" className="btn btn-primary w-100 mb-3">
                Мои заявки
              </Link>
              
              <Link to="/bookings?create=true" className="btn btn-success w-100 mb-3">
               Создать заявку
              </Link>
            </div>
          </div>
          
          {isAdmin && (
            <div className="card shadow bg-light">
              <div className="card-body">
                <h6 className="card-title"> Информация</h6>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;