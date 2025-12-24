import React, { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';

const GoogleMapsComponent = forwardRef(({ 
  selectedRoute, 
  spots, 
  onMapClick, 
  onMarkerClick,
  center = { lat: 35.1595, lng: 126.8526 },
  zoom = 12 
}, ref) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // 지도 초기화 함수
  const clearMap = useCallback(() => {
    if (mapInstanceRef.current) {
      // 모든 마커 제거
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      
      // 지도를 원래 중심점과 줌 레벨로 되돌리기
      mapInstanceRef.current.setCenter(center);
      mapInstanceRef.current.setZoom(zoom);
      
      console.log('지도 초기화 완료');
    }
  }, [center, zoom]);

  // 외부에서 호출할 수 있는 함수들을 노출
  useImperativeHandle(ref, () => ({
    clearMap
  }), [clearMap]);

  // 컴포넌트 마운트 상태 확인
  useEffect(() => {
    console.log('GoogleMapsComponent 마운트됨');
    console.log('mapRef.current:', mapRef.current);
    console.log('spots:', spots);
    console.log('selectedRoute:', selectedRoute);
  }, [selectedRoute, spots]);

  // mapRef 설정 확인 및 강제 초기화
  const ensureMapRef = useCallback(() => {
    if (mapRef.current) {
      console.log('mapRef가 이미 설정됨:', mapRef.current);
      return true;
    }
    
    console.log('=== DOM 요소 찾기 시작 ===');
    console.log('현재 시간:', new Date().toISOString());
    console.log('document.readyState:', document.readyState);
    
    // DOM에서 직접 요소 찾기 (여러 방법 시도)
    let mapElement = document.querySelector('.google-map');
    console.log('1. .google-map 클래스로 검색:', mapElement);
    
    if (!mapElement) {
      // 다른 선택자들도 시도
      mapElement = document.querySelector('[ref="mapRef"]');
      console.log('2. ref 속성으로 검색:', mapElement);
    }
    
    if (!mapElement) {
      // 현재 컴포넌트 내부의 모든 div 중에서 찾기
      const allDivs = document.querySelectorAll('div');
      console.log('3. 전체 div 개수:', allDivs.length);
      
      for (let i = 0; i < allDivs.length; i++) {
        const div = allDivs[i];
        if (div.className && div.className.includes('google-map')) {
          mapElement = div;
          console.log(`4. className으로 검색하여 찾음 (${i}번째):`, mapElement);
          break;
        }
      }
    }
    
    if (!mapElement) {
      // 더 넓은 범위에서 검색
      const allElements = document.querySelectorAll('*');
      console.log('5. 전체 요소 개수:', allElements.length);
      
      for (let i = 0; i < allElements.length; i++) {
        const element = allElements[i];
        if (element.className && element.className.includes('google-map')) {
          mapElement = element;
          console.log(`6. 전체 요소에서 className으로 검색하여 찾음 (${i}번째):`, mapElement);
          break;
        }
      }
    }
    
    if (!mapElement) {
      // 강제로 DOM 요소 생성 시도
      console.log('7. 강제 DOM 요소 생성 시도...');
      
      // map-container 내부에 google-map 요소가 있는지 확인
      const mapContainers = document.querySelectorAll('.map-container');
      console.log('map-container 개수:', mapContainers.length);
      
      for (let i = 0; i < mapContainers.length; i++) {
        const container = mapContainers[i];
        console.log(`map-container ${i}:`, container);
        console.log('내부 요소들:', container.children);
        
        // 내부에 google-map 요소가 있는지 확인
        const innerMapElement = container.querySelector('.google-map');
        if (innerMapElement) {
          console.log(`map-container ${i} 내부에서 google-map 찾음:`, innerMapElement);
          mapElement = innerMapElement;
          break;
        }
        
        // 내부에 ref가 mapRef인 요소가 있는지 확인
        const refElement = container.querySelector('[ref="mapRef"]');
        if (refElement) {
          console.log(`map-container ${i} 내부에서 ref="mapRef" 찾음:`, refElement);
          mapElement = refElement;
          break;
        }
      }
    }
    
    if (mapElement) {
      console.log('✅ DOM에서 map 요소 직접 찾음:', mapElement);
      console.log('요소 태그:', mapElement.tagName);
      console.log('요소 클래스:', mapElement.className);
      console.log('요소 ID:', mapElement.id);
      mapRef.current = mapElement;
      return true;
    }
    
    console.log('❌ map 요소를 찾을 수 없음 - 상세 DOM 상태 확인:');
    console.log('전체 div 개수:', document.querySelectorAll('div').length);
    console.log('.google-map 클래스를 가진 요소:', document.querySelectorAll('.google-map').length);
    console.log('map-container 클래스를 가진 요소:', document.querySelectorAll('.map-container').length);
    
    // 현재 페이지의 모든 클래스명 출력
    const allClasses = new Set();
    document.querySelectorAll('*').forEach(el => {
      if (el.className) {
        el.className.split(' ').forEach(cls => {
          if (cls.trim()) allClasses.add(cls.trim());
        });
      }
    });
    console.log('페이지에 존재하는 모든 클래스명:', Array.from(allClasses).sort());
    
    // map-container 내부 구조 상세 분석
    const mapContainers = document.querySelectorAll('.map-container');
    mapContainers.forEach((container, index) => {
      console.log(`=== map-container ${index} 상세 분석 ===`);
      console.log('container:', container);
      console.log('container.className:', container.className);
      console.log('container.innerHTML:', container.innerHTML);
      console.log('container.children:', container.children);
      console.log('container.children.length:', container.children.length);
      
      for (let i = 0; i < container.children.length; i++) {
        const child = container.children[i];
        console.log(`  child ${i}:`, child);
        console.log(`  child.tagName:`, child.tagName);
        console.log(`  child.className:`, child.className);
        console.log(`  child.id:`, child.id);
        console.log(`  child.ref:`, child.ref);
      }
    });
    
    return false;
  }, []);

  // 지도 초기화 함수
  const initMap = useCallback(async () => {
    try {
      console.log('initMap 함수 시작');
      
      // mapRef 확인
      if (!ensureMapRef()) {
        console.log('mapRef 설정 실패, 재시도 예정');
        return false;
      }
      
      // Google Maps API가 로드될 때까지 대기
      let attempts = 0;
      const maxAttempts = 50; // 5초 대기 (100ms * 50)
      
      console.log('Google Maps API 로딩 확인 시작...');
      while (!window.google || !window.google.maps) {
        if (attempts >= maxAttempts) {
          throw new Error('Google Maps API 로드 시간 초과');
        }
        console.log(`API 확인 시도 ${attempts + 1}/${maxAttempts}:`, { 
          hasGoogle: !!window.google, 
          hasMaps: !!(window.google && window.google.maps) 
        });
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      console.log('Google Maps API 확인됨, 지도 초기화 시작...');
      console.log('window.google:', window.google);
      console.log('window.google.maps:', window.google.maps);
      
      setIsLoading(true);
      setError(null);
      
      // 지도 초기화
      console.log('지도 객체 생성 시작...');
      const map = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: zoom,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      console.log('지도 객체 생성 완료:', map);
      mapInstanceRef.current = map;
      
      // Directions Service 초기화
      console.log('Directions Service 초기화...');
      directionsServiceRef.current = new window.google.maps.DirectionsService();
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#4A90E2',
          strokeWeight: 5,
          strokeOpacity: 0.9
        },
        preserveViewport: false
      });
      
      directionsRendererRef.current.setMap(map);
      console.log('Directions Service 초기화 완료');
      
      // 모든 관광지에 마커 추가
      if (spots && spots.length > 0) {
        console.log(`${spots.length}개 관광지에 마커 추가 시작...`);
        spots.forEach((spot, index) => {
          if (spot.latitude && spot.longitude) {
            console.log(`마커 ${index + 1} 생성:`, spot.name, spot.latitude, spot.longitude);
            const marker = new window.google.maps.Marker({
              position: { 
                lat: parseFloat(spot.latitude), 
                lng: parseFloat(spot.longitude) 
              },
              map: map,
              title: spot.name,
              icon: {
                url: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%234A90E2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
                scaledSize: new window.google.maps.Size(24, 24)
              }
            });

            marker.addListener('click', () => {
              console.log('마커 클릭됨:', spot.name);
              if (onMarkerClick) {
                onMarkerClick(spot);
              }
            });
          } else {
            console.log(`마커 생성 실패 (좌표 없음):`, spot.name);
          }
        });
        console.log('모든 마커 추가 완료');
      } else {
        console.log('관광지 데이터가 없음');
      }
      
      setIsLoading(false);
      setIsInitialized(true);
      console.log('Google Maps 초기화 완료! 🗺️');
      return true;
    } catch (err) {
      console.error('Google Maps 로딩 실패:', err);
      setError('지도를 불러올 수 없습니다: ' + err.message);
      setIsLoading(false);
      return false;
    }
  }, [center, zoom, spots, ensureMapRef, onMarkerClick]);

  // 메인 useEffect - 지도 초기화
  useEffect(() => {
    console.log('GoogleMapsComponent useEffect 실행됨');
    console.log('isInitialized:', isInitialized);
    console.log('mapRef.current:', mapRef.current);
    console.log('retryCount:', retryCount);
    
    // 이미 초기화되었으면 리턴
    if (isInitialized) {
      console.log('이미 초기화됨, 리턴');
      return;
    }

    // 로딩 상태를 강제로 해제하여 지도 렌더링 보장
    if (isLoading) {
      console.log('로딩 상태 강제 해제...');
      setIsLoading(false);
    }

    console.log('지도 초기화 시작...');

    // 15초 후에 플레이스홀더 표시 (CDN 로딩 시간 고려)
    const timeoutId = setTimeout(() => {
      if (!isInitialized) {
        console.log('15초 타임아웃, 플레이스홀더 표시');
        setShowPlaceholder(true);
        setIsLoading(false);
      }
    }, 15000);

    // 지도 초기화 시도
    const attemptInit = async () => {
      const success = await initMap();
      if (!success && retryCount < 3) {
        console.log(`초기화 실패, ${retryCount + 1}번째 재시도...`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 1000);
      }
    };

    // 즉시 시도
    attemptInit();

    return () => {
      console.log('useEffect cleanup 실행');
      clearTimeout(timeoutId);
    };
  }, [isInitialized, retryCount, initMap, isLoading]);

  // retryCount 변경 시 재시도
  useEffect(() => {
    if (retryCount > 0 && !isInitialized) {
      console.log(`retryCount 변경됨: ${retryCount}, 지도 초기화 재시도`);
      const timer = setTimeout(() => {
        initMap();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [retryCount, isInitialized, initMap]);

  // Haversine 공식을 사용한 정확한 거리 계산 함수
  const calculateSimpleDistance = useCallback((spots) => {
    if (spots.length < 1) {
      return 0;
    }
    
    if (spots.length === 1) {
      return 0; // 1개일 때는 거리 0으로 표시
    }

    let totalDistance = 0;
    for (let i = 0; i < spots.length - 1; i++) {
      const lat1 = parseFloat(spots[i].latitude);
      const lng1 = parseFloat(spots[i].longitude);
      const lat2 = parseFloat(spots[i + 1].latitude);
      const lng2 = parseFloat(spots[i + 1].longitude);
      
      // Haversine 공식으로 정확한 거리 계산
      const R = 6371; // 지구의 반지름 (km)
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lng2 - lng1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      totalDistance += distance;
    }
    
    return totalDistance;
  }, []);

  // 선택된 루트가 변경될 때 경로 표시
  useEffect(() => {
    console.log('🔍 GoogleMapsComponent - selectedRoute useEffect 실행');
    console.log('🔍 selectedRoute 전체:', selectedRoute);
    if (selectedRoute) {
      console.log('🔍 selectedRoute.spots:', selectedRoute.spots);
      console.log('🔍 selectedRoute.spots 개수:', selectedRoute.spots ? selectedRoute.spots.length : 0);
      if (selectedRoute.spots) {
        console.log('🔍 selectedRoute.spots 상세:', selectedRoute.spots.map(s => ({ id: s.id, name: s.name })));
      }
    }
    
    if (!mapInstanceRef.current || !selectedRoute || !selectedRoute.spots || !isInitialized) {
      console.log('경로 표시 조건 불만족:', {
        hasMapInstance: !!mapInstanceRef.current,
        hasSelectedRoute: !!selectedRoute,
        hasSpots: !!(selectedRoute && selectedRoute.spots),
        isInitialized
      });
      return;
    }

    console.log('경로 표시 시작...');
    const displayRoute = async () => {
      try {
        // 중복 제거: selectedRoute.spots에 중복이 있을 수 있으므로
        const uniqueSpots = [...new Map(selectedRoute.spots.map(spot => [spot.id, spot])).values()];
        if (uniqueSpots.length !== selectedRoute.spots.length) {
          console.warn(`⚠️ GoogleMapsComponent - 중복 관광지 발견! 원본: ${selectedRoute.spots.length}, 중복제거후: ${uniqueSpots.length}`);
        }
        
        const routeSpots = uniqueSpots.filter(spot => 
          spot.latitude && spot.longitude
        );

        console.log('🔍 경로 표시할 관광지 (위경도 필터링 후):', routeSpots.length, '개');
        console.log('🔍 경로 표시할 관광지 목록:', routeSpots.map(s => ({ id: s.id, name: s.name })));

        if (routeSpots.length < 1) {
          console.log('경로 표시 불가 (관광지 없음)');
          return;
        }

        // 간단한 직선 거리 계산
        const simpleDistance = calculateSimpleDistance(routeSpots);
        console.log('직선 거리:', simpleDistance.toFixed(2), 'km');

        // 기존 마커 제거
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // 새로운 마커 생성
        routeSpots.forEach((spot, index) => {
          console.log(`🔍 경로 마커 ${index + 1} 생성:`, spot.name, `(ID: ${spot.id})`);
          const marker = new window.google.maps.Marker({
            position: { 
              lat: parseFloat(spot.latitude), 
              lng: parseFloat(spot.longitude) 
            },
            map: mapInstanceRef.current,
            title: spot.name,
            label: {
              text: `${index + 1}`,
              color: 'white',
              fontWeight: 'bold'
            },
            icon: {
              url: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="%234A90E2"><circle cx="16" cy="16" r="16"/><text x="16" y="22" text-anchor="middle" fill="white" font-size="16" font-weight="bold">${index + 1}</text></svg>`,
              scaledSize: new window.google.maps.Size(32, 32)
            }
          });

          markersRef.current.push(marker);
        });

        // 직선 경로 그리기 제거됨 - 마커만 표시
        const totalDistance = calculateSimpleDistance(routeSpots);
        console.log(`Haversine 거리: ${totalDistance.toFixed(2)} km`);
      } catch (err) {
        console.error('경로 표시 실패:', err);
      }
    };

    displayRoute();
  }, [selectedRoute, isInitialized, calculateSimpleDistance, onMapClick]);

  console.log('GoogleMapsComponent 렌더링:', {
    isLoading,
    error,
    isInitialized,
    showPlaceholder,
    hasMapRef: !!mapRef.current,
    retryCount
  });

  if (isLoading) {
    return (
      <div className="map-loading-container">
        <div className="map-loading-text">지도를 불러오는 중...</div>
        <div className="map-loading-subtext">
          Google Maps API 로딩 중입니다
          {retryCount > 0 && ` (${retryCount}번째 시도)`}
        </div>
        <div className="map-loading-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-error-container">
        <div className="map-error-text">{error}</div>
        <div className="map-error-subtext">Google Maps API 연결에 문제가 있습니다</div>
        <button 
          className="retry-map-button"
          onClick={() => {
            console.log('다시 시도 버튼 클릭됨');
            setIsLoading(true);
            setError(null);
            setShowPlaceholder(false);
            setIsInitialized(false);
            setRetryCount(0);
          }}
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (showPlaceholder) {
    return (
      <div className="map-placeholder-container">
        <div className="map-placeholder-icon">🗺️</div>
        <div className="map-placeholder-title">지도 로딩 지연</div>
        <div className="map-placeholder-text">
          Google Maps API 로딩이 지연되고 있습니다.<br/>
          네트워크 연결을 확인해주세요.
        </div>
        <div className="map-placeholder-route-info">
          {selectedRoute && (
            <div>
              <h4>선택된 루트 정보</h4>
              <p><strong>{selectedRoute.name}</strong></p>
              <p>총 {selectedRoute.spots.length}개 관광지</p>
              <div className="placeholder-spots">
                {selectedRoute.spots.map((spot, index) => (
                  <div key={spot.id} className="placeholder-spot">
                    <span className="spot-number">{index + 1}</span>
                    <span className="spot-name">{spot.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <button 
          className="retry-map-button"
          onClick={() => {
            console.log('지도 다시 로드 버튼 클릭됨');
            setIsLoading(true);
            setShowPlaceholder(false);
            setIsInitialized(false);
            setRetryCount(0);
          }}
        >
          지도 다시 로드
        </button>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div 
        ref={mapRef}
        className="google-map"
        onClick={(e) => {
          if (onMapClick && mapInstanceRef.current) {
            try {
              const mapDiv = mapInstanceRef.current.getDiv();
              if (mapDiv) {
                const rect = mapDiv.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // 신버전 API 호환성 확인
                if (mapInstanceRef.current.getProjection) {
                  const projection = mapInstanceRef.current.getProjection();
                  
                  // 여러 메서드 시도
                  let latLng = null;
                  
                  if (projection.fromDivPixelToLatLng) {
                    const point = new window.google.maps.Point(x, y);
                    latLng = projection.fromDivPixelToLatLng(point);
                  } else if (projection.fromPointToLatLng) {
                    const point = new window.google.maps.Point(x, y);
                    latLng = projection.fromPointToLatLng(point);
                  }
                  
                  if (latLng) {
                    onMapClick(latLng);
                  } else {
                    console.log('좌표 변환 실패, 클릭 위치:', { x, y });
                  }
                }
              }
            } catch (err) {
              console.log('지도 클릭 이벤트 처리 중 오류:', err.message);
            }
          }
        }}
      />
      
      {/* 지도 컨트롤 */}
      <div className="map-controls">
        <button 
          className="map-control-button"
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1);
            }
          }}
        >
          +
        </button>
        <button 
          className="map-control-button"
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1);
            }
          }}
        >
          -
        </button>
        <button 
          className="map-control-button"
          onClick={() => {
            if (mapInstanceRef.current && selectedRoute) {
              const bounds = new window.google.maps.LatLngBounds();
              selectedRoute.spots.forEach(spot => {
                if (spot.latitude && spot.longitude) {
                  bounds.extend({ 
                    lat: parseFloat(spot.latitude), 
                    lng: parseFloat(spot.longitude) 
                  });
                }
              });
              mapInstanceRef.current.fitBounds(bounds, 50);
            }
          }}
        >
          🎯
        </button>
      </div>
    </div>
  );
});

export default GoogleMapsComponent;
