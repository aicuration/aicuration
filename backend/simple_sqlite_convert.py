#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sqlite3
from database import engine
import sqlalchemy

def simple_convert():
    print('🔄 간단한 SQLite 변환 시작...')
    
    # SQLite 데이터베이스 생성
    conn = sqlite3.connect('gwangju_tour.db')
    cursor = conn.cursor()
    
    # PostgreSQL에서 데이터 추출
    with engine.connect() as pg_conn:
        print('📊 PostgreSQL에서 데이터 추출 중...')
        
        # 1. themes 테이블
        print('✅ themes 테이블 변환 중...')
        cursor.execute('''
            CREATE TABLE themes (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                icon_name TEXT,
                color_code TEXT
            )
        ''')
        
        themes_result = pg_conn.execute(sqlalchemy.text('SELECT * FROM themes'))
        for row in themes_result:
            cursor.execute('''
                INSERT INTO themes (id, name, description, icon_name, color_code)
                VALUES (?, ?, ?, ?, ?)
            ''', (row.id, row.name, row.description, row.icon_name, row.color_code))
        
        # 2. spots 테이블
        print('✅ spots 테이블 변환 중...')
        cursor.execute('''
            CREATE TABLE spots (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                theme_id INTEGER,
                description TEXT,
                address TEXT,
                latitude REAL,
                longitude REAL,
                operating_hours TEXT,
                contact_info TEXT,
                created_at TEXT,
                updated_at TEXT,
                image_url TEXT,
                FOREIGN KEY (theme_id) REFERENCES themes (id)
            )
        ''')
        
        spots_result = pg_conn.execute(sqlalchemy.text('SELECT * FROM spots'))
        for row in spots_result:
            cursor.execute('''
                INSERT INTO spots (id, name, theme_id, description, address, latitude, longitude, 
                                 operating_hours, contact_info, created_at, updated_at, image_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (row.id, row.name, row.theme_id, row.description, row.address, 
                  float(row.latitude) if row.latitude else None,
                  float(row.longitude) if row.longitude else None,
                  row.operating_hours, row.contact_info, 
                  str(row.created_at) if row.created_at else None,
                  str(row.updated_at) if row.updated_at else None,
                  row.image_url))
        
        # 3. users 테이블
        print('✅ users 테이블 변환 중...')
        cursor.execute('''
            CREATE TABLE users (
                id INTEGER PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                created_at TEXT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL
            )
        ''')
        
        users_result = pg_conn.execute(sqlalchemy.text('SELECT * FROM users'))
        for row in users_result:
            cursor.execute('''
                INSERT INTO users (id, username, created_at, email, password_hash)
                VALUES (?, ?, ?, ?, ?)
            ''', (row.id, row.username, str(row.created_at) if row.created_at else None, 
                  row.email, row.password_hash))
        
        # 4. user_routes 테이블
        print('✅ user_routes 테이블 변환 중...')
        cursor.execute('''
            CREATE TABLE user_routes (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                estimated_time TEXT,
                total_distance REAL,
                created_at TEXT,
                updated_at TEXT,
                user_id INTEGER,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        routes_result = pg_conn.execute(sqlalchemy.text('SELECT * FROM user_routes'))
        for row in routes_result:
            cursor.execute('''
                INSERT INTO user_routes (id, name, description, estimated_time, total_distance, 
                                       created_at, updated_at, user_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (row.id, row.name, row.description, row.estimated_time,
                  float(row.total_distance) if row.total_distance else None,
                  str(row.created_at) if row.created_at else None,
                  str(row.updated_at) if row.updated_at else None,
                  row.user_id))
        
        # 5. route_spots 테이블
        print('✅ route_spots 테이블 변환 중...')
        cursor.execute('''
            CREATE TABLE route_spots (
                id INTEGER PRIMARY KEY,
                route_id INTEGER,
                spot_id INTEGER,
                spot_order INTEGER,
                created_at TEXT,
                FOREIGN KEY (route_id) REFERENCES user_routes (id),
                FOREIGN KEY (spot_id) REFERENCES spots (id)
            )
        ''')
        
        route_spots_result = pg_conn.execute(sqlalchemy.text('SELECT * FROM route_spots'))
        for row in route_spots_result:
            cursor.execute('''
                INSERT INTO route_spots (id, route_id, spot_id, spot_order, created_at)
                VALUES (?, ?, ?, ?, ?)
            ''', (row.id, row.route_id, row.spot_id, row.spot_order,
                  str(row.created_at) if row.created_at else None))
        
        # 6. survey_responses 테이블
        print('✅ survey_responses 테이블 변환 중...')
        cursor.execute('''
            CREATE TABLE survey_responses (
                id INTEGER PRIMARY KEY,
                user_id INTEGER,
                session_id TEXT UNIQUE NOT NULL,
                responses TEXT,
                created_at TEXT,
                updated_at TEXT
            )
        ''')
        
        survey_result = pg_conn.execute(sqlalchemy.text('SELECT * FROM survey_responses'))
        for row in survey_result:
            cursor.execute('''
                INSERT INTO survey_responses (id, user_id, session_id, responses, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (row.id, row.user_id, row.session_id, str(row.responses) if row.responses else None,
                  str(row.created_at) if row.created_at else None,
                  str(row.updated_at) if row.updated_at else None))
        
        conn.commit()
        conn.close()
        
        print('🎉 SQLite 변환 완료!')
        print('📁 gwangju_tour.db 파일 생성됨')

if __name__ == '__main__':
    simple_convert()




















