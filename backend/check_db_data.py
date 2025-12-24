from database import engine
import sqlalchemy

print("📊 실제 데이터베이스에 저장된 관광지 데이터 확인")
print("="*60)

try:
    with engine.connect() as conn:
        # 관광지 데이터 조회
        result = conn.execute(sqlalchemy.text('''
            SELECT s.id, s.name, s.theme_id, t.name as theme_name 
            FROM spots s 
            JOIN themes t ON s.theme_id = t.id 
            ORDER BY s.theme_id, s.id
        '''))
        spots = result.fetchall()
        
        print(f"총 {len(spots)}개의 관광지가 있습니다:\n")
        
        current_theme = None
        for spot in spots:
            if current_theme != spot[3]:  # theme_name
                current_theme = spot[3]
                print(f"\n🎯 {current_theme} 테마:")
                print("-" * 30)
            
            print(f"  ID: {spot[0]:2d} | {spot[1]}")
        
        print("\n" + "="*60)
        
        # 테마별 개수 확인
        print("테마별 관광지 개수:")
        theme_count_result = conn.execute(sqlalchemy.text('''
            SELECT t.name, COUNT(s.id) as count
            FROM themes t 
            LEFT JOIN spots s ON t.id = s.theme_id 
            GROUP BY t.id, t.name 
            ORDER BY t.id
        '''))
        
        for theme in theme_count_result.fetchall():
            print(f"  {theme[0]}: {theme[1]}개")

except Exception as e:
    print(f"❌ 데이터베이스 연결 실패: {e}")
    print("🔍 PostgreSQL 서버가 실행 중인지 확인해주세요.")




