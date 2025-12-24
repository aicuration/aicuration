from database import engine
import sqlalchemy

print("🗑️ 설문조사 데이터 삭제 중...\n")

try:
    with engine.connect() as conn:
        # 먼저 현재 데이터 개수 확인
        count_before = conn.execute(sqlalchemy.text("SELECT COUNT(*) FROM survey_responses")).scalar()
        print(f"📊 삭제 전 설문조사 응답 수: {count_before}")
        
        if count_before > 0:
            # 모든 설문조사 데이터 삭제
            print("🗑️ 모든 설문조사 응답 삭제 중...")
            result = conn.execute(sqlalchemy.text("DELETE FROM survey_responses"))
            deleted_count = result.rowcount
            
            conn.commit()
            
            # 삭제 후 데이터 개수 확인
            count_after = conn.execute(sqlalchemy.text("SELECT COUNT(*) FROM survey_responses")).scalar()
            
            print(f"✅ {deleted_count}개의 설문조사 응답이 삭제되었습니다!")
            print(f"📊 삭제 후 설문조사 응답 수: {count_after}")
        else:
            print("ℹ️ 삭제할 설문조사 데이터가 없습니다.")
            
        # 테이블 구조는 유지 (테이블 자체는 삭제하지 않음)
        print("\n📋 테이블 구조는 그대로 유지됩니다.")
        print("🔄 새로운 설문조사 응답을 받을 준비가 완료되었습니다!")

except Exception as e:
    print(f"❌ 데이터 삭제 실패: {e}")
    print("🔍 PostgreSQL 서버가 실행 중인지 확인해주세요.")



