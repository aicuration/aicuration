from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pathlib import Path

# 데이터베이스 URL (SQLite로 변경)
BASE_DIR = Path(__file__).resolve().parent  # backend 폴더
DB_PATH = BASE_DIR / "gwangju_tour.db"
DATABASE_URL = f"sqlite:///{DB_PATH}"
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