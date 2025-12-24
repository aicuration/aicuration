import React, { useState, useEffect } from 'react';

const SearchModal = ({ isOpen, onClose, spots, onSpotSelect, getThemeNameById, getSpotImage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSpots, setFilteredSpots] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setFilteredSpots([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSpots([]);
      return;
    }

    const filtered = spots.filter(spot =>
      spot.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    console.log('🔍 검색어:', searchTerm);
    console.log('🔍 필터링된 결과:', filtered.map(spot => spot.name));
    
    setFilteredSpots(filtered);
  }, [searchTerm, spots]);

  const handleSpotClick = (spot) => {
    onSpotSelect(spot);
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && filteredSpots.length > 0) {
      handleSpotClick(filteredSpots[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <h2>관광지 검색</h2>
          <button className="search-close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="search-input-container">
          <img 
            src="/icons/search-icon.png" 
            alt="검색" 
            className="search-input-icon"
          />
          <input
            type="text"
            placeholder="관광지 이름을 입력하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="search-input"
            autoFocus
          />
        </div>

        <div className="search-results">
          {searchTerm.trim() === '' ? (
            <div className="search-placeholder">
              <p>관광지 이름을 입력하여 검색하세요</p>
            </div>
          ) : filteredSpots.length === 0 ? (
            <div className="search-no-results">
              <p>'{searchTerm}'에 대한 검색 결과가 없습니다</p>
            </div>
          ) : (
            <div className="search-results-list">
              {filteredSpots.map((spot) => (
                <div
                  key={spot.id}
                  className="search-result-item"
                  onClick={() => handleSpotClick(spot)}
                >
                  <div className="search-result-image">
                    <img 
                      src={getSpotImage ? getSpotImage(spot.image_url, spot.id, spot.theme_id, spot.name) : '/images/default-spot.jpg'} 
                      alt={spot.name}
                      onError={(e) => {
                        e.target.src = '/images/default-spot.jpg';
                      }}
                    />
                  </div>
                  <div className="search-result-info">
                    <div className="search-result-title">
                      <h3>{spot.name}</h3>
                      <span className="search-result-theme">
                        {getThemeNameById ? getThemeNameById(spot.theme_id) : '전체'}
                      </span>
                    </div>
                    <p className="search-result-address">{spot.address}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
