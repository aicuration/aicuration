import React, { useState, useEffect } from 'react';

const BannerPage = ({ onNavigateToHome }) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  
  const banners = [
    {
      id: 1,
      image: "/slide/slide_1.png"
    },
    {
      id: 2,
      image: "/slide/slide_2.png"
    },
    {
      id: 3,
      image: "/slide/slide_3.png"
    }
  ];

  // 자동 슬라이드 (10초마다)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const handlePrev = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const handleDotClick = (index) => {
    setCurrentBanner(index);
  };

  return (
    <div className="banner-page">
      {/* 홈으로 돌아가기 버튼 */}
      <button className="banner-home-button" onClick={onNavigateToHome}>
        ✕
      </button>
      
      {/* 메인 배너 슬라이더 */}
      <div className="banner-slider">
        <div className="banner-container">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`banner-slide ${index === currentBanner ? 'active' : ''}`}
            >
              <div className="banner-content">
                <img 
                  src={banner.image} 
                  alt={`슬라이드 ${banner.id}`}
                  className="banner-slide-image"
                />
              </div>
            </div>
          ))}
        </div>

        {/* 네비게이션 화살표 */}
        <button className="nav-arrow nav-arrow-left" onClick={handlePrev}>
          ‹
        </button>
        <button className="nav-arrow nav-arrow-right" onClick={handleNext}>
          ›
        </button>

        {/* 도트 인디케이터 */}
        <div className="dot-indicators">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentBanner ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default BannerPage;