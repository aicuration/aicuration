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
    # SQLite는 ALTER TABLE로 NOT NULL 제약을 직접 제거할 수 없으므로
    # 테이블 재생성 방식 사용
    
    # 1. 현재 users 테이블 구조 확인
    cursor.execute("PRAGMA table_info(users)")
    columns = cursor.fetchall()
    print("\n현재 users 테이블 구조:")
    for col in columns:
        print(f"  {col[1]} ({col[2]}) - NOT NULL: {col[3]}")
    
    # 2. 기존 데이터 백업
    cursor.execute("SELECT * FROM users")
    existing_users = cursor.fetchall()
    print(f"\n기존 사용자 수: {len(existing_users)}")
    
    # 3. 임시 테이블이 있으면 삭제
    cursor.execute("DROP TABLE IF EXISTS users_new")
    
    # 4. 새 테이블 생성 (password_hash를 NULL 허용)
    print("\n새 테이블 생성 중...")
    cursor.execute("""
        CREATE TABLE users_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255),
            google_id TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # 5. 기존 데이터 복사
    print("기존 데이터 복사 중...")
    print(f"기존 컬럼 개수: {len(columns)}")
    print(f"데이터 튜플 길이: {len(existing_users[0]) if existing_users else 0}")
    
    # 컬럼 순서 확인
    col_names = [col[1] for col in columns]
    print(f"컬럼 순서: {col_names}")
    
    for user in existing_users:
        # 기존 데이터의 순서에 맞춰 매핑
        user_dict = dict(zip(col_names, user))
        
        cursor.execute("""
            INSERT INTO users_new (id, username, email, password_hash, google_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            user_dict.get('id'),
            user_dict.get('username'),
            user_dict.get('email'),
            user_dict.get('password_hash'),
            user_dict.get('google_id'),
            user_dict.get('created_at'),
            user_dict.get('updated_at', user_dict.get('created_at'))  # updated_at이 없으면 created_at 사용
        ))
    
    # 6. 기존 테이블 삭제 및 새 테이블 이름 변경
    print("테이블 교체 중...")
    cursor.execute("DROP TABLE users")
    cursor.execute("ALTER TABLE users_new RENAME TO users")
    
    # 7. 인덱스 재생성
    print("인덱스 재생성 중...")
    cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username)")
    cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email)")
    try:
        cursor.execute("""
            CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id
            ON users(google_id) WHERE google_id IS NOT NULL
        """)
    except:
        pass  # 이미 존재할 수 있음
    
    conn.commit()
    print("\n✅ password_hash 컬럼이 NULL을 허용하도록 수정되었습니다!")
    
    # 8. 최종 확인
    cursor.execute("PRAGMA table_info(users)")
    columns = cursor.fetchall()
    print("\n수정된 users 테이블 구조:")
    for col in columns:
        not_null = "NOT NULL" if col[3] else "NULL 허용"
        print(f"  {col[1]} ({col[2]}) - {not_null}")

except Exception as e:
    print(f"\n❌ 오류 발생: {e}")
    conn.rollback()
finally:
    conn.close()

