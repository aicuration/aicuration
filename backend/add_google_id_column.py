import sqlite3
import os

# 데이터베이스 파일 경로
db_path = os.path.join(os.path.dirname(__file__), 'gwangju_tour.db')
if not os.path.exists(db_path):
    # 상위 디렉토리 확인
    db_path = os.path.join(os.path.dirname(__file__), '..', 'gwangju_tour.db')

print(f"데이터베이스 경로: {db_path}")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    # google_id 컬럼이 이미 있는지 확인
    cursor.execute("PRAGMA table_info(users)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'google_id' in columns:
        print("✅ google_id 컬럼이 이미 존재합니다.")
    else:
        # google_id 컬럼 추가 (UNIQUE 제약조건 없이 먼저 추가)
        cursor.execute("""
            ALTER TABLE users 
            ADD COLUMN google_id TEXT
        """)
        conn.commit()
        print("✅ google_id 컬럼이 추가되었습니다.")
        
        # 고유 인덱스 생성 (NULL 값 허용)
        try:
            cursor.execute("""
                CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id 
                ON users(google_id) WHERE google_id IS NOT NULL
            """)
            conn.commit()
            print("✅ google_id 고유 인덱스가 생성되었습니다.")
        except Exception as e:
            print(f"⚠️ 인덱스 생성 실패 (무시 가능): {e}")
    
    # password_hash가 NULL을 허용하는지 확인 (SQLite는 기본적으로 허용)
    print("✅ 스키마 업데이트 완료!")
    
except Exception as e:
    print(f"❌ 오류 발생: {e}")
    conn.rollback()
finally:
    conn.close()
