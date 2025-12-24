#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import shutil
import subprocess
import sys

def create_simple_exe():
    print('🚀 간단한 EXE 생성 방법 시작...')
    
    # 1. 필요한 파일들 복사
    print('📁 필요한 파일들 복사 중...')
    
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
    
    # 2. 실행 스크립트 생성
    print('📝 실행 스크립트 생성 중...')
    
    # Python 실행 스크립트
    python_script = f'''#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import webbrowser
import threading
import time
import subprocess
from http.server import HTTPServer, SimpleHTTPRequestHandler
import socketserver

class CustomHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory='frontend/build', **kwargs)

def start_backend():
    """백엔드 서버 시작"""
    try:
        import app
        app.app.run(host='127.0.0.1', port=5000, debug=False)
    except Exception as e:
        print(f"백엔드 시작 오류: {e}")

def start_frontend():
    """프론트엔드 서버 시작"""
    try:
        PORT = 3000
        with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
            print(f"프론트엔드 서버가 http://localhost:{PORT}에서 시작되었습니다.")
            httpd.serve_forever()
    except Exception as e:
        print(f"프론트엔드 시작 오류: {e}")

def main():
    print("🚀 광주관광 루트찾기 앱을 시작합니다...")
    
    # 백엔드 서버를 별도 스레드에서 시작
    backend_thread = threading.Thread(target=start_backend, daemon=True)
    backend_thread.start()
    
    # 백엔드가 시작될 때까지 대기
    time.sleep(3)
    
    # 프론트엔드 서버를 별도 스레드에서 시작
    frontend_thread = threading.Thread(target=start_frontend, daemon=True)
    frontend_thread.start()
    
    # 브라우저에서 앱 열기
    time.sleep(2)
    webbrowser.open('http://localhost:3000')
    
    print("✅ 앱이 성공적으로 시작되었습니다!")
    print("❌ 종료하려면 Ctrl+C를 누르세요.")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\\n👋 앱을 종료합니다.")

if __name__ == "__main__":
    main()
'''
    
    with open(f'{exe_folder}/run_app.py', 'w', encoding='utf-8') as f:
        f.write(python_script)
    
    # 3. 배치 파일 생성 (Windows용)
    batch_script = f'''@echo off
echo 🚀 광주관광 루트찾기 앱을 시작합니다...
echo.

REM Python이 설치되어 있는지 확인
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

REM 앱 실행
echo ✅ 앱을 시작합니다...
python run_app.py

pause
'''
    
    with open(f'{exe_folder}/start_app.bat', 'w', encoding='utf-8') as f:
        f.write(batch_script)
    
    # 4. README 파일 생성
    readme_content = '''# 광주관광 루트찾기 앱

## 실행 방법

### 방법 1: 배치 파일 실행 (권장)
1. `start_app.bat` 파일을 더블클릭합니다.
2. 자동으로 필요한 패키지가 설치되고 앱이 시작됩니다.

### 방법 2: Python 직접 실행
1. Python이 설치되어 있는지 확인합니다.
2. 필요한 패키지를 설치합니다:
   ```
   pip install flask sqlalchemy psycopg2-binary
   ```
3. `run_app.py` 파일을 실행합니다:
   ```
   python run_app.py
   ```

## 주의사항
- Python 3.7 이상이 필요합니다.
- 인터넷 연결이 필요합니다 (Google Maps API 사용).

## 문제 해결
- Python이 설치되어 있지 않다면 https://python.org 에서 다운로드하세요.
- 포트 3000, 5000이 사용 중이라면 다른 프로그램을 종료하고 다시 시도하세요.
'''
    
    with open(f'{exe_folder}/README.txt', 'w', encoding='utf-8') as f:
        f.write(readme_content)
    
    print(f'✅ 실행 파일 폴더가 생성되었습니다: {exe_folder}')
    print('📁 이 폴더를 다른 컴퓨터에 복사하여 사용할 수 있습니다.')
    
    return exe_folder

if __name__ == '__main__':
    create_simple_exe()




















