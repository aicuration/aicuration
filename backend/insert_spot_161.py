import sqlite3
from datetime import datetime

spot_data = {
    "id": 161,  # 161번으로 고정해서 넣고 싶으면 명시
    "name": "호남대학교",
    "theme_id": 8,  # 근교
    "description": "캠퍼스는 넓고 쾌적한 환경을 제공하며, 다양한 학문 분야를 위한 첨단 교육 및 연구 시설을 갖추고 있다. 캠퍼스 앞에는 선운지구가 위치해 있어 생활 편의 시설이 잘 갖춰져 있다.",
    "address": "광주광역시 광산구 호남대길 100",
    "latitude": 35.150648,   # 없으면 None
    "longitude": 126.768858, # 없으면 None
    "operating_hours": "09:00",
    "contact_info": "062-940-5005",
    "image_url": "honamuniv.jpg",  # 또는 전체 URL / 또는 None
}

conn = sqlite3.connect("gwangju_tour.db")
cur = conn.cursor()

now = datetime.now().isoformat(timespec="seconds")

cur.execute("""
    INSERT INTO spots (
        id,
        name,
        theme_id,
        description,
        address,
        latitude,
        longitude,
        operating_hours,
        contact_info,
        created_at,
        updated_at,
        image_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (
    spot_data["id"],
    spot_data["name"],
    spot_data["theme_id"],
    spot_data["description"],
    spot_data["address"],
    spot_data["latitude"],
    spot_data["longitude"],
    spot_data["operating_hours"],
    spot_data["contact_info"],
    now,
    now,
    spot_data["image_url"],
))

conn.commit()
conn.close()

print("✅ spot_id=161 추가 완료!")
