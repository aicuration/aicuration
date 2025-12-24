#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sqlite3
import sys

def modify_database():
    """데이터베이스 수정 함수"""
    print('🔄 데이터베이스 수정 도구')
    
    # SQLite 데이터베이스 연결
    conn = sqlite3.connect('gwangju_tour.db')
    cursor = conn.cursor()
    
    while True:
        print('\n📋 선택하세요:')
        print('1. 관광지 추가')
        print('2. 관광지 수정')
        print('3. 관광지 삭제')
        print('4. 테마 추가')
        print('5. 데이터 조회')
        print('6. 종료')
        
        choice = input('\n선택 (1-6): ')
        
        if choice == '1':
            add_spot(cursor)
        elif choice == '2':
            update_spot(cursor)
        elif choice == '3':
            delete_spot(cursor)
        elif choice == '4':
            add_theme(cursor)
        elif choice == '5':
            view_data(cursor)
        elif choice == '6':
            break
        else:
            print('❌ 잘못된 선택입니다.')
    
    conn.commit()
    conn.close()
    print('✅ 데이터베이스 수정 완료!')

def add_spot(cursor):
    """관광지 추가"""
    print('\n📍 관광지 추가')
    
    # 테마 목록 표시
    cursor.execute('SELECT id, name FROM themes')
    themes = cursor.fetchall()
    print('테마 목록:')
    for theme_id, theme_name in themes:
        print(f'  {theme_id}: {theme_name}')
    
    try:
        name = input('관광지 이름: ')
        theme_id = int(input('테마 ID: '))
        description = input('설명 (선택사항): ')
        address = input('주소 (선택사항): ')
        latitude = float(input('위도 (선택사항, 0 입력 시 건너뛰기): ')) or None
        longitude = float(input('경도 (선택사항, 0 입력 시 건너뛰기): ')) or None
        operating_hours = input('운영시간 (선택사항): ')
        contact_info = input('연락처 (선택사항): ')
        image_url = input('이미지 URL (선택사항): ')
        
        cursor.execute('''
            INSERT INTO spots (name, theme_id, description, address, latitude, longitude, 
                             operating_hours, contact_info, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (name, theme_id, description, address, latitude, longitude, 
              operating_hours, contact_info, image_url))
        
        print('✅ 관광지가 추가되었습니다!')
        
    except ValueError:
        print('❌ 잘못된 입력입니다.')
    except Exception as e:
        print(f'❌ 오류: {e}')

def update_spot(cursor):
    """관광지 수정"""
    print('\n✏️ 관광지 수정')
    
    spot_id = input('수정할 관광지 ID: ')
    
    # 현재 정보 표시
    cursor.execute('SELECT * FROM spots WHERE id = ?', (spot_id,))
    spot = cursor.fetchone()
    
    if not spot:
        print('❌ 해당 ID의 관광지가 없습니다.')
        return
    
    print(f'현재 정보: {spot[1]} (테마 ID: {spot[2]})')
    
    try:
        name = input(f'이름 (현재: {spot[1]}): ') or spot[1]
        theme_id = int(input(f'테마 ID (현재: {spot[2]}): ') or spot[2])
        description = input(f'설명 (현재: {spot[3] or ""}): ') or spot[3]
        address = input(f'주소 (현재: {spot[4] or ""}): ') or spot[4]
        
        cursor.execute('''
            UPDATE spots 
            SET name = ?, theme_id = ?, description = ?, address = ?
            WHERE id = ?
        ''', (name, theme_id, description, address, spot_id))
        
        print('✅ 관광지가 수정되었습니다!')
        
    except ValueError:
        print('❌ 잘못된 입력입니다.')
    except Exception as e:
        print(f'❌ 오류: {e}')

def delete_spot(cursor):
    """관광지 삭제"""
    print('\n🗑️ 관광지 삭제')
    
    spot_id = input('삭제할 관광지 ID: ')
    
    # 확인
    cursor.execute('SELECT name FROM spots WHERE id = ?', (spot_id,))
    spot = cursor.fetchone()
    
    if not spot:
        print('❌ 해당 ID의 관광지가 없습니다.')
        return
    
    confirm = input(f'정말로 "{spot[0]}"을(를) 삭제하시겠습니까? (y/N): ')
    
    if confirm.lower() == 'y':
        cursor.execute('DELETE FROM spots WHERE id = ?', (spot_id,))
        print('✅ 관광지가 삭제되었습니다!')
    else:
        print('❌ 삭제가 취소되었습니다.')

def add_theme(cursor):
    """테마 추가"""
    print('\n🎨 테마 추가')
    
    try:
        name = input('테마 이름: ')
        description = input('테마 설명 (선택사항): ')
        icon_name = input('아이콘 이름 (선택사항): ')
        color_code = input('색상 코드 (선택사항): ')
        
        cursor.execute('''
            INSERT INTO themes (name, description, icon_name, color_code)
            VALUES (?, ?, ?, ?)
        ''', (name, description, icon_name, color_code))
        
        print('✅ 테마가 추가되었습니다!')
        
    except Exception as e:
        print(f'❌ 오류: {e}')

def view_data(cursor):
    """데이터 조회"""
    print('\n📊 데이터 조회')
    
    print('1. 모든 테마')
    print('2. 모든 관광지')
    print('3. 특정 테마의 관광지')
    
    choice = input('선택 (1-3): ')
    
    if choice == '1':
        cursor.execute('SELECT * FROM themes')
        themes = cursor.fetchall()
        print('\n테마 목록:')
        for theme in themes:
            print(f'  ID: {theme[0]}, 이름: {theme[1]}, 설명: {theme[2]}')
    
    elif choice == '2':
        cursor.execute('SELECT id, name, theme_id FROM spots')
        spots = cursor.fetchall()
        print('\n관광지 목록:')
        for spot in spots:
            print(f'  ID: {spot[0]}, 이름: {spot[1]}, 테마 ID: {spot[2]}')
    
    elif choice == '3':
        theme_id = input('테마 ID: ')
        cursor.execute('SELECT * FROM spots WHERE theme_id = ?', (theme_id,))
        spots = cursor.fetchall()
        print(f'\n테마 {theme_id}의 관광지:')
        for spot in spots:
            print(f'  ID: {spot[0]}, 이름: {spot[1]}')

if __name__ == '__main__':
    modify_database()




















