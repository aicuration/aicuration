#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import webbrowser
import threading
import time
import subprocess
from http.server import HTTPServer, SimpleHTTPRequestHandler
import socketserver

# 현재 디렉토리를 sys.path에 추가
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

class CustomHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory='frontend/build', **kwargs)

def start_backend():
    """백엔드 서버 시작"""
    try:
        # backend 폴더로 이동
        os.chdir('backend')
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
        print("\n👋 앱을 종료합니다.")

if __name__ == "__main__":
    main()




















