import { Link } from 'react-router-dom';
import Slider from './Slider';

function Home() {
  const rooms = [
    {
      title: 'Аудитория',
      description: 'Вместимость до 100 человек, проектор, доска, звуковое оборудование',
      borderColor: '#343A40'
    },
    {
      title: 'Коворкинг',
      description: 'Открытое пространство для совместной работы, переговорные комнаты',
      borderColor: '#343A40'
    },
    {
      title: 'Кинозал',
      description: 'Профессиональный экран, система объемного звука, 50 мест',
      borderColor: '#343A40'
    }
  ];

  return (
    <div className="w-100">
      <div className="w-100">
        <Slider />
      </div>
      
      <div className="section-full-width" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <h2 className="text-center mb-3" style={{ color: '#343A40' }}>
            Наши помещения
          </h2>
          <p className="text-center mb-5" style={{ color: '#343A40' }}>
            Выберите подходящее помещение для вашего мероприятия
          </p>
          
          <div className="row g-4">
            {rooms.map((room, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div 
                
                  className="card shadow-sm h-100" 
                  style={{ borderColor: room.borderColor }}
                >
                  <div className="card-body text-center p-4">
                    <div style={{ fontSize: '4rem' }} className="mb-3">
                      {room.image}
                    </div>
                  
                    <h4 className="card-title mb-3" style={{ color: '#343A40' }}>
                      {room.title}
                      
                    </h4>
                    
                    <p className="card-text" style={{ color: '#343A40' }}>
                      {room.description}
                      
                    </p>
                    <Link 
                      to="/bookings?create=true" 
                      className="btn mt-3"
                      style={{ 
                        backgroundColor: '#28A745',
                        borderColor: '#28A745',
                        color: '#FFFFFF'
                      }}
                    >
                      Забронировать
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-full-width" style={{ backgroundColor: '#343A40' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h2 className="mb-3" style={{ color: '#FFFFFF' }}>
                Готовы забронировать помещение?
              </h2>
              <p className="lead mb-0" style={{ color: '#CED4DA' }}>
                Присоединяйтесь к нам !
              </p>
            </div>
            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
              <Link 
                to="/register" 
                className="btn btn-lg me-2"
                style={{ backgroundColor: '#FFFFFF', color: '#343A40' }}
              >
                Регистрация
              </Link>
              <Link 
                to="/login" 
                className="btn btn-lg"
                style={{ 
                  backgroundColor: 'transparent',
                  borderColor: '#FFFFFF',
                  color: '#FFFFFF'
                }}
              >
                Войти
              </Link>
              <img src="/images/soc.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;