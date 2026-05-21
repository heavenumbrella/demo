import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isAuthenticated, user, onLogout }) {
  const navigate = useNavigate();
  const isAdmin = user?.is_staff || user?.is_superuser;

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ backgroundColor: '#343A40' }}>
      <div className="container">
        <Link className="navbar-brand" to="/" style={{ color: '#FFFFFF' }}>
         <img src="/images/00.png" alt="" /> Конференция.РФ
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/"> Главная</Link>
            </li>
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Личный кабинет</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/bookings">Заявки</Link>
                </li>
              </>
            )}
          </ul>
          
          <ul className="navbar-nav ms-auto align-items-center">
            {isAuthenticated ? (
              <>
   
                <li className="nav-item">
                  <span className="nav-link" style={{ color: '#CED4DA' }}>
                    {user?.full_name || user?.username}
                    {isAdmin && (
                      <span className="badge" style={{ backgroundColor: '#28A745', marginLeft: '5px' }}>
                        
                      </span>
                    )}
                  </span>
                </li>
                
                <li className="nav-item">
                  <button 
                    className="btn btn-sm ms-2" 
                    onClick={handleLogout}
                    style={{ 
                      backgroundColor: 'transparent',
                      border: '1px solid #CED4DA',
                      color: '#CED4DA'
                    }}
                  >
                    Выйти
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Войти</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Регистрация</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;