import sqlite3
import csv
import os
from datetime import datetime

# 데이터베이스 경로 찾기
db_path = "backend/gwangju_tour.db"
if not os.path.exists(db_path):
    print("❌ 데이터베이스 파일을 찾을 수 없습니다!")
    exit(1)

print(f"📂 데이터베이스 경로: {db_path}")

# 데이터베이스 연결
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("\n관광지 데이터를 조회하는 중...")

# 관광지 데이터 조회
query = """
    SELECT 
        s.id,
        s.name,
        t.name as theme_name,
        s.description,
        s.address,
        s.latitude,
        s.longitude,
        s.operating_hours,
        s.contact_info,
        s.image_url,
        s.created_at,
        s.updated_at
    FROM spots s
    JOIN themes t ON s.theme_id = t.id
    ORDER BY s.id
"""

cursor.execute(query)
rows = cursor.fetchall()

# CSV 파일로 저장
output_file = f"광주관광지_목록_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"

# UTF-8 BOM 추가하여 엑셀에서 한글 깨짐 방지
with open(output_file, 'w', encoding='utf-8-sig', newline='') as f:
    writer = csv.writer(f)
    
    # 헤더 추가
    writer.writerow([
        'ID', '관광지명', '테마', '설명', '주소', '위도', '경도', 
        '운영시간', '연락처', '이미지URL', '생성일', '수정일'
    ])
    
    # 데이터 추가
    writer.writerows(rows)

conn.close()

print(f"\n✅ 완료!")
print(f"   - 총 {len(rows)}개의 관광지가 저장되었습니다.")
print(f"   - 파일명: {output_file}")

# 테마별 통계
theme_count = {}
for row in rows:
    theme = row[2]  # theme_name
    theme_count[theme] = theme_count.get(theme, 0) + 1

print(f"\n📊 테마별 통계:")
for theme, count in sorted(theme_count.items()):
    print(f"   {theme}: {count}개")

print(f"\n💡 엑셀로 열어보세요: {output_file}")




















