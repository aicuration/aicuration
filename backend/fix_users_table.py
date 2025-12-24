from database import engine
import sqlalchemy

print("🔧 users 테이블 점검/수정 시작...")

def column_exists(conn, table_name: str, column_name: str) -> bool:
    result = conn.execute(sqlalchemy.text(
        """
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = :table
          AND column_name = :col
        """
    ), {"table": table_name, "col": column_name}).fetchone()
    return result is not None

def table_exists(conn, table_name: str) -> bool:
    result = conn.execute(sqlalchemy.text(
        """
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = :table
        """
    ), {"table": table_name}).fetchone()
    return result is not None

with engine.begin() as conn:
    # users 테이블 없으면 생성
    if not table_exists(conn, 'users'):
        print("users 테이블이 없어 생성합니다...")
        conn.execute(sqlalchemy.text(
            """
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        ))
        print("✅ users 테이블 생성 완료")
    else:
        # email 컬럼 없으면 추가 (nullable로 먼저 추가)
        if not column_exists(conn, 'users', 'email'):
            print("users.email 컬럼이 없어 추가합니다...")
            conn.execute(sqlalchemy.text("ALTER TABLE users ADD COLUMN email VARCHAR(100)"))
            print("✅ email 컬럼 추가 완료")
            # 고유 인덱스(널 제외) 생성 시도
            try:
                conn.execute(sqlalchemy.text(
                    "CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users(email)"
                ))
                print("✅ email 고유 인덱스 생성(또는 존재) 완료")
            except Exception as e:
                print(f"⚠️ email 고유 인덱스 생성 실패(무시 가능): {e}")
        else:
            print("users.email 컬럼이 이미 존재합니다")

print("🎉 users 테이블 점검/수정 완료")



