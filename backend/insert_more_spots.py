from database import engine
import sqlalchemy

print("테마별 거점 추가 중...\n")

try:
    with engine.connect() as conn:
        # 쇼핑 테마 (ID: 1) - 4개 추가
        print("🛍️ 쇼핑 테마 거점 추가...")
        shopping_spots = [
            {'id': 6, 'name': '광주신세계백화점', 'theme_id': 1, 'description': '광주의 대표적인 백화점', 'address': '광주광역시 서구 상무대로 1', 'latitude': 35.1556, 'longitude': 126.8523, 'image_url': 'https://example.com/shinsegae.jpg', 'operating_hours': '10:30-20:00', 'contact_info': '062-123-4567'},
            {'id': 7, 'name': '광주롯데백화점', 'theme_id': 1, 'description': '광주 동구의 대형 백화점', 'address': '광주광역시 동구 동계로 123', 'latitude': 35.1678, 'longitude': 126.8634, 'image_url': 'https://example.com/lotte.jpg', 'operating_hours': '10:30-20:00', 'contact_info': '062-234-5678'},
            {'id': 8, 'name': '광주동성로 상권', 'theme_id': 1, 'description': '광주의 번화가이자 쇼핑 중심지', 'address': '광주광역시 동구 동성로 456', 'latitude': 35.1789, 'longitude': 126.8745, 'image_url': 'https://example.com/dongseong.jpg', 'operating_hours': '10:00-22:00', 'contact_info': '062-345-6789'},
            {'id': 9, 'name': '광주수완지구 상권', 'theme_id': 1, 'description': '신도시의 현대적인 쇼핑 공간', 'address': '광주광역시 광산구 수완로 789', 'latitude': 35.1890, 'longitude': 126.8856, 'image_url': 'https://example.com/suwan.jpg', 'operating_hours': '10:00-21:00', 'contact_info': '062-456-7890'}
        ]
        
        for spot in shopping_spots:
            conn.execute(sqlalchemy.text("""
                INSERT INTO spots (id, name, theme_id, description, address, latitude, longitude, image_url, operating_hours, contact_info) 
                VALUES (:id, :name, :theme_id, :description, :address, :latitude, :longitude, :image_url, :operating_hours, :contact_info)
            """), spot)
        
        # 역사 테마 (ID: 2) - 4개 추가
        print("🏛️ 역사 테마 거점 추가...")
        history_spots = [
            {'id': 10, 'name': '광주읍성', 'theme_id': 2, 'description': '조선시대 광주의 성곽 유적', 'address': '광주광역시 동구 읍성로 321', 'latitude': 35.2001, 'longitude': 126.8967, 'image_url': 'https://example.com/eupseong.jpg', 'operating_hours': '09:00-18:00', 'contact_info': '062-567-8901'},
            {'id': 11, 'name': '광주향교', 'theme_id': 2, 'description': '조선시대의 전통 교육기관', 'address': '광주광역시 동구 향교로 654', 'latitude': 35.2112, 'longitude': 126.9078, 'image_url': 'https://example.com/hyanggyo.jpg', 'operating_hours': '09:00-17:00', 'contact_info': '062-678-9012'},
            {'id': 12, 'name': '광주전통문화관', 'theme_id': 2, 'description': '광주의 전통문화를 체험할 수 있는 곳', 'address': '광주광역시 서구 문화로 987', 'latitude': 35.2223, 'longitude': 126.9189, 'image_url': 'https://example.com/traditional_culture.jpg', 'operating_hours': '10:00-18:00', 'contact_info': '062-789-0123'},
            {'id': 13, 'name': '광주민속박물관', 'theme_id': 2, 'description': '광주 지역의 민속 문화를 전시', 'address': '광주광역시 북구 민속로 654', 'latitude': 35.2334, 'longitude': 126.9290, 'image_url': 'https://example.com/folk_museum.jpg', 'operating_hours': '09:00-18:00', 'contact_info': '062-890-1234'}
        ]
        
        for spot in history_spots:
            conn.execute(sqlalchemy.text("""
                INSERT INTO spots (id, name, theme_id, description, address, latitude, longitude, image_url, operating_hours, contact_info) 
                VALUES (:id, :name, :theme_id, :description, :address, :latitude, :longitude, :image_url, :operating_hours, :contact_info)
            """), spot)
        
        # 문화 테마 (ID: 3) - 4개 추가
        print("🎭 문화 테마 거점 추가...")
        culture_spots = [
            {'id': 14, 'name': '광주예술의전당', 'theme_id': 3, 'description': '광주의 대표적인 공연예술 공간', 'address': '광주광역시 서구 예술로 321', 'latitude': 35.2445, 'longitude': 126.9401, 'image_url': 'https://example.com/art_hall.jpg', 'operating_hours': '10:00-22:00', 'contact_info': '062-901-2345'},
            {'id': 15, 'name': '광주시립미술관', 'theme_id': 3, 'description': '현대미술과 전통미술을 전시하는 미술관', 'address': '광주광역시 북구 미술로 987', 'latitude': 35.2556, 'longitude': 126.9512, 'image_url': 'https://example.com/art_museum.jpg', 'operating_hours': '10:00-18:00', 'contact_info': '062-012-3456'},
            {'id': 16, 'name': '광주시립극단', 'theme_id': 3, 'description': '광주의 대표적인 연극 공연단', 'address': '광주광역시 동구 연극로 654', 'latitude': 35.2667, 'longitude': 126.9623, 'image_url': 'https://example.com/theater.jpg', 'operating_hours': '10:00-22:00', 'contact_info': '062-123-4567'},
            {'id': 17, 'name': '광주아시아문화전당', 'theme_id': 3, 'description': '아시아 문화 교류의 중심지', 'address': '광주광역시 서구 아시아로 321', 'latitude': 35.2778, 'longitude': 126.9734, 'image_url': 'https://example.com/asia_culture.jpg', 'operating_hours': '10:00-18:00', 'contact_info': '062-234-5678'}
        ]
        
        for spot in culture_spots:
            conn.execute(sqlalchemy.text("""
                INSERT INTO spots (id, name, theme_id, description, address, latitude, longitude, image_url, operating_hours, contact_info) 
                VALUES (:id, :name, :theme_id, :description, :address, :latitude, :longitude, :image_url, :operating_hours, :contact_info)
            """), spot)
        
        # 음식 테마 (ID: 4) - 5개 추가
        print("🍜 음식 테마 거점 추가...")
        food_spots = [
            {'id': 18, 'name': '광주대인시장 맛집거리', 'theme_id': 4, 'description': '광주의 대표적인 전통시장 맛집', 'address': '광주광역시 동구 대인시장로 123', 'latitude': 35.2889, 'longitude': 126.9845, 'image_url': 'https://example.com/daein_food.jpg', 'operating_hours': '06:00-22:00', 'contact_info': '062-345-6789'},
            {'id': 19, 'name': '광주전통한식거리', 'theme_id': 4, 'description': '전통 한식의 맛을 느낄 수 있는 거리', 'address': '광주광역시 서구 한식로 456', 'latitude': 35.2990, 'longitude': 126.9956, 'image_url': 'https://example.com/traditional_food.jpg', 'operating_hours': '11:00-22:00', 'contact_info': '062-456-7890'},
            {'id': 20, 'name': '광주카페거리', 'theme_id': 4, 'description': '트렌디한 카페들이 모여있는 거리', 'address': '광주광역시 북구 카페로 789', 'latitude': 35.3001, 'longitude': 127.0067, 'image_url': 'https://example.com/cafe_street.jpg', 'operating_hours': '08:00-24:00', 'contact_info': '062-567-8901'},
            {'id': 21, 'name': '광주야시장', 'theme_id': 4, 'description': '밤에 열리는 다양한 먹거리 시장', 'address': '광주광역시 동구 야시장로 321', 'latitude': 35.3112, 'longitude': 127.0178, 'image_url': 'https://example.com/night_market.jpg', 'operating_hours': '18:00-02:00', 'contact_info': '062-678-9012'},
            {'id': 22, 'name': '광주로컬푸드거리', 'theme_id': 4, 'description': '광주 지역 특산품과 로컬 음식', 'address': '광주광역시 서구 로컬로 654', 'latitude': 35.3223, 'longitude': 127.0289, 'image_url': 'https://example.com/local_food.jpg', 'operating_hours': '10:00-21:00', 'contact_info': '062-789-0123'}
        ]
        
        for spot in food_spots:
            conn.execute(sqlalchemy.text("""
                INSERT INTO spots (id, name, theme_id, description, address, latitude, longitude, image_url, operating_hours, contact_info) 
                VALUES (:id, :name, :theme_id, :description, :address, :latitude, :longitude, :image_url, :operating_hours, :contact_info)
            """), spot)
        
        # 자연 테마 (ID: 5) - 3개 추가
        print("🌳 자연 테마 거점 추가...")
        nature_spots = [
            {'id': 23, 'name': '광주호수공원', 'theme_id': 5, 'description': '도시 속에서 자연을 느낄 수 있는 호수공원', 'address': '광주광역시 서구 호수로 987', 'latitude': 35.3334, 'longitude': 127.0400, 'image_url': 'https://example.com/lake_park.jpg', 'operating_hours': '24시간', 'contact_info': '062-890-1234'},
            {'id': 24, 'name': '광주수목원', 'theme_id': 5, 'description': '다양한 식물과 나무를 관찰할 수 있는 수목원', 'address': '광주광역시 북구 수목원로 321', 'latitude': 35.3445, 'longitude': 127.0511, 'image_url': 'https://example.com/arboretum.jpg', 'operating_hours': '09:00-18:00', 'contact_info': '062-901-2345'},
            {'id': 25, 'name': '광주생태공원', 'theme_id': 5, 'description': '자연 생태계를 체험할 수 있는 공원', 'address': '광주광역시 동구 생태로 654', 'latitude': 35.3556, 'longitude': 127.0622, 'image_url': 'https://example.com/eco_park.jpg', 'operating_hours': '24시간', 'contact_info': '062-012-3456'}
        ]
        
        for spot in nature_spots:
            conn.execute(sqlalchemy.text("""
                INSERT INTO spots (id, name, theme_id, description, address, latitude, longitude, image_url, operating_hours, contact_info) 
                VALUES (:id, :name, :theme_id, :description, :address, :latitude, :longitude, :image_url, :operating_hours, :contact_info)
            """), spot)
        
        # 변경사항 커밋
        conn.commit()
        print("✅ 테마별 거점 추가 완료!")
        
        # 추가된 데이터 확인
        print("\n📊 테마별 거점 수 확인:")
        for theme_id in range(1, 6):
            result = conn.execute(sqlalchemy.text("SELECT COUNT(*) FROM spots WHERE theme_id = :theme_id"), {"theme_id": theme_id})
            count = result.fetchone()[0]
            theme_names = {1: "쇼핑", 2: "역사", 3: "문화", 4: "음식", 5: "자연"}
            print(f"  - {theme_names[theme_id]}: {count}개")
        
        # 전체 거점 수 확인
        result = conn.execute(sqlalchemy.text("SELECT COUNT(*) FROM spots"))
        total_count = result.fetchone()[0]
        print(f"\n📊 총 거점 수: {total_count}개")
        
except Exception as e:
    print(f"❌ 거점 추가 실패: {e}")
    print("🔍 오류 상세 정보:", str(e))
