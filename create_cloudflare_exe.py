import os
import sys

# Cloudflare Tunnel URL
CLOUDFLARE_URL = "https://rewards-navigation-ipod-valley.trycloudflare.com"

# Open app script
open_app_script = f'''import webbrowser
import sys
import time

# Cloudflare Tunnel URL
CLOUDFLARE_URL = "{CLOUDFLARE_URL}"

def open_app():
    try:
        print("=" * 70)
        print("광주관광 앱 열기")
        print("=" * 70)
        print(f"접속 URL: {{CLOUDFLARE_URL}}")
        print("=" * 70)
        print("\\n브라우저를 열고 있습니다...")
        
        # 브라우저에서 URL 열기
        webbrowser.open(CLOUDFLARE_URL)
        
        print("✅ 브라우저가 열렸습니다!")
        print("\\n⚠️ 주의:")
        print("- 서버 PC에서 Cloudflare Tunnel이 실행 중이어야 합니다")
        
        # EXE 환경에서는 input() 대신 대기
        if sys.stdin.isatty():
            input("\\n아무 키나 누르면 종료됩니다...")
        else:
            time.sleep(3)
        
    except Exception as e:
        print(f"❌ 오류 발생: {{e}}")
        # EXE 환경에서는 input() 대신 대기
        if sys.stdin.isatty():
            input("\\n아무 키나 누르면 종료됩니다...")
        else:
            time.sleep(3)

if __name__ == "__main__":
    open_app()
'''

# Create the script file
script_filename = "open_cloudflare_tunnel.py"
with open(script_filename, 'w', encoding='utf-8') as f:
    f.write(open_app_script)

print(f"✅ 스크립트 생성 완료: {script_filename}")
print(f"\n다음 명령어로 EXE 파일을 생성하세요:")
print(f"pyinstaller --onefile --windowed --name='광주관광앱' {script_filename}")
print(f"\n또는 자동으로 생성하려면 'python create_cloudflare_exe.py --build' 를 실행하세요.")

if '--build' in sys.argv:
    print("\n🔨 EXE 파일을 생성합니다...")
    os.system(f'pyinstaller --onefile --windowed --name="광주관광앱" {script_filename}')
    print("\n✅ EXE 파일 생성 완료!")
    print(f"생성된 파일: dist/광주관광앱.exe")
    print(f"\n⚠️ 서버 PC에서 Cloudflare Tunnel을 먼저 실행해야 합니다:")
    print(f"  cloudflared.exe tunnel --url http://localhost:5000")

