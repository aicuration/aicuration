#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sqlite3
import json
from database import engine
import sqlalchemy

def convert_to_sqlite():
    print('🔄 PostgreSQL → SQLite 변환 시작...')
    
    # SQLite 데이터베이스 생성
    sqlite_conn = sqlite3.connect('gwangju_tour.db')
    sqlite_cursor = sqlite_conn.cursor()
    
    # PostgreSQL에서 데이터 추출
    with engine.connect() as conn:
        print('📊 PostgreSQL에서 데이터 추출 중...')
        
        # 테이블 생성 및 데이터 삽입
        tables = [
            ('themes', '''
                CREATE TABLE IF NOT EXISTS themes (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    description TEXT,
                    icon_name TEXT,
                    color_code TEXT
                )
            '''),
            ('spots', '''
                CREATE TABLE IF NOT EXISTS spots (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    theme_id INTEGER,
                    description TEXT,
                    address TEXT,
                    latitude REAL,
                    longitude REAL,
                    operating_hours TEXT,
                    contact_info TEXT,
                    created_at TIMESTAMP,
                    updated_at TIMESTAMP,
                    image_url TEXT,
                    FOREIGN KEY (theme_id) REFERENCES themes (id)
                )
            '''),
            ('users', '''
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY,
                    username TEXT UNIQUE NOT NULL,
                    created_at TIMESTAMP,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL
                )
            '''),
            ('user_routes', '''
                CREATE TABLE IF NOT EXISTS user_routes (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    description TEXT,
                    estimated_time TEXT,
                    total_distance REAL,
                    created_at TIMESTAMP,
                    updated_at TIMESTAMP,
                    user_id INTEGER,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            '''),
            ('route_spots', '''
                CREATE TABLE IF NOT EXISTS route_spots (
                    id INTEGER PRIMARY KEY,
                    route_id INTEGER,
                    spot_id INTEGER,
                    spot_order INTEGER,
                    created_at TIMESTAMP,
                    FOREIGN KEY (route_id) REFERENCES user_routes (id),
                    FOREIGN KEY (spot_id) REFERENCES spots (id)
                )
            '''),
            ('survey_responses', '''
                CREATE TABLE IF NOT EXISTS survey_responses (
                    id INTEGER PRIMARY KEY,
                    user_id INTEGER,
                    session_id TEXT UNIQUE NOT NULL,
                    responses TEXT,
                    created_at TIMESTAMP,
                    updated_at TIMESTAMP
                )
            ''')
        ]
        
        # 테이블 생성
        for table_name, create_sql in tables:
            sqlite_cursor.execute(create_sql)
            print(f'✅ {table_name} 테이블 생성')
        
        # 데이터 추출 및 삽입
        for table_name, _ in tables:
            try:
                # PostgreSQL에서 데이터 조회
                result = conn.execute(sqlalchemy.text(f'SELECT * FROM {table_name}'))
                rows = result.fetchall()
                columns = list(result.keys())
                
                if rows:
                    # 컬럼명과 데이터 분리
                    data_rows = []
                    for row in rows:
                        data_rows.append(list(row))
                    
                    # SQLite에 데이터 삽입
                    placeholders = ', '.join(['?' for _ in columns])
                    insert_sql = f'INSERT INTO {table_name} ({", ".join(columns)}) VALUES ({placeholders})'
                    
                    sqlite_cursor.executemany(insert_sql, data_rows)
                    print(f'✅ {table_name}: {len(rows)}개 레코드 변환')
                
            except Exception as e:
                print(f'❌ {table_name}: {e}')
        
        sqlite_conn.commit()
        sqlite_conn.close()
        
        print('🎉 SQLite 변환 완료!')
        print('📁 gwangju_tour.db 파일 생성됨')

if __name__ == '__main__':
    convert_to_sqlite()
