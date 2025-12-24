from database import engine
import sqlalchemy

print("📊 설문조사 데이터 확인 중...\n")

try:
    with engine.connect() as conn:
        # 전체 응답 수 확인
        result = conn.execute(sqlalchemy.text('SELECT COUNT(*) FROM survey_responses')).scalar()
        print(f'현재 저장된 설문조사 응답 수: {result}')
        
        if result > 0:
            print('\n📋 최근 응답 3개:')
            recent = conn.execute(sqlalchemy.text('''
                SELECT id, user_id, session_id, responses, created_at 
                FROM survey_responses 
                ORDER BY created_at DESC 
                LIMIT 3
            ''')).fetchall()
            
            for row in recent:
                print(f'ID: {row[0]}, 사용자: {row[1]}, 세션: {row[2][:8]}..., 시간: {row[4]}')
                print(f'응답 데이터: {row[3]}')
                print('---')
        else:
            print('❌ 저장된 설문조사 응답이 없습니다.')
            print('🔍 설문조사 제출 시 오류가 있었을 수 있습니다.')
            
        # 테이블 구조 확인
        print('\n📋 테이블 구조:')
        columns = conn.execute(sqlalchemy.text("""
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'survey_responses' 
            ORDER BY ordinal_position
        """)).fetchall()
        
        for col in columns:
            print(f'  {col[0]}: {col[1]} (NULL: {col[2]})')

except Exception as e:
    print(f'❌ 데이터베이스 연결 실패: {e}')
    print('🔍 PostgreSQL 서버가 실행 중인지 확인해주세요.')


