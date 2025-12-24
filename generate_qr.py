import qrcode
from PIL import Image
import webbrowser
import os

# 로컬 IP 주소
ip_address = "172.30.1.14"
frontend_port = "3000"
backend_port = "8000"

# 프론트엔드 URL
frontend_url = f"http://{ip_address}:{frontend_port}"

# QR 코드 생성
print(f"프론트엔드 URL: {frontend_url}")
print(f"백엔드 URL: http://{ip_address}:{backend_port}")

# QR 코드 생성
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)

qr.add_data(frontend_url)
qr.make(fit=True)

# QR 코드 이미지 생성
img = qr.make_image(fill_color="black", back_color="white")

# 이미지 저장
img.save("gwangju_tour_qr.png")
print("\nQR 코드가 'gwangju_tour_qr.png' 파일로 저장되었습니다!")

# 이미지 열기
try:
    img.show()
    print("QR 코드 이미지가 열렸습니다.")
except:
    print("이미지 뷰어를 열 수 없습니다. 저장된 파일을 확인해주세요.")

print(f"\n핸드폰에서 접속하려면:")
print(f"1. QR 코드를 스캔하거나")
print(f"2. 브라우저에서 {frontend_url} 직접 입력")
print(f"\n백엔드 서버도 {backend_port} 포트에서 실행 중이어야 합니다.")


