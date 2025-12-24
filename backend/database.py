from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 데이터베이스 URL (SQLite로 변경)
DATABASE_URL = "sqlite:///./gwangju_tour.db"

# 데이터베이스 엔진 생성
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# 세션 팩토리 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 베이스 클래스 생성
Base = declarative_base()

# 데이터베이스 세션 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()