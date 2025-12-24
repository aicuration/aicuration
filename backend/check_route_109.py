import sqlite3

conn = sqlite3.connect('gwangju_tour.db')
cursor = conn.cursor()

print("=== route_id=109 확인 ===")

# 루트 기본 정보
cursor.execute('SELECT id, name, user_id, created_at FROM user_routes WHERE id = 109')
route = cursor.fetchone()
if route:
    print(f'루트 ID: {route[0]}, 이름: {route[1]}, user_id: {route[2]}, 생성일: {route[3]}')
else:
    print('route_id=109를 찾을 수 없습니다')
    conn.close()
    exit()

# route_spots 테이블에서 실제 저장된 데이터 확인
print("\n=== route_spots 테이블에 저장된 데이터 ===")
cursor.execute('''
    SELECT rs.route_id, rs.spot_id, rs.spot_order, s.name 
    FROM route_spots rs
    JOIN spots s ON rs.spot_id = s.id
    WHERE rs.route_id = 109
    ORDER BY rs.spot_order
''')
spots = cursor.fetchall()

print(f'총 {len(spots)}개의 관광지가 저장되어 있습니다:')
for i, spot in enumerate(spots):
    print(f'  {i+1}. route_id={spot[0]}, spot_id={spot[1]}, spot_order={spot[2]}, 이름={spot[3]}')

# 중복 체크
spot_ids = [s[1] for s in spots]
unique_ids = list(set(spot_ids))
if len(spot_ids) != len(unique_ids):
    print(f'\n⚠️ 중복 발견! 총 {len(spot_ids)}개 중 {len(unique_ids)}개 고유')
    from collections import Counter
    duplicates = Counter(spot_ids)
    print('중복된 spot_id:')
    for spot_id, count in duplicates.items():
        if count > 1:
            print(f'  spot_id={spot_id}: {count}번 저장됨')
else:
    print('\n✅ 중복 없음')

conn.close()



















