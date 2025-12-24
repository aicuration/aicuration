#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sqlite3
import webbrowser
import os

def open_db_browser():
    """데이터베이스 브라우저 열기"""
    print('🔄 데이터베이스 브라우저 열기')
    
    # SQLite 데이터베이스 연결
    conn = sqlite3.connect('gwangju_tour.db')
    cursor = conn.cursor()
    
    # 테이블 구조 확인
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    
    print('\n📋 데이터베이스 테이블:')
    for table in tables:
        print(f'  - {table[0]}')
    
    print('\n🔧 수정 방법:')
    print('1. Python 스크립트 사용: python modify_db.py')
    print('2. SQLite 브라우저 도구 사용 (추천)')
    print('3. 직접 SQL 쿼리 실행')
    
    # SQLite 브라우저 다운로드 링크
    print('\n📥 SQLite 브라우저 다운로드:')
    print('https://sqlitebrowser.org/')
    
    # 데이터베이스 파일 위치 표시
    db_path = os.path.abspath('gwangju_tour.db')
    print(f'\n📁 데이터베이스 파일 위치: {db_path}')
    
    conn.close()

if __name__ == '__main__':
    open_db_browser()




















