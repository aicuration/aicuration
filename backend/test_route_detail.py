import sqlite3

conn = sqlite3.connect('gwangju_tour.db')
cursor = conn.cursor()

print("=== route_id=109 조회 테스트 (백엔드 로직 재현) ===")

route_id = 109
user_id = 6  # 실제 user_id 확인 필요

# 루트 기본 정보
cursor.execute('''
    SELECT id, name, description, estimated_time, total_distance, created_at 
    FROM user_routes 
    WHERE id = ? AND user_id = ?
''', (route_id, user_id))
route = cursor.fetchone()

if not route:
    print(f"❌ 루트를 찾을 수 없습니다: route_id={route_id}, user_id={user_id}")
    conn.close()
    exit()

print(f"✅ 루트 정보: ID={route[0]}, 이름={route[1]}")

# 관광지 조회 (백엔드 로직과 동일)
cursor.execute('''
    SELECT s.*, rs.spot_order
    FROM route_spots rs
    JOIN spots s ON rs.spot_id = s.id
    WHERE rs.route_id = ?
    ORDER BY rs.spot_order
''', (route_id,))

spots = cursor.fetchall()
print(f"🔍 조회한 관광지 개수 (원본): {len(spots)}")

if len(spots) == 0:
    print("❌ 관광지가 조회되지 않았습니다!")
    # route_spots 테이블 직접 확인
    cursor.execute('SELECT route_id, spot_id, spot_order FROM route_spots WHERE route_id = ?', (route_id,))
    raw_spots = cursor.fetchall()
    print(f"🔍 route_spots 테이블 직접 조회: {len(raw_spots)}개")
    for rs in raw_spots:
        print(f"  route_id={rs[0]}, spot_id={rs[1]}, order={rs[2]}")
else:
    for i, spot in enumerate(spots):
        print(f"  {i+1}. ID={spot[0]}, 이름={spot[1]}, spot_order={spot[10]}")

conn.close()



















