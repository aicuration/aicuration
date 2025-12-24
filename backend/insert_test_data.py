from database import engine
import sqlalchemy

print("테스트 데이터 삽입 중...\n")

try:
    with engine.connect() as conn:
        # themes 테이블에 데이터 삽입
        print("🎨 THEMES 테이블에 데이터 삽입...")
        themes_data = [
            {'id': 1, 'name': '쇼핑', 'description': '쇼핑과 구매를 위한 장소들', 'icon_name': 'shopping-bag', 'color_code': '#FF6B6B'},
            {'id': 2, 'name': '역사', 'description': '역사적 의미가 있는 장소들', 'icon_name': 'landmark', 'color_code': '#4ECDC4'},
            {'id': 3, 'name': '문화', 'description': '예술과 문화를 체험할 수 있는 장소들', 'icon_name': 'theater', 'color_code': '#45B7D1'},
            {'id': 4, 'name': '음식', 'description': '광주의 맛있는 음식을 맛볼 수 있는 곳들', 'icon_name': 'utensils', 'color_code': '#96CEB4'},
            {'id': 5, 'name': '자연', 'description': '자연과 휴식을 즐길 수 있는 장소들', 'icon_name': 'tree', 'color_code': '#FFEAA7'}
        ]
        
        for theme in themes_data:
            conn.execute(sqlalchemy.text("""
                INSERT INTO themes (id, name, description, icon_name, color_code) 
                VALUES (:id, :name, :description, :icon_name, :color_code)
                ON CONFLICT (id) DO NOTHING
            """), theme)
        
        # spots 테이블에 데이터 삽입
        print("📍 SPOTS 테이블에 데이터 삽입...")
        spots_data = [
            {'id': 1, 'name': '무등산', 'theme_id': 5, 'description': '광주의 대표적인 자연 관광지', 'address': '광주광역시 북구 무등로 1', 'latitude': 35.1234, 'longitude': 126.5678, 'image_url': 'https://example.com/mudeungsan.jpg', 'operating_hours': '24시간', 'contact_info': '062-123-4567'},
            {'id': 2, 'name': '광주비엔날레', 'theme_id': 3, 'description': '국제 현대미술 전시회', 'address': '광주광역시 북구 비엔날레로 111', 'latitude': 35.2345, 'longitude': 126.6789, 'image_url': 'https://example.com/biennale.jpg', 'operating_hours': '10:00-18:00', 'contact_info': '062-234-5678'},
            {'id': 3, 'name': '5.18기념공원', 'theme_id': 2, 'description': '민주화운동을 기념하는 공원', 'address': '광주광역시 서구 상무대로 1', 'latitude': 35.3456, 'longitude': 126.7890, 'image_url': 'https://example.com/518park.jpg', 'operating_hours': '24시간', 'contact_info': '062-345-6789'},
            {'id': 4, 'name': '광주전통시장', 'theme_id': 1, 'description': '전통적인 시장 문화를 체험할 수 있는 곳', 'address': '광주광역시 동구 전통시장로 123', 'latitude': 35.4567, 'longitude': 126.8901, 'image_url': 'https://example.com/traditional_market.jpg', 'operating_hours': '09:00-18:00', 'contact_info': '062-456-7890'},
            {'id': 5, 'name': '광주천', 'theme_id': 5, 'description': '도시 속 자연을 느낄 수 있는 하천', 'address': '광주광역시 서구 광주천로 456', 'latitude': 35.5678, 'longitude': 126.9012, 'image_url': 'https://example.com/gwangju_river.jpg', 'operating_hours': '24시간', 'contact_info': '062-567-8901'}
        ]
        
        for spot in spots_data:
            conn.execute(sqlalchemy.text("""
                INSERT INTO spots (id, name, theme_id, description, address, latitude, longitude, image_url, operating_hours, contact_info) 
                VALUES (:id, :name, :theme_id, :description, :address, :latitude, :longitude, :image_url, :operating_hours, :contact_info)
                ON CONFLICT (id) DO NOTHING
            """), spot)
        
        # 변경사항 커밋
        conn.commit()
        print("✅ 테스트 데이터 삽입 완료!")
        
        # 삽입된 데이터 확인
        print("\n📊 삽입된 데이터 확인:")
        result = conn.execute(sqlalchemy.text("SELECT COUNT(*) FROM themes"))
        theme_count = result.fetchone()[0]
        result = conn.execute(sqlalchemy.text("SELECT COUNT(*) FROM spots"))
        spot_count = result.fetchone()[0]
        
        print(f"  - 테마 수: {theme_count}")
        print(f"  - 거점 수: {spot_count}")
        
except Exception as e:
    print(f"❌ 데이터 삽입 실패: {e}")
    print("🔍 오류 상세 정보:", str(e))
