// src/api/stamp.ts (예시)

export async function fetchRouteStampStatus(routeId: number) {
    const res = await fetch(`/api/routes/${routeId}/stamps`, {
      credentials: "include", // 로그인 쿠키 쓰면
    });
    if (!res.ok) throw new Error("스탬프 상태 불러오기 실패");
    return await res.json();
    // 예상 구조:
    // { routeId, spots: [{ spotId, name, isCollected, latitude, longitude }, ...] }
  }
  
  export async function checkInStamp(params: {
    routeId: number;
    spotId: number;
    userLat: number;
    userLng: number;
  }) {
    const res = await fetch(`/api/stamps/checkin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error("스탬프 체크인 실패");
    return await res.json();
    // 예상 구조:
    // { success: true, collectedCount: 3, totalCount: 8, completed: false }
  }
  