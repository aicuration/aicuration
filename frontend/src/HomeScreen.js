import React, { useState, useEffect } from 'react';
import PopupAd from './PopupAd';

const HomeScreen = ({ onNavigateToPage, isLoggedIn, showToast }) => {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [showPopupAd, setShowPopupAd] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [selectedAnnouncementImage, setSelectedAnnouncementImage] = useState('');

  // 배너 데이터 (BannerPage에서 가져옴)
  const homeBanners = [
    {
      id: 1,
      title: "빛고을, 광주",
      subtitle: "Discover Gwangju",
      type: "video",
      description: "전통과 현대가 어우러진 광주의 매력을 만나보세요. 무등산의 웅장함부터 아시아문화전당까지, 광주의 모든 것을 경험해보세요.",
      videoUrl: "https://www.youtube.com/embed/vlnV3JyC5uQ?autoplay=1&mute=1&loop=1&playlist=vlnV3JyC5uQ",
      backgroundImage: "/images/gwangjuriver.jpg"
    },
    {
      id: 2,
      title: "무등산",
      subtitle: "Mudeungsan",
      type: "image",
      description: "광주의 상징인 무등산의 아름다운 일출과 일몰을 감상하며, 자연의 신비로움을 만끽해보세요.",
      backgroundImage: "/images/mudeungsan.jpg"
    },
    {
      id: 3,
      title: "5.18 기념공원",
      subtitle: "May 18th Memorial Park",
      type: "image",
      description: "민주주의의 역사를 간직한 의미 있는 공간. 5.18 민주화운동의 숭고한 정신을 기리는 기념공원입니다.",
      backgroundImage: "/images/5.18_memorial_park.jpg"
    },
    {
      id: 4,
      title: "아시아문화전당",
      subtitle: "Asia Culture Center",
      type: "image",
      description: "아시아 문화의 중심지, 창의와 소통의 공간. 다양한 전시와 공연이 열리는 아시아문화전당입니다.",
      backgroundImage: "/images/asia_culture_center.jpg"
    },
    {
      id: 5,
      title: "송정 떡갈비거리",
      subtitle: "Songjeong Ddeokgalbi Street",
      type: "image",
      description: "광주의 대표적인 맛집 거리. 송정 떡갈비거리에서 광주의 전통 맛을 경험해보세요.",
      backgroundImage: "/images/songjeong_ddeokgalbi_street.jpg"
    },
    {
      id: 6,
      title: "대인시장",
      subtitle: "Daein Market",
      type: "image",
      description: "광주의 대표적인 전통시장. 대인시장에서 광주의 진짜 맛과 정취를 만나보세요. 신선한 재료와 정성스러운 손맛으로 만든 다양한 먹거리들이 가득한 특별한 장소입니다.",
      backgroundImage: "/images/daein_market.jpg"
    }
  ];

  // 자동 슬라이드 (8초마다)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % homeBanners.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [homeBanners.length]);

  // 팝업 광고 표시 (개발용 - 항상 표시)
  useEffect(() => {
    // 홈화면 진입 시 바로 팝업 표시
    setShowPopupAd(true);
  }, []);

  const handleClosePopupAd = () => {
    setShowPopupAd(false);
  };

  const handleDontShowToday = () => {
    setShowPopupAd(false);
  };

  // 배너 슬라이더 네비게이션
  const handlePrevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + homeBanners.length) % homeBanners.length);
  };

  const handleNextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % homeBanners.length);
  };

  const handleDotClick = (index) => {
    setCurrentBanner(index);
  };

  // 배너 데이터
  const banners = [
    {
      id: 'culture-tour',
      image: '/banners/banners_01.jpg',
      title: '빛고을',
      subtitle: '컬처투어',
      description: '광주의 문화를 만나보세요',
      url: 'https://www.instagram.com/explore/tags/광주문화투어/',
      overlayPosition: 'left'
    },
    {
      id: 'night-tour',
      image: '/banners/banners_02.jpg',
      title: '광주야간관광',
      subtitle: '',
      description: '밤의 광주를 만나보세요',
      url: 'https://www.instagram.com/explore/tags/광주야간관광/',
      overlayPosition: 'center'
    },
    {
      id: 'culture-tour-2',
      image: '/banners/banners_03.jpg',
      title: '빛고을',
      subtitle: '컬처투어',
      description: '광주의 문화를 만나보세요',
      url: 'https://www.instagram.com/explore/tags/광주문화투어/',
      overlayPosition: 'center'
    },
    {
      id: 'food-tour',
      image: '/banners/banners_04.jpg',
      title: '광주 맛집 탐방',
      subtitle: '',
      description: '광주의 맛있는 음식을 찾아보세요',
      url: 'https://www.instagram.com/explore/tags/광주맛집/',
      overlayPosition: 'center'
    },
    {
      id: 'autumn-tour',
      image: '/banners/banners_05.jpg',
      title: '광주 가을 여행',
      subtitle: '',
      description: '가을 광주의 아름다움을 만나보세요',
      url: 'https://www.instagram.com/explore/tags/광주가을여행/',
      overlayPosition: 'center'
    }
  ];


  const handleCardClick = (page) => {
    onNavigateToPage(page);
  };

  const handleSwapLocations = () => {
    const temp = departure;
    setDeparture(destination);
    setDestination(temp);
  };

  const handleRouteSearch = () => {
    if (!departure.trim() || !destination.trim()) {
      if (showToast) {
        showToast('출발지와 도착지를 모두 입력해주세요.', 'info');
      } else {
        alert('출발지와 도착지를 모두 입력해주세요.');
      }
      return;
    }

    // Google Maps URL 생성
    const encodedDeparture = encodeURIComponent(departure.trim());
    const encodedDestination = encodeURIComponent(destination.trim());
    const googleMapsUrl = `https://www.google.com/maps/dir/${encodedDeparture}/${encodedDestination}`;
    
    // 새 탭에서 Google Maps 열기
    window.open(googleMapsUrl, '_blank');
  };

  const handleAnnouncementClick = (index) => {
    const announcementImages = [
      '/announcement/anno1.jpg',
      '/announcement/anno2.jpg'
    ];
    
    // 첫 번째와 두 번째 공지사항만 이미지가 있음 (세 번째는 빈칸)
    if (index < announcementImages.length) {
      setSelectedAnnouncementImage(announcementImages[index]);
      setShowAnnouncementModal(true);
    }
  };

  const handleCloseAnnouncementModal = () => {
    setShowAnnouncementModal(false);
    setSelectedAnnouncementImage('');
  };

  const handleSurveyClick = () => {
    if (isLoggedIn) {
      onNavigateToPage('survey');
    } else {
      onNavigateToPage('profile');
    }
  };

  return (
    <div className="home-screen">
      {/* 환영 메시지 */}
      <div className="welcome-section">
        <h1 className="welcome-title">Enjoy, Have a good Gwangju!</h1>
        <p className="welcome-subtitle">스마트관광앱으로 나만의 관광코스를 찾는 기회 !!</p>
      </div>

      {/* 홈 배너 슬라이더 */}
      <div className="home-banner-slider">
        <div className="home-banner-container">
          {homeBanners.map((banner, index) => (
            <div
              key={banner.id}
              className={`home-banner-slide ${index === currentBanner ? 'active' : ''}`}
            >
              <div className="home-banner-content">
                <div className="home-banner-media">
                  {banner.type === 'video' ? (
                    <div className="home-video-container">
                      <iframe
                        src={banner.videoUrl}
                        title={banner.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="home-banner-video"
                      ></iframe>
                    </div>
                  ) : (
                    <div className="home-image-container">
                      <img 
                        src={banner.backgroundImage} 
                        alt={banner.title}
                        className="home-banner-image"
                      />
                    </div>
                  )}
                </div>
                
                <div className="home-banner-text">
                  <h1 className="home-banner-title">{banner.title}</h1>
                  <h2 className="home-banner-subtitle">{banner.subtitle}</h2>
                  <p className="home-banner-description">{banner.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 네비게이션 화살표 */}
        <button className="home-nav-arrow home-nav-arrow-left" onClick={handlePrevBanner}>
          ‹
        </button>
        <button className="home-nav-arrow home-nav-arrow-right" onClick={handleNextBanner}>
          ›
        </button>

        {/* 도트 인디케이터 */}
        <div className="home-dot-indicators">
          {homeBanners.map((_, index) => (
            <button
              key={index}
              className={`home-dot ${index === currentBanner ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </div>

      {/* 검색/경로 섹션 */}
      <div className="search-section">
        <div className="search-header">
          <div className="search-label">출발지</div>
          <div className="search-label">도착지</div>
        </div>
        <div className="search-content">
          <input 
            type="text" 
            placeholder="출발지 입력" 
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className="search-input-field"
          />
          <div className="search-swap-arrow" onClick={handleSwapLocations}>⇄</div>
          <input 
            type="text" 
            placeholder="도착지 입력" 
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="search-input-field"
          />
        </div>
        <button className="search-button" onClick={handleRouteSearch}>빠른 루트 검색</button>
      </div>

      {/* 4개 메인 카드 (한 줄 배치) */}
      <div className="main-cards">
        <div className="card-row">
          <div className="main-card" onClick={() => handleCardClick('profile')}>
            <h3>추천 루트</h3>
            <p>인기 루트를 확인해보세요</p>
          </div>
          <div className="main-card" onClick={() => handleCardClick('spots')}>
            <h3>정보 찾기</h3>
            <p>관광지를 검색해보세요</p>
          </div>
          <div className="main-card" onClick={() => onNavigateToPage('tours')}>
            <h3>투어 선택</h3>
            <p>외부 투어 정보를 확인하세요</p>
          </div>
          {/* ✅ 여기부터 새로 추가되는 스탬프 투어 카드 */}
          <div className="main-card" onClick={() => handleCardClick('stamp-tour')}>
            <h3>스탬프 투어</h3>
            <p>현장 도착 시 GPS로 스탬프를 찍어보세요</p>
          </div>
          {/* ✅ 여기까지 */}          
          <div className="main-card" onClick={() => window.open('https://afterwork.co.kr/app/home', '_blank')}>
            <h3>광주 축제</h3>
            <p>다양한 축제를 즐겨보세요</p>
          </div>
        </div>
      </div>

      {/* 하단 정보 섹션 */}
      <div className="info-section">
        {/* 광고 배너 */}
        <div className="ad-banners">
          {banners.map((banner, index) => (
            <div 
              key={banner.id}
              className="ad-banner single-banner"
              onClick={() => window.open(banner.url, '_blank')}
            >
              <img src={banner.image} alt={banner.title} />
            </div>
          ))}
        </div>

        {/* 공지사항 */}
        <div className="notices">
          <div className="notice-header">
            <h3>공지사항</h3>
          </div>
          <div className="notice-list">
            <div className="notice-item" onClick={() => handleAnnouncementClick(0)} style={{cursor: 'pointer'}}>최적의 경로로 이동해요! 나만의 취향대로 일정을 짜고 최적의 동선을 안내받으세요.</div>
            <div className="notice-item" onClick={() => handleAnnouncementClick(1)} style={{cursor: 'pointer'}}>G-Route Planning 기능 업데이트! 지도에서 간편하게 여행 순서를 편집할 수 있습니다.</div>
            <div className="notice-item">내용을 입력해주세요</div>
          </div>
        </div>

        {/* SNS 링크 */}
        <div className="sns-links">
          <button onClick={() => window.open('https://www.instagram.com/visitgwangju/', '_blank')}>
            <img src="/sns_icons/instargram.png" alt="Instagram" style={{width: '15px', height: '15px', marginRight: '8px'}} />
            Instagram
          </button>
          <button onClick={() => window.open('https://www.facebook.com/visitgwangju/', '_blank')}>
            <img src="/sns_icons/facebook.png" alt="Facebook" style={{width: '15px', height: '15px', marginRight: '8px'}} />
            Facebook
          </button>
          <button onClick={() => window.open('https://www.youtube.com/@livegwangju', '_blank')}>
            <img src="/sns_icons/youtube.png" alt="YouTube" style={{width: '15px', height: '15px', marginRight: '8px'}} />
            YouTube
          </button>
        </div>

        {/* 하단 메뉴 */}
        <div className="footer-menu">
          <p></p>
        </div>
      </div>

      {/* 팝업 광고 */}
      {showPopupAd && (
        <PopupAd 
          onClose={handleClosePopupAd}
          onDontShowToday={handleDontShowToday}
        />
      )}

      {/* 공지사항 이미지 팝업 */}
      {showAnnouncementModal && (
        <div className="popup-ad-overlay" onClick={handleCloseAnnouncementModal}>
          <div className="popup-ad-container" onClick={(e) => e.stopPropagation()}>
            <button className="popup-ad-close-btn" onClick={handleCloseAnnouncementModal}>×</button>
            <img src={selectedAnnouncementImage} alt="공지사항" className="popup-ad-image" />
          </div>
        </div>
      )}

      {/* 플로팅 설문조사 버튼 */}
      <button className="floating-survey-button" onClick={handleSurveyClick} title="설문조사 참여하기">
        <div className="button-icon">
          <img src="/main_icons/main_1.png" alt="설문조사" />
        </div>
        <div className="button-text">설문조사</div>
      </button>
    </div>
  );
};

export default HomeScreen;
