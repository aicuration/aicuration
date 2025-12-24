import qrcode
from PIL import Image
import webbrowser
import os

# 로컬 IP 주소
ip_address = "172.30.1.14"
frontend_port = "3000"

# PWA URL
pwa_url = f"http://{ip_address}:{frontend_port}"

# QR 코드 생성
print("🎉 광주 관광 PWA 앱 QR 코드 생성")
print(f"📱 PWA URL: {pwa_url}")
print("\n📋 사용 방법:")
print("1. 핸드폰으로 QR 코드를 스캔하세요")
print("2. 브라우저에서 앱이 열립니다")
print("3. 브라우저 메뉴에서 '홈 화면에 추가' 또는 '앱 설치' 선택")
print("4. 앱 아이콘이 홈 화면에 추가됩니다!")
print("5. 이제 네이티브 앱처럼 사용할 수 있습니다!")

# QR 코드 생성
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)

qr.add_data(pwa_url)
qr.make(fit=True)

# QR 코드 이미지 생성
img = qr.make_image(fill_color="black", back_color="white")

# 이미지 저장
img.save("gwangju_pwa_qr.png")
print(f"\n✅ QR 코드가 'gwangju_pwa_qr.png' 파일로 저장되었습니다!")

# 이미지 열기
try:
    img.show()
    print("🖼️ QR 코드 이미지가 열렸습니다.")
except:
    print("⚠️ 이미지 뷰어를 열 수 없습니다. 저장된 파일을 확인해주세요.")

print(f"\n🔗 직접 접속: {pwa_url}")
print("\n📱 PWA 특징:")
print("• 오프라인에서도 작동")
print("• 앱처럼 전체화면 실행")
print("• 홈 화면에 아이콘 추가")
print("• 푸시 알림 지원")
print("• 빠른 로딩 속도")





