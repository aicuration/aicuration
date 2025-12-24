import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ onNavigateToPage }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [adminToken, setAdminToken] = useState('');

  // 관리자 인증
  const handleAuth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: adminToken }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        loadStats();
      } else {
        setError('인증에 실패했습니다. 토큰을 확인해주세요.');
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 통계 데이터 로드
  const loadStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/survey-stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        setError('통계 데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 만족도 레벨을 텍스트로 변환
  const getSatisfactionText = (level) => {
    const levels = {
      1: '매우 불만족',
      2: '불만족', 
      3: '보통',
      4: '만족',
      5: '매우 만족'
    };
    return levels[level] || '알 수 없음';
  };

  // 상세 평가 레벨을 텍스트로 변환
  const getRatingText = (rating) => {
    const ratings = {
      'excellent': '매우 좋음',
      'good': '좋음',
      'average': '보통',
      'poor': '나쁨',
      'very-poor': '매우 나쁨'
    };
    return ratings[rating] || '알 수 없음';
  };

  // 만족도 레벨별 색상
  const getSatisfactionColor = (level) => {
    const colors = {
      1: '#F44336', // 빨강
      2: '#FF9800', // 주황
      3: '#FFC107', // 노랑
      4: '#8BC34A', // 연두
      5: '#4CAF50'  // 초록
    };
    return colors[level] || '#9E9E9E';
  };

  // 인증되지 않은 경우
  if (!isAuthenticated) {
    return (
      <div className="page-container">
        <div className="content">
          <div className="section">
            <h2 className="section-title">관리자 인증</h2>
            <div className="settings-section">
              <div className="setting-item">
                <span>관리자 토큰을 입력하세요</span>
                <input
                  type="password"
                  value={adminToken}
                  onChange={(e) => setAdminToken(e.target.value)}
                  placeholder="관리자 토큰 입력"
                  style={{
                    marginTop: '10px',
                    padding: '12px',
                    border: error ? '2px solid #F44336' : '1px solid #ddd',
                    borderRadius: '8px',
                    width: '100%',
                    fontSize: '16px'
                  }}
                />
              </div>
              {error && (
                <div style={{ 
                  color: '#F44336', 
                  marginTop: '10px',
                  padding: '10px',
                  background: '#ffebee',
                  borderRadius: '8px',
                  border: '1px solid #ffcdd2'
                }}>
                  {error}
                </div>
              )}
              <div style={{ marginTop: '20px' }}>
                <button
                  onClick={handleAuth}
                  disabled={loading || !adminToken}
                  className="submit-btn"
                  style={{ 
                    width: '100%',
                    opacity: loading || !adminToken ? 0.6 : 1
                  }}
                >
                  {loading ? '인증 중...' : '인증하기'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content">
        <div className="section">
          <div className="settings-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 className="section-title">설문조사 통계</h2>
              <button onClick={loadStats} className="submit-btn" style={{ padding: '8px 16px', fontSize: '14px' }}>
                🔄 새로고침
              </button>
            </div>

            {loading && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div>📊 데이터 로딩 중...</div>
              </div>
            )}

            {error && (
              <div className="error-message" style={{ color: '#F44336', textAlign: 'center', padding: '20px' }}>
                {error}
              </div>
            )}

            {stats && !loading && (
              <>
                {/* 전체 응답 수 */}
                <div className="stat-card" style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>전체 응답 수</h3>
                  <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.total_responses}</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>총 설문조사 참여자</div>
                </div>

                {/* 만족도 분포 */}
                <div className="stat-section">
                  <h3>만족도 분포</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    {/* 원그래프 */}
                    <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                      <div style={{
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        background: `conic-gradient(
                          ${stats.satisfaction_distribution.map((item, index) => {
                            const total = stats.satisfaction_distribution.reduce((sum, i) => sum + i.count, 0);
                            const percentage = total > 0 ? (item.count / total) * 100 : 0;
                            return `${getSatisfactionColor(item.level)} ${percentage}%`;
                          }).join(', ')}
                        )`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <div style={{
                          width: '120px',
                          height: '120px',
                          borderRadius: '50%',
                          background: 'white',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                            {stats.satisfaction_distribution.reduce((sum, item) => sum + item.count, 0)}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>총 응답</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 범례 */}
                    <div style={{ width: '100%' }}>
                      {stats.satisfaction_distribution.filter(item => item.count > 0).map((item, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '8px',
                          padding: '8px',
                          background: '#f8f9fa',
                          borderRadius: '6px'
                        }}>
                          <div style={{
                            width: '16px',
                            height: '16px',
                            background: getSatisfactionColor(item.level),
                            borderRadius: '50%',
                            marginRight: '12px'
                          }}></div>
                          <span style={{ fontSize: '14px', fontWeight: '500', flex: 1 }}>
                            {getSatisfactionText(item.level)}
                          </span>
                          <span style={{ 
                            fontSize: '14px', 
                            fontWeight: 'bold', 
                            color: '#4A90E2',
                            marginLeft: '8px'
                          }}>
                            {item.count}명
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 상세 평가 통계 */}
                <div className="stat-section" style={{ marginBottom: '60px' }}>
                  <h3>상세 평가 통계</h3>
                  
                  {/* 디자인 평가 */}
                  <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>디자인 평가</h4>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '150px', padding: '10px 0', backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '15px' }}>
                      {(() => {
                        // 모든 평가 레벨을 순서대로 표시 (데이터가 없는 것도 포함)
                        const allRatings = ['excellent', 'good', 'average', 'poor', 'very-poor'];
                        const maxCount = Math.max(...stats.design_ratings.map(r => r.count), 1);
                        
                        return allRatings.map((rating, index) => {
                          const item = stats.design_ratings.find(r => r.rating === rating) || { rating, count: 0 };
                          const height = maxCount > 0 ? (item.count / maxCount) * 80 : 0; // 최대값 기준 비례, 최대 80px
                          
                          const colors = {
                            'excellent': '#4CAF50', // 초록
                            'good': '#8BC34A',      // 연두
                            'average': '#FFC107',    // 노랑
                            'poor': '#FF9800',       // 주황
                            'very-poor': '#F44336'   // 빨강
                          };
                          
                          return (
                            <div key={index} style={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center',
                              flex: 1,
                              gap: '6px'
                            }}>
                              <div style={{
                                width: '100%',
                                height: `${height}px`,
                                background: colors[rating],
                                borderRadius: '4px 4px 0 0',
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                position: 'relative'
                              }}>
                                {item.count > 0 && (
                                  <span style={{
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    marginBottom: '2px',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
                                  }}>
                                    {item.count}
                                  </span>
                                )}
                              </div>
                              <span style={{ 
                                fontSize: '11px', 
                                textAlign: 'center',
                                color: '#333',
                                lineHeight: '1.2',
                                fontWeight: '500'
                              }}>
                                {getRatingText(rating)}
                              </span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* 기능성 평가 */}
                  <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>기능성 평가</h4>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '150px', padding: '10px 0', backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '15px' }}>
                      {(() => {
                        const allRatings = ['excellent', 'good', 'average', 'poor', 'very-poor'];
                        const maxCount = Math.max(...stats.functionality_ratings.map(r => r.count), 1);
                        
                        return allRatings.map((rating, index) => {
                          const item = stats.functionality_ratings.find(r => r.rating === rating) || { rating, count: 0 };
                          const height = maxCount > 0 ? (item.count / maxCount) * 80 : 0; // 최대값 기준 비례, 최대 80px
                          
                          const colors = {
                            'excellent': '#4CAF50', // 초록
                            'good': '#8BC34A',      // 연두
                            'average': '#FFC107',    // 노랑
                            'poor': '#FF9800',       // 주황
                            'very-poor': '#F44336'   // 빨강
                          };
                          
                          return (
                            <div key={index} style={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center',
                              flex: 1,
                              gap: '6px'
                            }}>
                              <div style={{
                                width: '100%',
                                height: `${height}px`,
                                background: colors[rating],
                                borderRadius: '4px 4px 0 0',
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                position: 'relative'
                              }}>
                                {item.count > 0 && (
                                  <span style={{
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    marginBottom: '2px',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
                                  }}>
                                    {item.count}
                                  </span>
                                )}
                              </div>
                              <span style={{ 
                                fontSize: '11px', 
                                textAlign: 'center',
                                color: '#333',
                                lineHeight: '1.2',
                                fontWeight: '500'
                              }}>
                                {getRatingText(rating)}
                              </span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* 콘텐츠 평가 */}
                  <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>콘텐츠 품질 평가</h4>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '150px', padding: '10px 0', backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '15px' }}>
                      {(() => {
                        const allRatings = ['excellent', 'good', 'average', 'poor', 'very-poor'];
                        const maxCount = Math.max(...stats.content_ratings.map(r => r.count), 1);
                        
                        return allRatings.map((rating, index) => {
                          const item = stats.content_ratings.find(r => r.rating === rating) || { rating, count: 0 };
                          const height = maxCount > 0 ? (item.count / maxCount) * 80 : 0; // 최대값 기준 비례, 최대 80px
                          
                          const colors = {
                            'excellent': '#4CAF50', // 초록
                            'good': '#8BC34A',      // 연두
                            'average': '#FFC107',    // 노랑
                            'poor': '#FF9800',       // 주황
                            'very-poor': '#F44336'   // 빨강
                          };
                          
                          return (
                            <div key={index} style={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center',
                              flex: 1,
                              gap: '6px'
                            }}>
                              <div style={{
                                width: '100%',
                                height: `${height}px`,
                                background: colors[rating],
                                borderRadius: '4px 4px 0 0',
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                position: 'relative'
                              }}>
                                {item.count > 0 && (
                                  <span style={{
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    marginBottom: '2px',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
                                  }}>
                                    {item.count}
                                  </span>
                                )}
                              </div>
                              <span style={{ 
                                fontSize: '11px', 
                                textAlign: 'center',
                                color: '#333',
                                lineHeight: '1.2',
                                fontWeight: '500'
                              }}>
                                {getRatingText(rating)}
                              </span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* 네비게이션 평가 */}
                  <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>네비게이션 평가</h4>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '150px', padding: '10px 0', backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '15px' }}>
                      {(() => {
                        const allRatings = ['excellent', 'good', 'average', 'poor', 'very-poor'];
                        const maxCount = Math.max(...stats.navigation_ratings.map(r => r.count), 1);
                        
                        return allRatings.map((rating, index) => {
                          const item = stats.navigation_ratings.find(r => r.rating === rating) || { rating, count: 0 };
                          const height = maxCount > 0 ? (item.count / maxCount) * 80 : 0; // 최대값 기준 비례, 최대 80px
                          
                          const colors = {
                            'excellent': '#4CAF50', // 초록
                            'good': '#8BC34A',      // 연두
                            'average': '#FFC107',    // 노랑
                            'poor': '#FF9800',       // 주황
                            'very-poor': '#F44336'   // 빨강
                          };
                          
                          return (
                            <div key={index} style={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center',
                              flex: 1,
                              gap: '6px'
                            }}>
                              <div style={{
                                width: '100%',
                                height: `${height}px`,
                                background: colors[rating],
                                borderRadius: '4px 4px 0 0',
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                position: 'relative'
                              }}>
                                {item.count > 0 && (
                                  <span style={{
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    marginBottom: '2px',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
                                  }}>
                                    {item.count}
                                  </span>
                                )}
                              </div>
                              <span style={{ 
                                fontSize: '11px', 
                                textAlign: 'center',
                                color: '#333',
                                lineHeight: '1.2',
                                fontWeight: '500'
                              }}>
                                {getRatingText(rating)}
                              </span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </div>

                {/* 기능 선호도 */}
                <div className="stat-section" style={{ marginBottom: '60px' }}>
                  <h3>인기 기능</h3>
                  <div className="feature-stats">
                    {stats.feature_preferences.map((item, index) => (
                      <div key={index} className="feature-item" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        marginBottom: '8px'
                      }}>
                        <span style={{ fontWeight: '500' }}>{item.feature}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ 
                            background: '#4A90E2', 
                            color: 'white', 
                            padding: '4px 8px', 
                            borderRadius: '12px', 
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {item.count}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 최근 응답 */}
                <div className="stat-section" style={{ marginBottom: '60px' }}>
                  <h3>최근 응답 (최근 5개)</h3>
                  <div className="recent-responses">
                    {stats.recent_responses.slice(0, 5).map((response, index) => (
                      <div key={index} className="recent-item" style={{
                        padding: '12px',
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        fontSize: '14px'
                      }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                          응답 #{response.id} - {new Date(response.created_at).toLocaleString('ko-KR')}
                        </div>
                        <div style={{ color: '#666' }}>
                          만족도: {getSatisfactionText(response.responses.overallSatisfaction)} | 
                          디자인: {getRatingText(response.responses.designRating)} | 
                          기능성: {getRatingText(response.responses.functionalityRating)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
