// src/StampTourPage.js
import React, { useEffect, useState } from "react";
import "./App.css"; // stamp- 관련 CSS가 이 안에 들어있다는 가정

// 로컬스토리지 키 (기기별 스탬프 저장용)
const STAMP_STORAGE_KEY = "gw_stamp_collections";

// ✅ 여러 이벤트 정의 (광주 방문의 해 1~9번 코스 반영)
// ⚠ spotIds는 실제 /api/stamp-spots 에 있는 id로 나중에 맞춰주면 됨.
const EVENT_DEFINITIONS = [
  {
    id: "visit_boy_road",
    title: "소년의 길 스탬프 투어",
    description:
      "전남대 정문과 옛 전남도청, 전일빌딩245, ACC, 국립5·18민주묘지를 잇는 민주·인권·평화 대자보 투어입니다.",
    spotIds: [1, 2, 3, 4, 5],
  },
  {
    id: "visit_baseball_trip",
    title: "야구광(光) 트립",
    description:
      "동명동·전일빌딩245·ACC에서 챔피언스필드와 야구의 거리까지, 경기 전후로 즐기는 야구 문화 스탬프 투어입니다.",
    spotIds: [10, 11, 12, 13],
  },
  {
    id: "visit_g_festa",
    title: "다함께 G-페스타",
    description:
      "충장축제와 스트리트컬처 페스타, 전남도청 권역과 양림 권역을 함께 도는 축제 연계형 로컬 투어입니다.",
    spotIds: [20, 21, 22],
  },
  {
    id: "visit_mudeung",
    title: "무등도원 힐링 투어",
    description:
      "무등산 자락과 전통문화관, 운림동 미술거리, 평두메 숲길·장록습지를 잇는 도심 속 힐링·웰니스 코스입니다.",
    spotIds: [30, 31, 32, 33],
  },
  {
    id: "visit_light_truth",
    title: "빛과 진리를 찾아서",
    description:
      "오월기념관과 어비슨·유진벨·우일선 선교사 유산, 사직타워와 빛의 숲을 따라 걷는 근대건축·선교유산 테마 코스입니다.",
    spotIds: [40, 41, 42, 43, 44],
  },
  {
    id: "visit_antiago",
    title: "앙티아고 선지순례",
    description:
      "양림교회와 오웬기념각, 조아라·기념관·최흥종 기념관, 선교사 묘역을 잇는 광주형 ‘산티아고 순례’ 스탬프 투어입니다.",
    spotIds: [50, 51, 52, 53, 54],
  },
  {
    id: "visit_forest_museum",
    title: "숲속 미술관 여행",
    description:
      "광주시립수목원과 운림동 미술관거리, 광주호 호수생태원, 사직타워를 연결한 자연·예술 감성 코스입니다.",
    spotIds: [60, 61, 62, 63, 64],
  },
  {
    id: "visit_art_for_you",
    title: "예술을 품은 어느 당신을 위해",
    description:
      "양림 미술관거리와 G-MAP, 민간 예술플랫폼·골목전시·동명동 카페거리를 잇는 도심 예술 산책형 투어입니다.",
    spotIds: [70, 71, 72, 73], // ★ 실제 스팟 id에 맞게 수정
  },
  {
    id: "visit_may_cineroad",
    title: "오월 시네로드",
    description:
      "양림동과 전일빌딩245, ACC, 5·18민주광장, 국립5·18민주묘지를 잇는 ‘영화 같은 오월’ 시네마 로드 코스입니다.",
    spotIds: [80, 81, 82, 83, 84], // ★ 실제 스팟 id에 맞게 수정
  },
];

// ✅ 이벤트 전체 상태를 한 번에 저장
const EVENT_STAMP_KEY = "gw_event_stamps_v1"; // { [eventId]: { [spotId]: true } }
const EVENT_REWARD_KEY = "gw_event_rewards_v1"; // { [eventId]: true/false }

function StampTourPage({ onNavigateToHome }) {
  const [spots, setSpots] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [lastPosition, setLastPosition] = useState(null);

  // 필터 상태: all | collected | not_collected
  const [filter, setFilter] = useState("all");

  // { [spotId]: true } 형태로 저장 (일반 스탬프)
  const [collectedStamps, setCollectedStamps] = useState(() => {
    try {
      const raw = localStorage.getItem(STAMP_STORAGE_KEY);
      if (!raw) return {};
      return JSON.parse(raw);
    } catch (e) {
      console.error("스탬프 로컬 기록 파싱 실패:", e);
      return {};
    }
  });

  // { [eventId]: { [spotId]: true } }
  const [eventStamps, setEventStamps] = useState(() => {
    try {
      const raw = localStorage.getItem(EVENT_STAMP_KEY);
      if (!raw) return {};
      return JSON.parse(raw);
    } catch (e) {
      console.error("이벤트 스탬프 로컬 기록 파싱 실패:", e);
      return {};
    }
  });

  // { [eventId]: true/false }
  const [eventRewards, setEventRewards] = useState(() => {
    try {
      const raw = localStorage.getItem(EVENT_REWARD_KEY);
      if (!raw) return {};
      return JSON.parse(raw);
    } catch (e) {
      return {};
    }
  });

  // ✅ 방금 찍힌 이벤트 스탬프 (어느 이벤트 + 어느 거점인지)
  const [lastStampedEvent, setLastStampedEvent] = useState(null); // { eventId, spotId }

  // 로컬스토리지 동기화 (일반 스탬프)
  useEffect(() => {
    try {
      localStorage.setItem(STAMP_STORAGE_KEY, JSON.stringify(collectedStamps));
    } catch (e) {
      console.error("스탬프 로컬 기록 저장 실패:", e);
    }
  }, [collectedStamps]);

  // 로컬스토리지 동기화 (이벤트 스탬프)
  useEffect(() => {
    try {
      localStorage.setItem(EVENT_STAMP_KEY, JSON.stringify(eventStamps));
    } catch (e) {
      console.error("이벤트 스탬프 로컬 기록 저장 실패:", e);
    }
  }, [eventStamps]);

  // 로컬스토리지 동기화 (이벤트 리워드 상태)
  useEffect(() => {
    try {
      localStorage.setItem(EVENT_REWARD_KEY, JSON.stringify(eventRewards));
    } catch (e) {
      console.error("이벤트 리워드 상태 저장 실패:", e);
    }
  }, [eventRewards]);

  // 스탬프 지점 목록 불러오기
  useEffect(() => {
    fetch("/api/stamp-spots")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.spots)) {
          setSpots(data.spots);
        } else {
          setStatusMessage("스탬프 지점 정보를 불러오지 못했습니다.");
        }
      })
      .catch((err) => {
        console.error(err);
        setStatusMessage("서버와 통신 중 오류가 발생했습니다.");
      });
  }, []);

  // 전체 스탬프 진행률
  const totalCount = spots.length;
  const collectedCount = spots.filter((s) => collectedStamps[s.id]).length;
  const progressPercent =
    totalCount > 0 ? Math.round((collectedCount / totalCount) * 100) : 0;

  // 필터 적용된 리스트
  const filteredSpots = spots.filter((spot) => {
    const collected = !!collectedStamps[spot.id];
    if (filter === "collected") return collected;
    if (filter === "not_collected") return !collected;
    return true;
  });

  const handleCheckStamp = () => {
    if (!navigator.geolocation) {
      setStatusMessage("이 기기에서는 위치 정보를 사용할 수 없습니다.");
      return;
    }

    setIsChecking(true);
    setStatusMessage("현재 위치를 확인 중입니다...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setLastPosition({ latitude, longitude, accuracy });

        fetch("/api/stamp/checkin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat: latitude,
            lng: longitude,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.matched_spot) {
              const spot = data.matched_spot;
              const distance = Math.round(spot.distance_m || 0);

              // 일반 스탬프 업데이트
              setCollectedStamps((prev) => {
                if (prev[spot.id]) return prev;
                return { ...prev, [spot.id]: true };
              });

              // ✅ 이벤트 스탬프 업데이트
              setEventStamps((prevAll) => {
                let nextAll = { ...prevAll };
                let stampedEventInfo = null;
                let rewardsUpdate = { ...eventRewards };

                EVENT_DEFINITIONS.forEach((eventDef) => {
                  if (eventDef.spotIds.includes(spot.id)) {
                    const prevEventStamps = nextAll[eventDef.id] || {};
                    const already = !!prevEventStamps[spot.id];

                    if (!already) {
                      const updatedEventStamps = {
                        ...prevEventStamps,
                        [spot.id]: true,
                      };
                      nextAll[eventDef.id] = updatedEventStamps;

                      // 방금 찍힌 이벤트/거점 기록 (쾅! 애니메이션용)
                      stampedEventInfo = {
                        eventId: eventDef.id,
                        spotId: spot.id,
                      };

                      // 이 이벤트가 모두 채워졌는지도 동시에 체크
                      const allDone = eventDef.spotIds.every(
                        (id) => updatedEventStamps[id]
                      );
                      if (allDone) {
                        rewardsUpdate[eventDef.id] = true;
                      }
                    }
                  }
                });

                if (stampedEventInfo) {
                  setLastStampedEvent(stampedEventInfo);
                }
                setEventRewards(rewardsUpdate);

                return nextAll;
              });

              setStatusMessage(
                `✅ "${spot.name}" 스탬프 획득! (거리 약 ${distance}m)`
              );
            } else if (data.nearest_spot) {
              const s = data.nearest_spot;
              const distance = Math.round(s.distance_m || 0);
              setStatusMessage(
                `아직 스탬프 범위에 들어오지 않았어요.\n가장 가까운 곳: "${s.name}" (약 ${distance}m)`
              );
            } else if (data.message) {
              setStatusMessage(data.message);
            } else {
              setStatusMessage("주변에서 스탬프 지점을 찾지 못했습니다.");
            }
          })
          .catch((err) => {
            console.error(err);
            setStatusMessage("서버와 통신 중 오류가 발생했습니다.");
          })
          .finally(() => setIsChecking(false));
      },
      (err) => {
        console.error(err);
        setIsChecking(false);
        setStatusMessage(`위치 정보를 가져오지 못했습니다: ${err.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const resetStamps = () => {
    if (window.confirm("모든 스탬프 기록을 이 기기에서 초기화할까요?")) {
      setCollectedStamps({});
      setEventStamps({});
      setEventRewards({});
      setLastStampedEvent(null);
      setStatusMessage("로컬 스탬프 기록을 초기화했습니다.");
    }
  };

  return (
    <div className="page-container stamp-page">
      {/* 상단 헤더 카드 */}
      <section className="stamp-header-section">
        <div className="stamp-header-left">
          <button className="back-button" onClick={onNavigateToHome}>
            ←
          </button>
          <div className="stamp-header-icon">🏞️</div>
          <div className="stamp-header-texts">
            <div className="stamp-title">스탬프 투어</div>
            <div className="stamp-subtitle">
              현재{" "}
              <strong>
                {collectedCount} / {totalCount || 0}
              </strong>{" "}
              개 스탬프를 모았어요.
            </div>
          </div>
        </div>
      </section>

      {/* 헤더 아래, 밖으로 뺀 배지 */}
      <div className="stamp-badge-row">
        <div className="stamp-badge-chip">
          <span>📱</span>
          이 기기 전용 스탬프 기록
        </div>
      </div>
      <br />

      {/* ✅ 가로 슬라이드되는 여러 이벤트 스탬프 투어 */}
      <section className="event-stamp-section">
        <div className="event-stamp-scroll">
          {EVENT_DEFINITIONS.map((eventDef) => {
            const eventStampMap = eventStamps[eventDef.id] || {};
            const totalEventCount = eventDef.spotIds.length;
            const collectedEventCount = eventDef.spotIds.filter(
              (id) => eventStampMap[id]
            ).length;
            const eventProgressPercent =
              totalEventCount > 0
                ? Math.round((collectedEventCount / totalEventCount) * 100)
                : 0;
            const rewardUnlocked = !!eventRewards[eventDef.id];

            return (
              <div key={eventDef.id} className="event-stamp-card">
                <div className="event-stamp-header">
                  <h3 className="event-stamp-title">🎁 {eventDef.title}</h3>
                  <span className="event-stamp-progress-text">
                    {collectedEventCount} / {totalEventCount}
                  </span>
                </div>

                {/* 동그라미 나열 */}
                <div className="event-stamp-circle-row">
                  {eventDef.spotIds.map((spotId, index) => {
                    const isCollected = !!eventStampMap[spotId];
                    const isLastBoom =
                      lastStampedEvent &&
                      lastStampedEvent.eventId === eventDef.id &&
                      lastStampedEvent.spotId === spotId;

                    const spotInfo = spots.find((s) => s.id === spotId);
                    const label = spotInfo
                      ? spotInfo.name
                      : `이벤트 ${index + 1}`;

                    return (
                      <div
                        key={spotId}
                        className="event-stamp-circle-wrapper"
                      >
                        <div
                          className={
                            "event-stamp-circle " +
                            (isCollected
                              ? "event-stamp-circle-collected "
                              : "") +
                            (isLastBoom ? "event-stamp-circle-boom " : "")
                          }
                        >
                          {isCollected ? (
                            <span className="event-stamp-icon">★</span>
                          ) : (
                            <span className="event-stamp-index">
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <div className="event-stamp-label">
                          {label}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 진행 바 */}
                <div className="event-progress-bar">
                  <div
                    className="event-progress-fill"
                    style={{ width: `${eventProgressPercent}%` }}
                  />
                </div>

                <p className="event-stamp-caption">
                  {eventDef.description}
                  <br />
                  남은 이벤트 스탬프:{" "}
                  {totalEventCount - collectedEventCount}개
                </p>

                {rewardUnlocked ? (
                  <div className="event-reward-box">
                    <p>✅ 이 이벤트 스탬프를 모두 모았습니다!</p>
                    <button
                      type="button"
                      className="event-reward-button"
                      onClick={() => {
                        alert(
                          `[${eventDef.title}] 리워드 수령 안내\n\n현장 운영 staff에게 이 화면을 보여주시고, 이름/연락처를 남겨주세요.`
                        );
                      }}
                    >
                      리워드 받는 방법 보기
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        {/* 슬라이드 안내 텍스트 */}
        {EVENT_DEFINITIONS.length > 1 && (
          <p className="event-slide-hint">
            ◀ 좌우로 슬라이드하여 다른 이벤트를 확인해보세요 ▶
          </p>
        )}
      </section>

      {/* 상단 요약 카드 */}
      <section className="stamp-summary-section">
        <div className="stamp-summary-grid">
          <div className="stamp-summary-card">
            <div className="stamp-summary-label">
              <div className="stamp-summary-label-icon">📍</div>
              <span>전체 스탬프</span>
            </div>
            <div className="stamp-summary-value">{totalCount}</div>
            <div className="stamp-summary-caption">
              현재 등록된 스탬프 지점 수
            </div>
          </div>

          <div className="stamp-summary-card">
            <div className="stamp-summary-label">
              <div className="stamp-summary-label-icon">✅</div>
              <span>획득한 스탬프</span>
            </div>
            <div className="stamp-summary-value">{collectedCount}</div>
            <div className="stamp-summary-caption">
              남은 스탬프: {Math.max(totalCount - collectedCount, 0)}개
            </div>
          </div>

          <div className="stamp-summary-card">
            <div className="stamp-summary-label">
              <div className="stamp-summary-label-icon">📡</div>
              <span>GPS 상태</span>
            </div>
            <div className="stamp-summary-value">
              {lastPosition
                ? `${Math.round(lastPosition.accuracy || 0)}m`
                : "-"}
            </div>
            <div className="stamp-summary-caption">
              {lastPosition
                ? "최근 측정된 위치 오차 거리"
                : "아직 위치를 확인하지 않았어요"}
            </div>
          </div>
        </div>
      </section>

      {/* 진행률 카드 + 상태 메시지 */}
      <section className="stamp-progress-card">
        <div className="stamp-progress-header">
          <span className="stamp-progress-title">나의 스탬프 진행률</span>
          <span className="stamp-progress-percent">{progressPercent}%</span>
        </div>

        <div className="stamp-progress-bar">
          <div
            className="stamp-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className="stamp-progress-text">
          전체 {totalCount}개 중 {collectedCount}개를 완료했습니다.
        </p>

        {statusMessage && (
          <p
            className="stamp-progress-text"
            style={{ marginTop: 6, whiteSpace: "pre-line" }}
          >
            {statusMessage}
          </p>
        )}

        {lastPosition && (
          <p className="stamp-progress-text" style={{ marginTop: 4 }}>
            위도 {lastPosition.latitude.toFixed(6)}, 경도{" "}
            {lastPosition.longitude.toFixed(6)}
          </p>
        )}
      </section>

      {/* 필터 탭 */}
      <section className="stamp-filter-tabs">
        <button
          type="button"
          className={
            "stamp-filter-tab " +
            (filter === "all" ? "stamp-filter-active" : "")
          }
          onClick={() => setFilter("all")}
        >
          전체 <span className="stamp-filter-tab-count">{totalCount}</span>
        </button>
        <button
          type="button"
          className={
            "stamp-filter-tab " +
            (filter === "collected" ? "stamp-filter-active" : "")
          }
          onClick={() => setFilter("collected")}
        >
          획득{" "}
          <span className="stamp-filter-tab-count">{collectedCount}</span>
        </button>
        <button
          type="button"
          className={
            "stamp-filter-tab " +
            (filter === "not_collected" ? "stamp-filter-active" : "")
          }
          onClick={() => setFilter("not_collected")}
        >
          미획득{" "}
          <span className="stamp-filter-tab-count">
            {Math.max(totalCount - collectedCount, 0)}
          </span>
        </button>
      </section>

      {/* 스탬프 목록 카드 그리드 */}
      <section className="stamp-list-section">
        <div className="stamp-list-title-row">
          <h2 className="stamp-list-title">스탬프 목록</h2>
          <span className="stamp-list-count">
            완료 {collectedCount} / 전체 {totalCount}
          </span>
        </div>

        {filteredSpots.length === 0 ? (
          <div className="stamp-empty-state">
            <div className="stamp-empty-icon">🗺️</div>
            <p className="stamp-empty-title">표시할 스탬프가 없어요</p>
            <p className="stamp-empty-text">
              필터를 변경하거나, 관리자 페이지에서 스탬프 지점을 등록해 주세요.
            </p>
          </div>
        ) : (
          <div className="stamp-list-grid">
            {filteredSpots.map((spot) => {
              const collected = !!collectedStamps[spot.id];
              return (
                <div
                  key={spot.id}
                  className={
                    "stamp-card " + (collected ? "stamp-card-completed" : "")
                  }
                >
                  <div className="stamp-icon-circle">
                    {collected ? "✅" : "📍"}
                    {collected && <div className="stamp-check-badge">✓</div>}
                  </div>

                  <div className="stamp-spot-name">{spot.name}</div>

                  {spot.description && (
                    <div className="stamp-spot-theme">{spot.description}</div>
                  )}

                  <div
                    className="stamp-summary-caption"
                    style={{ marginTop: 4 }}
                  >
                    위도 {spot.latitude}, 경도 {spot.longitude}
                    <br />
                    인식 반경: 약 {spot.radius_m || 80}m
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 하단 고정 안내 + 스탬프 찍기 버튼 */}
      {totalCount > 0 && (
        <div className="stamp-bottom-info">
          <div className="stamp-bottom-card">
            <div className="stamp-bottom-text">
              <strong>현장에 도착하셨나요?</strong>
              <br />
              버튼을 눌러 현재 위치로 스탬프를 찍어보세요.
              <br />
              <button
                type="button"
                onClick={resetStamps}
                style={{
                  marginTop: 4,
                  border: "none",
                  background: "transparent",
                  color: "#e4f0ff",
                  fontSize: "11px",
                  textDecoration: "underline",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                이 기기 스탬프 기록 초기화
              </button>
            </div>
            <button
              className="stamp-bottom-button"
              type="button"
              onClick={handleCheckStamp}
              disabled={isChecking}
            >
              {isChecking ? "위치 확인 중..." : "스탬프 찍기"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StampTourPage;
