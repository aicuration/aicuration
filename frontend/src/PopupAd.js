import React, { useState, useEffect } from 'react';

const PopupAd = ({ onClose, onDontShowToday }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // 스크롤 위치 기억 및 복원
  useEffect(() => {
    // 팝업이 열릴 때 현재 스크롤 위치 저장
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    
    // 팝업이 닫힐 때 스크롤 위치 복원하는 함수
    const restoreScroll = () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
    
    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      restoreScroll();
    };
  }, []);
  
  // 자동 슬라이드 기능
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === adData.length - 1 ? 0 : prevSlide + 1
      );
    }, 3000); // 3초마다 자동 슬라이드

    return () => clearInterval(interval);
  }, []);
  
  // 팝업 광고 데이터
  const adData = [
    {
      title: "광주관광 루트찾기 앱 출시",
      subtitle: "광주와 함께하는 특별한 여행",
      description: "광주관광 루트찾기 앱이 출시되었습니다!",
      mainImage: "/popup/popup-ad-0.jpg",
      buttonText: "앱 이용하기 →",
      leftIcon: "📱",
      rightIcon: "🚀"
    },
    {
      title: "광주투어 어서오랑깨",
      subtitle: "광주와 함께하는 특별한 여행",
      description: "광주의 아름다운 풍경과 문화를 만나보세요!",
      mainImage: "/popup/popup-ad-1.jpg",
      buttonText: "광주 투어 시작하기 →",
      leftIcon: "🏞️",
      rightIcon: "🌸"
    },
    {
      title: "GDB ART PASS",
      subtitle: "KOREA ART FESTIVAL",
      description: "광주 비엔날레와 함께하는 예술의 세계!",
      mainImage: "/popup/popup-ad-2.jpg", 
      buttonText: "예술 축제 보러가기 →",
      leftIcon: "🎨",
      rightIcon: "🏛️"
    },
    {
      title: "여행지는 밤, 9시부터",
      subtitle: "광주관광 야경투어",
      description: "광주의 아름다운 야경을 감상해보세요!",
      mainImage: "/popup/popup-ad-3.jpg",
      buttonText: "야경 투어 예약하기 →", 
      leftIcon: "🌙",
      rightIcon: "✨"
    },
    {
      title: "9월 2회차",
      subtitle: "오늘대인루이",
      description: "광주의 특별한 축제에 참여해보세요!",
      mainImage: "/popup/popup-ad-4.jpg",
      buttonText: "축제 정보 보기 →", 
      leftIcon: "🎉",
      rightIcon: "🎪"
    }
  ];

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  const handleClose = () => {
    // 스크롤 위치 복원
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    onClose();
  };

  const handleDontShowToday = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    localStorage.setItem('popupAdHiddenUntil', tomorrow.getTime());
    onDontShowToday();
  };

  return (
    <div className="popup-ad-overlay">
      <div className="popup-ad-container">
        <div className="popup-ad-content">
          {/* 메인 이미지 */}
          <div className="popup-ad-main-image">
            <img src={adData[currentSlide].mainImage} alt="광고 이미지" />
          </div>

          {/* 페이지네이션 점들 */}
          <div className="popup-ad-dots">
            {adData.map((_, index) => (
              <button
                key={index}
                className={`popup-ad-dot ${currentSlide === index ? 'active' : ''}`}
                onClick={() => handleSlideChange(index)}
              />
            ))}
          </div>

          {/* 닫기 버튼 */}
          <button className="popup-ad-close-btn" onClick={handleClose}>
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupAd;
