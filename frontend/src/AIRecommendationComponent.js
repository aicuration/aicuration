import React, { useState, useEffect } from 'react';

/**
 * AI 추천 컴포넌트
 * 사용자의 저장된 루트를 분석하여 맞춤형 추천 루트를 제공하는 컴포넌트
 * 
 * @param {Object} currentRoute - 현재 선택된 루트 정보
 * @param {Array} spots - 전체 관광지 목록
 * @param {Array} themes - 테마 목록
 * @param {Function} onRouteSelect - 루트 선택 시 호출되는 콜백 함수
 * @param {Function} onAddToRoute - 루트에 관광지 추가 시 호출되는 콜백 함수
 * @param {Boolean} isLoggedIn - 로그인 상태
 * @param {Boolean} hasSavedRoutes - 저장된 루트 존재 여부
 * @param {Function} onNavigateToMap - 지도 페이지로 이동하는 콜백 함수
 * @param {Array} recommendations - 부모 컴포넌트에서 전달받은 추천 루트 목록
 * @param {Object} analysis - 추천 분석 정보
 * @param {Function} onRefresh - 추천 새로고침 콜백 함수
 * @param {Function} onSaveRoute - 추천 루트 저장 콜백 함수
 */
const AIRecommendationComponent = ({ 
  currentRoute, 
  spots, 
  themes, 
  onRouteSelect,
  onAddToRoute,
  isLoggedIn = false,
  hasSavedRoutes = false,
  onNavigateToMap = null,
  recommendations = null,
  analysis = null,
  showToast = null,
  onRefresh = null,
  onSaveRoute = null,
}) => {
  // 로컬 상태 관리
  const [localRecommendations, setLocalRecommendations] = useState([]); // 로컬에서 관리하는 추천 루트 목록
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(''); // 에러 메시지
  const [localAnalysis, setLocalAnalysis] = useState(null); // 로컬에서 관리하는 분석 정보

  // ======================================================
  // ✅ [추가] 추천 결과가 "생겼을 때" 콘솔에 설명 로그 출력 (정리 버전)
  // - 부모 onRefresh로 받아온 recommendations/analysis에도 동작
  // - 로컬 fetch로 만든 localRecommendations/localAnalysis에도 동작
  // ======================================================
  useEffect(() => {
    const recs = recommendations || localRecommendations;
    const ana = analysis || localAnalysis;

    if (!recs || recs.length === 0) return;

    const THEME_NAMES = {1:'쇼핑',2:'역사',3:'문화',4:'음식',5:'자연',6:'체험',7:'숙박',8:'근교'};

    const themeCountFromSpots = (spotsArr = []) =>
      (spotsArr || []).reduce((acc, s) => {
        const k = String(s?.theme_id ?? '기타');
        acc[k] = (acc[k] || 0) + 1;
        return acc;
      }, {});

    const formatThemePattern = (pattern = {}) => {
      const entries = Object.entries(pattern || {});
      if (entries.length === 0) return '정보 없음';
      return entries
        .map(([k, v]) => `${THEME_NAMES[Number(k)] || '기타'} ${v}개`)
        .join(', ');
    };

    // basePattern vs candPattern 유사도(0~1) = min합 / max합
    const similarityByThemeCounts = (basePattern = {}, candPattern = {}) => {
      const keys = new Set([...Object.keys(basePattern), ...Object.keys(candPattern)]);
      let overlap = 0;
      let denom = 0;

      keys.forEach((k) => {
        const b = Number(basePattern[k] || 0);
        const c = Number(candPattern[k] || 0);
        overlap += Math.min(b, c);
        denom += Math.max(b, c);
      });

      if (denom === 0) return 0;
      return overlap / denom;
    };

    // 서버 analysis.theme_pattern(있으면 그걸 기준)
    // 없으면 currentRoute.spots에서 계산(가능할 때만)
    const basePatternFromServer = ana?.theme_pattern || null;
    const baseSpots = currentRoute?.spots || null;
    const basePatternFromCurrent = baseSpots ? themeCountFromSpots(baseSpots) : null;
    const basePattern = basePatternFromServer || basePatternFromCurrent || {};

    // 로그 시작
    console.groupCollapsed("🧠 추천 설명(자동 로그)");
    console.log("기준 루트명:", ana?.based_on_route || "(based_on_route 없음)");
    if (ana?.spot_count != null) console.log("기준 루트 관광지 개수:", ana.spot_count);
    console.log("기준 테마 패턴:", formatThemePattern(basePattern));

    console.log("추천 방식(간략): 저장된 루트의 테마 분포(예: 문화 1, 자연 1)를 패턴으로 삼고, 유사한 테마 조합/개수를 갖는 루트를 추천합니다. (세부 점수/후보 선정은 서버 로직)");

    recs.forEach((r) => {
      const candPattern = themeCountFromSpots(r.spots || []);
      const sim = similarityByThemeCounts(basePattern, candPattern);
      const simPct = Math.round(sim * 100);

      console.groupCollapsed(`🗺️ 추천 루트 ${r.id} | ${r.name} | 테마 유사도 ${simPct}%`);
      console.log("추천 루트 테마 패턴:", formatThemePattern(candPattern));
      console.log("추천 루트 관광지 개수:", r.spots?.length ?? 0);

      if (Array.isArray(r.spots)) {
        console.log("추천 관광지(순서):", r.spots.map(s => s?.name).filter(Boolean).join(" → "));
        console.table((r.spots || []).map((s, idx) => ({
          순서: idx + 1,
          관광지: s?.name,
          테마: THEME_NAMES[s?.theme_id] || '기타'
        })));
      }

      console.groupEnd();
    });

    console.groupEnd();
  }, [recommendations, analysis, localRecommendations, localAnalysis, currentRoute]);
  // ======================================================

  /**
   * 루트 추천 함수
   * 백엔드 API를 호출하여 사용자의 저장된 루트를 분석하고 맞춤형 추천 루트를 받아옴
   * 로그인 상태와 저장된 루트가 필요함
   */
  const handleRouteRecommendation = async () => {
    setLoading(true); // 로딩 시작
    setError(''); // 에러 초기화
    
    try {
      // 로그인 상태 확인
      if (!isLoggedIn) {
        setLocalRecommendations([]);
        setError('로그인 후 이용해 주세요.');
        return;
      }

      // 백엔드 API 호출: 최대 5개의 추천 루트 요청
      const response = await fetch(`/api/ai/recommendations/routes?limit=5`, {
        credentials: 'include' // 쿠키를 포함하여 세션 정보 전달
      });
      
      // 응답 상태 확인
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status}: ${text}`);
      }
      
      const data = await response.json();
      
      // API에서 에러 응답이 온 경우
      if (data.error) {
        setError(data.error);
        setLocalRecommendations([]);
        setLocalAnalysis(null);
        return;
      }
      
      // 추천 루트와 분석 정보를 상태에 저장
      setLocalRecommendations(data.recommended_routes || []);
      setLocalAnalysis(data.analysis || null);
    } catch (error) {
      // 에러 처리
      console.error('루트 추천 실패:', error);
      setError('추천 중 오류가 발생했습니다. 다시 시도해 주세요.');
      setLocalRecommendations([]);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  /**
   * 테마별 색상 반환 함수
   * 각 테마 ID에 해당하는 고유 색상을 반환하여 UI에서 테마 구분에 사용
   * @param {Number} themeId - 테마 ID
   * @returns {String} 테마 색상 (HEX 코드)
   */
  const getThemeColor = (themeId) => {
    const colors = {
      1: '#FF6B6B',   // 쇼핑
      2: '#4ECDC4',   // 역사
      3: '#45B7D1',   // 문화
      4: '#96CEB4',   // 음식
      5: '#FFEAA7',   // 자연
      6: '#FF9500',   // 체험
      7: '#A8E6CF',   // 숙박
      8: '#9B59B6',   // 근교
    };
    return colors[themeId] || '#4A90E2'; // 기본 색상
  };

  /**
   * 테마 이름 반환 함수
   * 테마 ID를 받아 해당하는 테마 이름을 반환
   * @param {Number} themeId - 테마 ID
   * @returns {String} 테마 이름
   */
  const getThemeName = (themeId) => {
    const theme = themes.find(t => t.id === themeId);
    return theme ? theme.name : '기타';
  };

  /**
   * 스팟 아이콘 반환 함수
   * 테마 ID에 해당하는 이모지 아이콘을 반환하여 시각적 구분에 사용
   * @param {Number} themeId - 테마 ID
   * @returns {String} 이모지 아이콘
   */
  const getSpotIcon = (themeId) => {
    const icons = {
      1: '🛍️',        // 쇼핑
      2: '🏛️',        // 역사
      3: '🎭',        // 문화
      4: '🍜',        // 음식
      5: '🌿',        // 자연
      6: '🏃‍♂️',        // 체험
      7: '🏨',        // 숙박
      8: '🏞️',        // 근교
    };
    return icons[themeId] || '📍'; // 기본 아이콘
  };

  /**
   * 루트 총 거리 계산 함수
   * 루트에 포함된 모든 관광지 간의 직선 거리를 합산하여 총 거리를 반환
   * @param {Array} spots - 관광지 배열
   * @returns {Number} 총 거리 (km)
   */
  const calculateRouteDistance = (spots) => {
    if (spots.length < 2) return 0; // 관광지가 2개 미만이면 거리 0
    
    let totalDistance = 0;
    // 연속된 관광지 간의 거리를 모두 합산
    for (let i = 0; i < spots.length - 1; i++) {
      const spot1 = spots[i];
      const spot2 = spots[i + 1];
      
      // 좌표가 존재하는 경우에만 거리 계산
      if (spot1.latitude && spot1.longitude && spot2.latitude && spot2.longitude) {
        const distance = calculateDistance(
          spot1.latitude, spot1.longitude,
          spot2.latitude, spot2.longitude
        );
        totalDistance += distance;
      }
    }
    return totalDistance;
  };

  /**
   * 두 지점 간의 직선 거리 계산 함수 (Haversine 공식)
   * 위도와 경도를 사용하여 지구상의 두 지점 간의 직선 거리를 계산
   * @param {Number} lat1 - 첫 번째 지점의 위도
   * @param {Number} lon1 - 첫 번째 지점의 경도
   * @param {Number} lat2 - 두 번째 지점의 위도
   * @param {Number} lon2 - 두 번째 지점의 경도
   * @returns {Number} 거리 (km)
   */
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 지구의 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180; // 위도 차이를 라디안으로 변환
    const dLon = (lon2 - lon1) * Math.PI / 180; // 경도 차이를 라디안으로 변환
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // 최종 거리 계산
  };

  /**
   * 루트 예상 소요 시간 계산 함수
   * 거리에 따라 적절한 교통수단을 선택하고 예상 소요 시간을 계산
   * @param {Number} distance - 총 거리 (km)
   * @returns {String} 예상 소요 시간과 교통수단 정보 (예: "2시간 30분 (자동차)")
   */
  const calculateRouteTime = (distance) => {
    let speed, transportMode;
    
    // 거리에 따른 교통수단 선택 및 속도 설정
    if (distance <= 5) {
      speed = 4;
      transportMode = '도보';
    } else if (distance <= 15) {
      speed = 15;
      transportMode = '자전거';
    } else {
      speed = 40;
      transportMode = '자동차';
    }
    
    const timeInHours = distance / speed;
    const hours = Math.floor(timeInHours);
    const minutes = Math.round((timeInHours - hours) * 60);
    
    let timeString;
    if (hours === 0) timeString = `${minutes}분`;
    else if (minutes === 0) timeString = `${hours}시간`;
    else timeString = `${hours}시간 ${minutes}분`;
    
    return `${timeString} (${transportMode})`;
  };

  return (
    <div className="recommendation-container">
      <div className="recommendation-header">
      </div>
      
      <div className="recommendation-types">
        <button 
          className={`type-button ${isLoggedIn ? 'active' : 'disabled'}`}
          onClick={onRefresh || handleRouteRecommendation}
          disabled={!isLoggedIn || loading}
        >
          루트 추천
        </button>
      </div>

      {(recommendations || localRecommendations).length > 0 && (
        <div className="recommendations-section">
          <h3 className="section-title">
            추천하는 맞춤형 루트
          </h3>
          
          {(analysis || localAnalysis) && (
            <div className="analysis-info">
              <p className="analysis-text">
                <strong>"{(analysis || localAnalysis).based_on_route}"</strong> 루트를 분석하여 추천했습니다
              </p>
              <div className="analysis-details">
                <span className="analysis-detail">관광지 개수: {(analysis || localAnalysis).spot_count}개</span>
                <span className="analysis-detail">
                  테마 패턴: {Object.entries((analysis || localAnalysis).theme_pattern).map(([theme_id, count]) => {
                    const themeNames = {1: '쇼핑', 2: '역사', 3: '문화', 4: '음식', 5: '자연', 6: '체험', 7: '숙박', 8: '근교'};
                    return `${themeNames[theme_id] || '기타'} ${count}개`;
                  }).join(', ')}
                </span>
              </div>
            </div>
          )}
          
          <div className="recommendations-list">
            {(recommendations || localRecommendations).map((item) => (
              <div key={item.id} className="recommendation-card">
                <div className="recommendation-header">
                  <h4 className="recommendation-title">{item.name}</h4>
                </div>
                
                <div className="route-info">
                  <p className="route-description">{item.description}</p>
                  <div className="route-stats">
                    <span className="route-stat">
                      {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} · 
                      {calculateRouteTime(calculateRouteDistance(item.spots))} · 
                      {calculateRouteDistance(item.spots).toFixed(1)}km
                    </span>
                  </div>
                </div>
                
                {item.spots && (
                  <div className="recommendation-spots">
                    {item.spots.map((spot, index) => (
                      <div key={spot.id} className="recommendation-spot">
                        <span className="spot-number">{index + 1}</span>
                        <span className="spot-theme">{getThemeName(spot.theme_id)}</span>
                        <span className="spot-name">{spot.name}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="recommendation-actions">
                  <button 
                    className="view-route-button"
                    onClick={async () => {
                      if (onSaveRoute && item.spots) {
                        try {
                          const success = await onSaveRoute(item.name, item.spots);
                          if (success) {
                            if (showToast) {
                              showToast('추천 루트가 저장되었습니다!', 'success');
                            } else {
                              alert('추천 루트가 저장되었습니다!');
                            }
                          }
                        } catch (error) {
                          if (showToast) {
                            showToast('루트 저장에 실패했습니다.', 'error');
                          } else {
                            alert('루트 저장에 실패했습니다.');
                          }
                        }
                      }
                    }}
                  >
                    루트 저장
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <div className="loading-text">루트를 분석하고 있습니다...</div>
        </div>
      )}

      {!loading && (recommendations || localRecommendations).length === 0 && (
        <div className="initial-guide">
          {!isLoggedIn ? (
            <p className="guide-text">로그인 후 루트 추천을 이용할 수 있습니다.</p>
          ) : !hasSavedRoutes ? (
            <>
              <p className="guide-text">루트 추천을 받으려면 먼저 루트를 만들어주세요!</p>
              <p className="guide-subtext">관광지 선택 후 루트 저장하면 유사한 루트를 추천합니다.</p>
            </>
          ) : (
            <>
              <p className="guide-text">루트 추천 버튼을 클릭하여 맞춤형 루트를 받아보세요!</p>
              <p className="guide-subtext">루트 추천: 마지막 루트 패턴 분석 기반 추천</p>
            </>
          )}
          {error && <p className="guide-error">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default AIRecommendationComponent;
