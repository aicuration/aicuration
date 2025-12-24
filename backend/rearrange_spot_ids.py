#!/usr/bin/env python3
"""
관광지 ID를 테마별로 순서대로 재배치하는 스크립트
- 기존 관광지 내용은 그대로 유지
- ID만 테마별로 연속되도록 재배치
"""

from database import engine
import sqlalchemy

def create_id_mapping():
    """테마별 ID 매핑 생성"""
    mapping = {}
    
    # 테마별 목표 ID 범위
    theme_ranges = {
        1: (1, 16),    # 쇼핑
        2: (17, 32),   # 역사
        3: (33, 48),   # 문화
        4: (49, 64),   # 음식
        5: (65, 80),   # 자연
        6: (81, 96),   # 체험
        7: (97, 112),  # 숙박 (이미 완벽)
        8: (113, 132)  # 근교 (추가 예정)
    }
    
    with engine.connect() as conn:
        # 테마별 현재 ID 목록 가져오기
        for theme_id in sorted(theme_ranges.keys()):
            result = conn.execute(sqlalchemy.text('''
                SELECT id FROM spots 
                WHERE theme_id = :theme_id 
                ORDER BY id
            '''), {'theme_id': theme_id})
            
            current_ids = [row[0] for row in result.fetchall()]
            
            if current_ids:
                start_id, end_id = theme_ranges[theme_id]
                new_ids = list(range(start_id, start_id + len(current_ids)))
                
                # 매핑 생성
                for old_id, new_id in zip(current_ids, new_ids):
                    mapping[old_id] = new_id
                
                print(f"테마 {theme_id}: {len(current_ids)}개 관광지")
                print(f"  기존 ID: {current_ids}")
                print(f"  새 ID: {new_ids}")
                print()
    
    return mapping

def backup_route_spots():
    """route_spots 테이블 백업"""
    with engine.connect() as conn:
        conn.execute(sqlalchemy.text('''
            CREATE TABLE IF NOT EXISTS route_spots_backup AS 
            SELECT * FROM route_spots
        '''))
        print("✅ route_spots 테이블 백업 완료")

def update_route_spots(mapping):
    """route_spots 테이블의 spot_id 업데이트"""
    with engine.connect() as conn:
        for old_id, new_id in mapping.items():
            conn.execute(sqlalchemy.text('''
                UPDATE route_spots 
                SET spot_id = :new_id 
                WHERE spot_id = :old_id
            '''), {'old_id': old_id, 'new_id': new_id})
        
        conn.commit()
        print(f"✅ route_spots 테이블 업데이트 완료 ({len(mapping)}개 매핑)")

def update_spots_table(mapping):
    """spots 테이블의 ID 재배치"""
    with engine.connect() as conn:
        # 외래키 제약조건 임시 비활성화
        conn.execute(sqlalchemy.text('SET session_replication_role = replica;'))
        
        # 임시 ID로 먼저 변경 (충돌 방지)
        temp_mapping = {}
        temp_id = 9999
        
        for old_id, new_id in mapping.items():
            temp_mapping[old_id] = temp_id
            temp_id += 1
        
        # 1단계: 임시 ID로 변경
        for old_id, temp_id in temp_mapping.items():
            conn.execute(sqlalchemy.text('''
                UPDATE spots SET id = :temp_id WHERE id = :old_id
            '''), {'old_id': old_id, 'temp_id': temp_id})
        
        # 2단계: 최종 ID로 변경
        for old_id, new_id in mapping.items():
            temp_id = temp_mapping[old_id]
            conn.execute(sqlalchemy.text('''
                UPDATE spots SET id = :new_id WHERE id = :temp_id
            '''), {'new_id': new_id, 'temp_id': temp_id})
        
        # 외래키 제약조건 재활성화
        conn.execute(sqlalchemy.text('SET session_replication_role = DEFAULT;'))
        
        conn.commit()
        print(f"✅ spots 테이블 ID 재배치 완료 ({len(mapping)}개)")

def verify_results():
    """재배치 결과 검증"""
    with engine.connect() as conn:
        result = conn.execute(sqlalchemy.text('''
            SELECT 
                t.id as theme_id,
                t.name as theme_name,
                COUNT(s.id) as spot_count,
                MIN(s.id) as min_id,
                MAX(s.id) as max_id,
                ARRAY_AGG(s.id ORDER BY s.id) as spot_ids
            FROM themes t
            LEFT JOIN spots s ON t.id = s.theme_id
            GROUP BY t.id, t.name
            ORDER BY t.id
        '''))
        
        print("\n📊 재배치 후 테마별 관광지 ID 분포:")
        print("=" * 70)
        
        for row in result.fetchall():
            theme_id, theme_name, spot_count, min_id, max_id, spot_ids = row
            print(f"\n🏷️ 테마 {theme_id}: {theme_name}")
            print(f"   총 {spot_count}개 관광지")
            
            if spot_count > 0:
                print(f"   ID 범위: {min_id} ~ {max_id}")
                print(f"   ID 목록: {spot_ids}")
                
                # 연속성 확인
                ids = sorted(spot_ids)
                is_consecutive = all(ids[i] == ids[i-1] + 1 for i in range(1, len(ids)))
                if is_consecutive:
                    print(f"   ✅ ID 연속됨")
                else:
                    print(f"   ⚠️ ID 비연속")

def main():
    """메인 실행 함수"""
    print("🚀 관광지 ID 재배치 시작...")
    print("=" * 50)
    
    try:
        # 1. ID 매핑 생성
        print("1️⃣ ID 매핑 생성 중...")
        mapping = create_id_mapping()
        
        if not mapping:
            print("❌ 매핑할 ID가 없습니다.")
            return
        
        print(f"총 {len(mapping)}개의 ID 매핑 생성됨")
        
        # 2. 백업
        print("\n2️⃣ 백업 생성 중...")
        backup_route_spots()
        
        # 3. route_spots 테이블 업데이트
        print("\n3️⃣ route_spots 테이블 업데이트 중...")
        update_route_spots(mapping)
        
        # 4. spots 테이블 재배치
        print("\n4️⃣ spots 테이블 ID 재배치 중...")
        update_spots_table(mapping)
        
        # 5. 결과 검증
        print("\n5️⃣ 결과 검증 중...")
        verify_results()
        
        print("\n🎉 ID 재배치 완료!")
        
    except Exception as e:
        print(f"\n❌ 오류 발생: {e}")
        print("백업 테이블에서 복구하시거나 데이터베이스를 다시 설정해주세요.")

if __name__ == "__main__":
    main()




















