from database import engine
import sqlalchemy

print("데이터베이스 연결 테스트 중...")

try:
    # 연결 테스트
    with engine.connect() as conn:
        result = conn.execute(sqlalchemy.text("SELECT 1"))
        print("✅ PostgreSQL 데이터베이스 연결 성공!")
        
        # 데이터베이스 정보 확인
        result = conn.execute(sqlalchemy.text("SELECT current_database(), current_user, version()"))
        db_info = result.fetchone()
        print(f"📊 데이터베이스: {db_info[0]}")
        print(f"👤 사용자: {db_info[1]}")
        print(f"🔧 PostgreSQL 버전: {db_info[2]}")
        
        # 테이블 존재 여부 확인
        result = conn.execute(sqlalchemy.text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """))
        tables = [row[0] for row in result.fetchall()]
        print(f"📋 현재 테이블: {tables}")
        
except Exception as e:
    print(f"❌ 데이터베이스 연결 실패: {e}")
    print("\n🔍 문제 해결 방법:")
    print("1. PostgreSQL 서비스가 실행 중인지 확인")
    print("2. pgAdmin4에서 데이터베이스 'gwangju_tour_db'가 존재하는지 확인")
    print("3. 사용자 'postgres'와 비밀번호 '0969'가 올바른지 확인")
    print("4. 포트 5432가 올바른지 확인")






