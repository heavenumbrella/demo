import { Carousel } from 'react-bootstrap';

function Slider() {
  const slides = [
    {
      title: 'Аудитория',
      description: 'Просторные аудитории для конференций до 100 человек',
      image: '/images/123123123.jpg',

    },
    {
      title: 'Коворкинг',
      description: 'Современные коворкинг-пространства для командной работы',
      image: '/images/52.jpg',

    },
    {
      title: 'Кинозал',
      description: 'Кинозал для презентаций и показов с профессиональным оборудованием',
      image: '/images/67.jpg',
    },
    {
      title: 'Конференция.РФ',
      description: 'Это лучшее что вы выбирали',
      image: '/images/667.png',
    }
  ];

  return (
    <Carousel>
      {slides.map((slide, index) => (
        <Carousel.Item key={index} interval={3000}>
          <div 
            style={{
              width: '100%',
              height: '500px',
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: '#2c3e50'
            }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                position: 'absolute',
                top: 0,
                left: 0
              }}
              onError={(e) => {

                e.target.style.display = 'none';
              }}
            />
            

            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1
            }} />
            

            <Carousel.Caption style={{ zIndex: 2 }}>
              <div style={{ fontSize: '5rem', marginBottom: '20px' }}>
                {slide.icon}
              </div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                {slide.title}
              </h3>
              <p style={{ fontSize: '1.2rem' }}>
                {slide.description}
              </p>
            </Carousel.Caption>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default Slider;