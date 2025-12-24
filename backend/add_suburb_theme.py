from database import engine
import sqlalchemy

def add_suburb_theme():
    try:
        with engine.connect() as conn:
            print("🏞️ 근교 테마 추가 중...")
            
            # 근교 테마 추가
            conn.execute(sqlalchemy.text("""
                INSERT INTO themes (id, name, description, icon_name, color_code) 
                VALUES (:id, :name, :description, :icon_name, :color_code)
            """), {
                'id': 8,
                'name': '근교',
                'description': '광주 주변 위성도시의 아름다운 관광지들',
                'icon_name': 'map-pin',
                'color_code': '#9B59B6'
            })
            
            conn.commit()
            print("✅ 근교 테마가 추가되었습니다!")
            
            # 추가된 테마 확인
            result = conn.execute(sqlalchemy.text("SELECT * FROM themes WHERE id = 8"))
            theme = result.fetchone()
            if theme:
                print(f"🏞️ 테마 ID: {theme[0]}")
                print(f"🏞️ 테마명: {theme[1]}")
                print(f"🏞️ 설명: {theme[2]}")
                print(f"🏞️ 아이콘: {theme[3]}")
                print(f"🏞️ 색상: {theme[4]}")
            
            print("\n✅ 근교 테마 생성 완료!")
            
    except Exception as e:
        print(f"❌ 근교 테마 추가 실패: {e}")

if __name__ == "__main__":
    add_suburb_theme()




















