#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import shutil

def create_simple_exe():
    print('🚀 간단한 EXE 생성 방법 시작...')
    
    # 실행 폴더 생성
    exe_folder = 'GwangjuTourApp_Executable'
    if os.path.exists(exe_folder):
        shutil.rmtree(exe_folder)
    os.makedirs(exe_folder)
    
    # 프론트엔드 빌드 파일들 복사
    if os.path.exists('frontend/build'):
        shutil.copytree('frontend/build', f'{exe_folder}/frontend/build')
        print('✅ 프론트엔드 빌드 파일 복사 완료')
    
    # 백엔드 파일들 복사
    backend_files = ['app.py', 'database.py', 'models.py', 'gwangju_tour.db']
    for file in backend_files:
        if os.path.exists(f'backend/{file}'):
            shutil.copy2(f'backend/{file}', f'{exe_folder}/{file}')
            print(f'✅ {file} 복사 완료')
    
    # 배치 파일 생성
    batch_content = '''@echo off
echo 🚀 광주관광 루트찾기 앱을 시작합니다...
echo.

REM Python 확인
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python이 설치되어 있지 않습니다.
    echo Python을 설치한 후 다시 시도해주세요.
    pause
    exit /b 1
)

REM 필요한 패키지 설치
echo 📦 필요한 패키지를 설치합니다...
pip install flask sqlalchemy psycopg2-binary >nul 2>&1

REM 백엔드 서버 시작
echo 🚀 백엔드 서버를 시작합니다...
start /b python app.py

REM 잠시 대기
timeout /t 3 /nobreak >nul

REM 브라우저에서 앱 열기
echo 🌐 브라우저에서 앱을 엽니다...
start http://localhost:5000

echo ✅ 앱이 성공적으로 시작되었습니다!
echo ❌ 종료하려면 이 창을 닫으세요.
pause
'''
    
    with open(f'{exe_folder}/start_app.bat', 'w', encoding='utf-8') as f:
        f.write(batch_content)
    
    # README 파일 생성
    readme_content = '''# 광주관광 루트찾기 앱

## 실행 방법

1. `start_app.bat` 파일을 더블클릭합니다.
2. 자동으로 필요한 패키지가 설치되고 앱이 시작됩니다.

## 주의사항
- Python 3.7 이상이 필요합니다.
- 인터넷 연결이 필요합니다 (Google Maps API 사용).

## 문제 해결
- Python이 설치되어 있지 않다면 https://python.org 에서 다운로드하세요.
- 포트 5000이 사용 중이라면 다른 프로그램을 종료하고 다시 시도하세요.
'''
    
    with open(f'{exe_folder}/README.txt', 'w', encoding='utf-8') as f:
        f.write(readme_content)
    
    print(f'✅ 실행 파일 폴더가 생성되었습니다: {exe_folder}')
    print('📁 이 폴더를 다른 컴퓨터에 복사하여 사용할 수 있습니다.')
    
    return exe_folder

if __name__ == '__main__':
    create_simple_exe()




















