import React from 'react';

const CommonHeader = ({ 
  onNavigateToHome, 
  title, 
  showBackButton = false, 
  onBack,
  onMenuClick,
  onBackClick,
  onSearchClick
}) => {
  return (
    <div className="common-header">
      <div className="header-left">
        {showBackButton ? (
          <button className="back-button" onClick={onBack}>
            ← 뒤로
          </button>
        ) : (
          <div className="header-logo">
            <h2 onClick={onNavigateToHome} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px' }}>
              <img src="/main_icons/main_2.png" alt="광주관광 루트찾기" style={{width: '40px', height: '40px'}} />
              광주관광 루트찾기
            </h2>
          </div>
        )}
      </div>
      
      {title && (
        <div className="header-center">
          <h1>{title}</h1>
        </div>
      )}
      
      <div className="header-actions">
        <button className="action-btn" onClick={onSearchClick}>
          <img src="/icons/search-icon.png" alt="검색" style={{width: '32px', height: '32px'}} />
        </button>
        <button className="action-btn">
          <img src="/icons/notification-icon.png" alt="알림" style={{width: '32px', height: '32px'}} />
        </button>
        <button className="action-btn" onClick={onMenuClick}>
          <img src="/icons/menu-icon.png" alt="메뉴" style={{width: '32px', height: '32px'}} />
        </button>
      </div>
    </div>
  );
};

export default CommonHeader;
