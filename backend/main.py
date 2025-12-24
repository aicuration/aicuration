# -*- coding: utf-8 -*-
from fastapi import FastAPI, Depends, HTTPException, Request, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import engine, get_db
import models
from pydantic import BaseModel  # [추가] 스탬프 체크인 요청용
import math                     # [추가] 거리 계산용
import sqlalchemy
import bcrypt
from typing import Dict
import logging
import traceback
import os
from google.auth.transport import requests
from google.oauth2 import id_token
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

# 데이터베이스 테이블 생성
models.Base.metadata.create_all(bind=engine)

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# FastAPI 앱 생성
app = FastAPI(title='광주 관광 앱 API', version='1.0.0')

# CORS 설정
app.add_middleware(CORSMiddleware, 
    allow_origins=[
        'http://localhost:3000', 
        'http://localhost:5000',  # Flask 서버 (프로덕션)
        'http://172.30.1.14:3000'
    ],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

# 전역 에러 핸들러
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error: {exc}")
    logger.error(f"Traceback: {traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
            "detail": str(exc) if app.debug else "Internal server error"
        }
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.warning(f"HTTP error {exc.status_code}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )

# 간단한 세션 저장소 (실제 운영에서는 Redis 등 사용)
user_sessions: Dict[str, int] = {}

@app.get('/')
async def root():
    return {'message': '광주 관광 앱 API'}

@app.get('/health')
async def health_check():
    return {'status': 'healthy'}

# ======================== 스탬프 투어 설정 ========================

# ⚠️ 나중에 여기 STAMP_SPOTS 안의 좌표를 전부 직접 채우면 됨
STAMP_SPOTS = [
  { "id": 1, "name": "충금지하상가", "description": "쇼핑·상권 테마",  "latitude": 35.149414, "longitude": 126.916811, "radius_m": 70 },
  { "id": 2, "name": "신세계백화점 광주신세계점", "description": "쇼핑·상권 테마",  "latitude": 35.160907, "longitude": 126.882744, "radius_m": 70 },
  { "id": 3, "name": "롯데백화점 광주점", "description": "쇼핑·상권 테마",  "latitude": 35.154686, "longitude": 126.912193, "radius_m": 70 },
  { "id": 4, "name": "광주세정아울렛", "description": "쇼핑·상권 테마",  "latitude": 35.146336, "longitude": 126.846764, "radius_m": 70 },
  { "id": 5, "name": "광주 양동시장", "description": "쇼핑·상권 테마",  "latitude": 35.154098, "longitude": 126.902199, "radius_m": 70 },
  { "id": 6, "name": "NC백화점 광주역점", "description": "쇼핑·상권 테마",  "latitude": 35.161698, "longitude": 126.907298, "radius_m": 70 },
  { "id": 7, "name": "상무화훼단지", "description": "쇼핑·상권 테마",  "latitude": 35.143988, "longitude": 126.844867, "radius_m": 70 },
  { "id": 8, "name": "서부농수산물도매시장", "description": "쇼핑·상권 테마",  "latitude": 35.116690, "longitude": 126.856967, "radius_m": 70 },
  { "id": 9, "name": "광주각화농산물도매시장", "description": "쇼핑·상권 테마",  "latitude": 35.184575, "longitude": 126.935216, "radius_m": 70 },
  { "id": 10, "name": "시리단길", "description": "쇼핑·상권 테마",  "latitude": 35.216677, "longitude": 126.849100, "radius_m": 70 },
  { "id": 11, "name": "비아5일시장", "description": "쇼핑·상권 테마",  "latitude": 35.221437, "longitude": 126.825077, "radius_m": 70 },
  { "id": 12, "name": "남광주시장", "description": "쇼핑·상권 테마",  "latitude": 35.139034, "longitude": 126.921395, "radius_m": 70 },
  { "id": 13, "name": "롯데아울렛 광주월드컵점", "description": "쇼핑·상권 테마",  "latitude": 35.132977, "longitude": 126.876418, "radius_m": 70 },
  { "id": 14, "name": "NC웨이브 충장점", "description": "쇼핑·상권 테마",  "latitude": 35.148833, "longitude": 126.913279, "radius_m": 70 },
  { "id": 15, "name": "월곡시장", "description": "쇼핑·상권 테마",  "latitude": 35.171492, "longitude": 126.809752, "radius_m": 70 },
  { "id": 16, "name": "운암시장", "description": "쇼핑·상권 테마",  "latitude": 35.173175, "longitude": 126.882497, "radius_m": 70 },
  { "id": 17, "name": "예술의거리 개미장터", "description": "쇼핑·상권 테마",  "latitude": 35.150053, "longitude": 126.918623, "radius_m": 70 },
  { "id": 18, "name": "롯데아울렛 광주수완점", "description": "쇼핑·상권 테마",  "latitude": 35.190768, "longitude": 126.819696, "radius_m": 70 },
  { "id": 19, "name": "무안요", "description": "쇼핑·상권 테마",  "latitude": 35.150124, "longitude": 126.917665, "radius_m": 70 },
  { "id": 20, "name": "인당국악사", "description": "쇼핑·상권 테마",  "latitude": 35.145439, "longitude": 126.921627, "radius_m": 70 },

  { "id": 21, "name": "5.18기념공원", "description": "역사·인문 테마",  "latitude": 35.155932, "longitude": 126.857309, "radius_m": 70 },
  { "id": 22, "name": "양림동 역사문화마을", "description": "역사·인문 테마",  "latitude": 35.140476, "longitude": 126.915619, "radius_m": 70 },
  { "id": 23, "name": "광주향교", "description": "역사·인문 테마",  "latitude": 35.145827, "longitude": 126.909293, "radius_m": 70 },
  { "id": 24, "name": "광주문화재단 전통문화관", "description": "역사·인문 테마",  "latitude": 35.133666, "longitude": 126.951975, "radius_m": 70 },
  { "id": 25, "name": "광주역사민속박물관", "description": "역사·인문 테마",  "latitude": 35.183952, "longitude": 126.888359, "radius_m": 70 },
  { "id": 26, "name": "5.18 민주화운동기록관", "description": "역사·인문 테마",  "latitude": 35.149826, "longitude": 126.916049, "radius_m": 70 },
  { "id": 27, "name": "무각사", "description": "역사·인문 테마",  "latitude": 35.153214, "longitude": 126.856422, "radius_m": 70 },
  { "id": 28, "name": "오방 최흥종 기념관", "description": "역사·인문 테마",  "latitude": 35.140414, "longitude": 126.913300, "radius_m": 70 },
  { "id": 29, "name": "월봉서원", "description": "역사·인문 테마",  "latitude": 35.235977, "longitude": 126.745161, "radius_m": 70 },
  { "id": 30, "name": "국립5.18민주묘지", "description": "역사·인문 테마",  "latitude": 35.235501, "longitude": 126.940151, "radius_m": 70 },
  { "id": 31, "name": "증심사", "description": "역사·인문 테마",  "latitude": 35.128881, "longitude": 126.969898, "radius_m": 70 },
  { "id": 32, "name": "월곡고려인문화관 결", "description": "역사·인문 테마",  "latitude": 35.172052, "longitude": 126.807700, "radius_m": 70 },
  { "id": 33, "name": "5.18민주광장", "description": "역사·인문 테마",  "latitude": 35.147634, "longitude": 126.919391, "radius_m": 70 },
  { "id": 34, "name": "양림동 선교사 묘지", "description": "역사·인문 테마",  "latitude": 35.139652, "longitude": 126.911337, "radius_m": 70 },
  { "id": 35, "name": "국립광주박물관", "description": "역사·인문 테마",  "latitude": 35.188842, "longitude": 126.883564, "radius_m": 70 },
  { "id": 36, "name": "오웬기념각", "description": "역사·인문 테마",  "latitude": 35.138474, "longitude": 126.915976, "radius_m": 70 },
  { "id": 37, "name": "유애서원", "description": "역사·인문 테마",  "latitude": 35.184535, "longitude": 126.805643, "radius_m": 70 },
  { "id": 38, "name": "월계동 장고분", "description": "역사·인문 테마",  "latitude": 35.214158, "longitude": 126.842097, "radius_m": 70 },
  { "id": 39, "name": "양송천 묘역", "description": "역사·인문 테마",  "latitude": 35.211027, "longitude": 126.728283, "radius_m": 70 },
  { "id": 40, "name": "전남대학교 박물관", "description": "역사·인문 테마",  "latitude": 35.175610, "longitude": 126.911270, "radius_m": 70 },

  { "id": 41, "name": "광주 디자인 비엔날레", "description": "문화·예술 테마",  "latitude": 35.182587, "longitude": 126.889081, "radius_m": 70 },
  { "id": 42, "name": "광주 예술의전당", "description": "문화·예술 테마",  "latitude": 35.178319, "longitude": 126.881464, "radius_m": 70 },
  { "id": 43, "name": "광주시립미술관", "description": "문화·예술 테마",  "latitude": 35.183405, "longitude": 126.885661, "radius_m": 70 },
  { "id": 44, "name": "광주 예술의거리", "description": "문화·예술 테마",  "latitude": 35.150088, "longitude": 126.918698, "radius_m": 70 },
  { "id": 45, "name": "국립아시아문화전당", "description": "문화·예술 테마",  "latitude": 35.146868, "longitude": 126.920329, "radius_m": 70 },
  { "id": 46, "name": "펭귄마을", "description": "문화·예술 테마",  "latitude": 35.140720, "longitude": 126.917460, "radius_m": 70 },
  { "id": 47, "name": "남도향토음식박물관", "description": "문화·예술 테마",  "latitude": 35.201983, "longitude": 126.898800, "radius_m": 70 },
  { "id": 48, "name": "광주학생독립운동기념회관", "description": "문화·예술 테마",  "latitude": 35.141905, "longitude": 126.866049, "radius_m": 70 },
  { "id": 49, "name": "이이남스튜디오", "description": "문화·예술 테마",  "latitude": 35.139323, "longitude": 126.912839, "radius_m": 70 },
  { "id": 50, "name": "광주극장", "description": "문화·예술 테마",  "latitude": 35.149955, "longitude": 126.912536, "radius_m": 70 },
  { "id": 51, "name": "KPOP 스타의 거리", "description": "문화·예술 테마",  "latitude": 35.147474, "longitude": 126.917030, "radius_m": 70 },
  { "id": 52, "name": "국립광주과학관", "description": "문화·예술 테마",  "latitude": 35.229824, "longitude": 126.850139, "radius_m": 70 },
  { "id": 53, "name": "의재미술관", "description": "문화·예술 테마",  "latitude": 35.129372, "longitude": 126.967446, "radius_m": 70 },
  { "id": 54, "name": "기분좋은극장", "description": "문화·예술 테마",  "latitude": 35.155010, "longitude": 126.848915, "radius_m": 70 },
  { "id": 55, "name": "김대중컨벤션센터", "description": "문화·예술 테마",  "latitude": 35.146959, "longitude": 126.840466, "radius_m": 70 },
  { "id": 56, "name": "무등갤러리", "description": "문화·예술 테마",  "latitude": 35.150270, "longitude": 126.918302, "radius_m": 70 },
  { "id": 57, "name": "광주광역시미디어아트플랫폼 GMAP", "description": "문화·예술 테마",  "latitude": 35.148560, "longitude": 126.909418, "radius_m": 70 },
  { "id": 58, "name": "동곡미술관", "description": "문화·예술 테마",  "latitude": 35.154173, "longitude": 126.778117, "radius_m": 70 },
  { "id": 59, "name": "비움박물관", "description": "문화·예술 테마",  "latitude": 35.150701, "longitude": 126.920202, "radius_m": 70 },
  { "id": 60, "name": "소촌아트팩토리", "description": "문화·예술 테마",  "latitude": 35.152503, "longitude": 126.791119, "radius_m": 70 },

  { "id": 61, "name": "송정 떡갈비거리", "description": "음식·미식 테마",  "latitude": 35.139724, "longitude": 126.794553, "radius_m": 70 },
  { "id": 62, "name": "1913 송정역시장", "description": "음식·미식 테마",  "latitude": 35.137275, "longitude": 126.792261, "radius_m": 70 },
  { "id": 63, "name": "동명동 카페골목", "description": "음식·미식 테마",  "latitude": 35.149502, "longitude": 126.924105, "radius_m": 70 },
  { "id": 64, "name": "대인시장", "description": "음식·미식 테마",  "latitude": 35.153372, "longitude": 126.917992, "radius_m": 70 },
  { "id": 65, "name": "시청 먹자골목", "description": "음식·미식 테마",  "latitude": 35.153055, "longitude": 126.851973, "radius_m": 70 },
  { "id": 66, "name": "말바우시장", "description": "음식·미식 테마",  "latitude": 35.172662, "longitude": 126.921103, "radius_m": 70 },
  { "id": 67, "name": "광주 오리요리거리", "description": "음식·미식 테마",  "latitude": 35.161790, "longitude": 126.905208, "radius_m": 70 },
  { "id": 68, "name": "광주공원 포차거리", "description": "음식·미식 테마",  "latitude": 35.147772, "longitude": 126.909973, "radius_m": 70 },
  { "id": 69, "name": "서플라이", "description": "음식·미식 테마",  "latitude": 35.152461, "longitude": 126.837311, "radius_m": 70 },
  { "id": 70, "name": "송원식육식당", "description": "음식·미식 테마",  "latitude": 35.124227, "longitude": 126.760996, "radius_m": 70 },
  { "id": 71, "name": "칠봉이짬뽕", "description": "음식·미식 테마",  "latitude": 35.185141, "longitude": 126.833959, "radius_m": 70 },
  { "id": 72, "name": "장가계", "description": "음식·미식 테마",  "latitude": 35.140351, "longitude": 126.857695, "radius_m": 70 },
  { "id": 73, "name": "미미원", "description": "음식·미식 테마",  "latitude": 35.147220, "longitude": 126.926638, "radius_m": 70 },
  { "id": 74, "name": "상무초밥 상무본점", "description": "음식·미식 테마",  "latitude": 35.155167, "longitude": 126.854485, "radius_m": 70 },
  { "id": 75, "name": "청수민물장어", "description": "음식·미식 테마",  "latitude": 35.143491, "longitude": 126.835320, "radius_m": 70 },
  { "id": 76, "name": "농성화로본점", "description": "음식·미식 테마",  "latitude": 35.151201, "longitude": 126.882243, "radius_m": 70 },
  { "id": 77, "name": "그런느낌", "description": "음식·미식 테마",  "latitude": 35.184987, "longitude": 126.826864, "radius_m": 70 },
  { "id": 78, "name": "보향미", "description": "음식·미식 테마",  "latitude": 35.216741, "longitude": 126.844539, "radius_m": 70 },
  { "id": 79, "name": "하남꽃게장백반", "description": "음식·미식 테마",  "latitude": 35.173128, "longitude": 126.805683, "radius_m": 70 },
  { "id": 80, "name": "갤러리24", "description": "음식·미식 테마",  "latitude": 35.166746, "longitude": 126.884890, "radius_m": 70 },

  { "id": 81, "name": "무등산", "description": "자연·공원 테마",  "latitude": 35.134114, "longitude": 126.955865, "radius_m": 70 },
  { "id": 82, "name": "광주천", "description": "자연·공원 테마",  "latitude": 35.162837, "longitude": 126.887309, "radius_m": 70 },
  { "id": 83, "name": "중외공원", "description": "자연·공원 테마",  "latitude": 35.180609, "longitude": 126.882608, "radius_m": 70 },
  { "id": 84, "name": "광주광역시 우치공원", "description": "자연·공원 테마",  "latitude": 35.223242, "longitude": 126.889328, "radius_m": 70 },
  { "id": 85, "name": "광주호 호수생태원", "description": "자연·공원 테마",  "latitude": 35.184579, "longitude": 127.001233, "radius_m": 70 },
  { "id": 86, "name": "광주사직공원 전망타워", "description": "자연·공원 테마",  "latitude": 35.142029, "longitude": 126.911797, "radius_m": 70 },
  { "id": 87, "name": "전평제근린공원", "description": "자연·공원 테마",  "latitude": 35.115435, "longitude": 126.848493, "radius_m": 70 },
  { "id": 88, "name": "운천저수지", "description": "자연·공원 테마",  "latitude": 35.148163, "longitude": 126.855450, "radius_m": 70 },
  { "id": 89, "name": "쌍암공원", "description": "자연·공원 테마",  "latitude": 35.223877, "longitude": 126.844641, "radius_m": 70 },
  { "id": 90, "name": "조선대학교 장미원", "description": "자연·공원 테마",  "latitude": 35.141284, "longitude": 126.929707, "radius_m": 70 },
  { "id": 91, "name": "광주시립수목원", "description": "자연·공원 테마",  "latitude": 35.090206, "longitude": 126.882676, "radius_m": 70 },
  { "id": 92, "name": "지산유원지", "description": "자연·공원 테마",  "latitude": 35.149296, "longitude": 126.948999, "radius_m": 70 },
  { "id": 93, "name": "광주시민의숲", "description": "자연·공원 테마",  "latitude": 35.234630, "longitude": 126.867446, "radius_m": 70 },
  { "id": 94, "name": "빛고을농촌테마공원", "description": "자연·공원 테마",  "latitude": 35.083573, "longitude": 126.865632, "radius_m": 70 },
  { "id": 95, "name": "풍암호수", "description": "자연·공원 테마",  "latitude": 35.127843, "longitude": 126.870195, "radius_m": 70 },
  { "id": 96, "name": "환벽당", "description": "자연·공원 테마",  "latitude": 35.185751, "longitude": 127.002960, "radius_m": 70 },
  { "id": 97, "name": "상무시민공원", "description": "자연·공원 테마",  "latitude": 35.153677, "longitude": 126.840730, "radius_m": 70 },
  { "id": 98, "name": "광주공원", "description": "자연·공원 테마",  "latitude": 35.147043, "longitude": 126.909026, "radius_m": 70 },
  { "id": 99, "name": "서석대", "description": "자연·공원 테마",  "latitude": 35.121419, "longitude": 127.002888, "radius_m": 70 },
  { "id": 100, "name": "무등산국립공원", "description": "자연·공원 테마",  "latitude": 35.144342, "longitude": 126.989080, "radius_m": 70 },

  { "id": 101, "name": "광주기아챔피언스필드", "description": "체험·액티비티 테마",  "latitude": 35.168300, "longitude": 126.889170, "radius_m": 70 },
  { "id": 102, "name": "헬로애니멀광주점", "description": "체험·액티비티 테마",  "latitude": 35.148712, "longitude": 126.915195, "radius_m": 70 },
  { "id": 103, "name": "광주월드컵경기장", "description": "체험·액티비티 테마",  "latitude": 35.133907, "longitude": 126.874897, "radius_m": 70 },
  { "id": 104, "name": "광주국제양궁장", "description": "체험·액티비티 테마",  "latitude": 35.132423, "longitude": 126.890634, "radius_m": 70 },
  { "id": 105, "name": "아쿠아시티광주", "description": "체험·액티비티 테마",  "latitude": 35.187322, "longitude": 126.889681, "radius_m": 70 },
  { "id": 106, "name": "광주김치타운", "description": "체험·액티비티 테마",  "latitude": 35.109485, "longitude": 126.865571, "radius_m": 70 },
  { "id": 107, "name": "광주실내빙상장", "description": "체험·액티비티 테마",  "latitude": 35.134212, "longitude": 126.880327, "radius_m": 70 },
  { "id": 108, "name": "평촌도예공방", "description": "체험·액티비티 테마",  "latitude": 35.179579, "longitude": 127.008184, "radius_m": 70 },
  { "id": 109, "name": "무등산수박마을", "description": "체험·액티비티 테마",  "latitude": 35.172344, "longitude": 126.997226, "radius_m": 70 },
  { "id": 110, "name": "법무부 광주솔로몬로파크", "description": "체험·액티비티 테마",  "latitude": 35.189418, "longitude": 126.930932, "radius_m": 70 },
  { "id": 111, "name": "여행자의 집", "description": "체험·액티비티 테마",  "latitude": 35.150065, "longitude": 126.925235, "radius_m": 70 },
  { "id": 112, "name": "마한유적체험관", "description": "체험·액티비티 테마",  "latitude": 35.192890, "longitude": 126.851638, "radius_m": 70 },
  { "id": 113, "name": "송산목장", "description": "체험·액티비티 테마",  "latitude": 35.182633, "longitude": 126.790891, "radius_m": 70 },
  { "id": 114, "name": "빛고을공예창작촌", "description": "체험·액티비티 테마",  "latitude": 35.085786, "longitude": 126.866076, "radius_m": 70 },
  { "id": 115, "name": "충장로", "description": "체험·액티비티 테마",  "latitude": 35.149964, "longitude": 126.913967, "radius_m": 70 },
  { "id": 116, "name": "청춘발산마을", "description": "체험·액티비티 테마",  "latitude": 35.160149, "longitude": 126.891912, "radius_m": 70 },
  { "id": 117, "name": "꿈브루어리", "description": "체험·액티비티 테마",  "latitude": 35.153206, "longitude": 126.922574, "radius_m": 70 },
  { "id": 118, "name": "광주패밀리랜드", "description": "체험·액티비티 테마",  "latitude": 35.223889, "longitude": 126.891430, "radius_m": 70 },
  { "id": 119, "name": "테라피 스파 소베", "description": "체험·액티비티 테마",  "latitude": 35.147533, "longitude": 126.838153, "radius_m": 70 },
  { "id": 120, "name": "관덕정의 각궁", "description": "체험·액티비티 테마",  "latitude": 35.141098, "longitude": 126.912656, "radius_m": 70 },

  { "id": 121, "name": "광주 아우라 비즈니스 호텔", "description": "숙박 테마",  "latitude": 35.138489, "longitude": 126.792898, "radius_m": 70 },
  { "id": 122, "name": "탑클라우드호텔 광주점", "description": "숙박 테마",  "latitude": 35.220666, "longitude": 126.848241, "radius_m": 70 },
  { "id": 123, "name": "한성 마드리드 광주호텔", "description": "숙박 테마",  "latitude": 35.138875, "longitude": 126.793609, "radius_m": 70 },
  { "id": 124, "name": "무등파크호텔", "description": "숙박 테마",  "latitude": 35.149189, "longitude": 126.946859, "radius_m": 70 },
  { "id": 125, "name": "노블 스테이", "description": "숙박 테마",  "latitude": 35.216901, "longitude": 126.849264, "radius_m": 70 },
  { "id": 126, "name": "여로", "description": "숙박 테마",  "latitude": 35.150462, "longitude": 126.918761, "radius_m": 70 },
  { "id": 127, "name": "홀리데이 인 광주 호텔", "description": "숙박 테마",  "latitude": 35.147952, "longitude": 126.838069, "radius_m": 70 },
  { "id": 128, "name": "마스터스관광호텔", "description": "숙박 테마",  "latitude": 35.152532, "longitude": 126.850618, "radius_m": 70 },
  { "id": 129, "name": "아리네 게스트하우스", "description": "숙박 테마",  "latitude": 35.141822, "longitude": 126.915960, "radius_m": 70 },
  { "id": 130, "name": "라마다프라자 광주호텔", "description": "숙박 테마",  "latitude": 35.152173, "longitude": 126.850726, "radius_m": 70 },
  { "id": 131, "name": "센트럴관광호텔", "description": "숙박 테마",  "latitude": 35.154422, "longitude": 126.850444, "radius_m": 70 },
  { "id": 132, "name": "두바이호텔", "description": "숙박 테마",  "latitude": 35.154199, "longitude": 126.852899, "radius_m": 70 },
  { "id": 133, "name": "다솜채", "description": "숙박 테마",  "latitude": 35.138979, "longitude": 126.797517, "radius_m": 70 },
  { "id": 134, "name": "호텔더스팟", "description": "숙박 테마",  "latitude": 35.220875, "longitude": 126.853310, "radius_m": 70 },
  { "id": 135, "name": "호텔 5월", "description": "숙박 테마",  "latitude": 35.187190, "longitude": 126.837703, "radius_m": 70 },
  { "id": 136, "name": "금수장관광호텔", "description": "숙박 테마",  "latitude": 35.162161, "longitude": 126.918388, "radius_m": 70 },
  { "id": 137, "name": "유탑부지크호텔앤레지던스", "description": "숙박 테마",  "latitude": 35.153269, "longitude": 126.851293, "radius_m": 70 },
  { "id": 138, "name": "이끌림 비지니스호텔 하남", "description": "숙박 테마",  "latitude": 35.145259, "longitude": 126.913934, "radius_m": 70 },
  { "id": 139, "name": "라마다플라자 충장호텔", "description": "숙박 테마",  "latitude": 35.147872, "longitude": 126.911842, "radius_m": 70 },
  { "id": 140, "name": "볼튼호텔", "description": "숙박 테마",  "latitude": 35.151274, "longitude": 126.850099, "radius_m": 70 },

  { "id": 141, "name": "죽녹원", "description": "근교·광역권 테마",  "latitude": 35.326788, "longitude": 126.985376, "radius_m": 70 },
  { "id": 142, "name": "메타세쿼이아 가로수길", "description": "근교·광역권 테마",  "latitude": 35.324579, "longitude": 127.006535, "radius_m": 70 },
  { "id": 143, "name": "송강정", "description": "근교·광역권 테마",  "latitude": 35.252651, "longitude": 126.953942, "radius_m": 70 },
  { "id": 144, "name": "쌍교숯불갈비 담양 본점", "description": "근교·광역권 테마",  "latitude": 35.253386, "longitude": 126.952108, "radius_m": 70 },
  { "id": 145, "name": "중흥골드스파&리조트", "description": "근교·광역권 테마",  "latitude": 34.948332, "longitude": 126.871360, "radius_m": 70 },
  { "id": 146, "name": "국립나주박물관", "description": "근교·광역권 테마",  "latitude": 34.914706, "longitude": 126.659434, "radius_m": 70 },
  { "id": 147, "name": "나주곰탕노안집", "description": "근교·광역권 테마",  "latitude": 35.031784, "longitude": 126.716649, "radius_m": 70 },
  { "id": 148, "name": "빛가람 호수공원", "description": "근교·광역권 테마",  "latitude": 35.016662, "longitude": 126.788742, "radius_m": 70 },
  { "id": 149, "name": "도곡온천단지", "description": "근교·광역권 테마",  "latitude": 35.029580, "longitude": 126.903765, "radius_m": 70 },
  { "id": 150, "name": "화순 고인돌군 유적", "description": "근교·광역권 테마",  "latitude": 34.980482, "longitude": 126.923983, "radius_m": 70 },
  { "id": 151, "name": "운주사", "description": "근교·광역권 테마",  "latitude": 34.919963, "longitude": 126.877014, "radius_m": 70 },
  { "id": 152, "name": "만연폭포", "description": "근교·광역권 테마",  "latitude": 35.073694, "longitude": 127.001149, "radius_m": 70 },
  { "id": 153, "name": "황룡강 생태공원", "description": "근교·광역권 테마",  "latitude": 35.305207, "longitude": 126.777226, "radius_m": 70 },
  { "id": 154, "name": "백양사", "description": "근교·광역권 테마",  "latitude": 35.439701, "longitude": 126.883443, "radius_m": 70 },
  { "id": 155, "name": "장성호수변공원", "description": "근교·광역권 테마",  "latitude": 35.426774, "longitude": 126.785853, "radius_m": 70 },
  { "id": 156, "name": "오피먼트", "description": "근교·광역권 테마",  "latitude": 35.344430, "longitude": 126.817365, "radius_m": 70 },
  { "id": 157, "name": "함평엑스포공원", "description": "근교·광역권 테마",  "latitude": 35.055842, "longitude": 126.522192, "radius_m": 70 },
  { "id": 158, "name": "돌머리해수욕장", "description": "근교·광역권 테마",  "latitude": 35.087276, "longitude": 126.442683, "radius_m": 70 },
  { "id": 159, "name": "용천사", "description": "근교·광역권 테마",  "latitude": 35.183806, "longitude": 126.544838, "radius_m": 70 },
  { "id": 160, "name": "화랑식당", "description": "근교·광역권 테마",  "latitude": 35.064566, "longitude": 126.523504, "radius_m": 70 },
  { "id": 161, "name": "호남대학교", "description": "근교·광역권 테마",  "latitude": 35.150700, "longitude": 126.768858, "radius_m": 70 }
    # ... 계속 추가
]


# 지구 반경 (미터)
EARTH_RADIUS_M = 6371000


def haversine_distance_m(lat1, lng1, lat2, lng2):
    """
    두 좌표 사이의 거리를 미터 단위로 계산.
    """
    # 위도/경도를 라디안 단위로 변환
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlng / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return EARTH_RADIUS_M * c


class StampCheckinRequest(BaseModel):
    lat: float
    lng: float

# 사용자 관리 API
@app.post('/api/auth/register')
async def register_user(user_data: dict, db: Session = Depends(get_db)):
    """사용자 회원가입"""
    try:
        username = user_data.get('username')
        email = user_data.get('email')
        password = user_data.get('password')
        
        if not all([username, email, password]):
            return {'error': '사용자명, 이메일, 비밀번호를 모두 입력해주세요'}
        
        # 비밀번호 해싱
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # 사용자 생성
        cursor = db.execute(sqlalchemy.text("""
            INSERT INTO users (username, email, password_hash)
            VALUES (:username, :email, :password_hash)
            RETURNING id
        """), {
            'username': username,
            'email': email,
            'password_hash': password_hash
        })
        
        user_id = cursor.fetchone()[0]
        db.commit()
        
        return {'message': '회원가입 성공', 'user_id': user_id}
        
    except Exception as e:
        db.rollback()
        if 'duplicate key' in str(e).lower():
            return {'error': '이미 존재하는 사용자명 또는 이메일입니다'}
        return {'error': f'회원가입 실패: {str(e)}'}

@app.post('/api/auth/login')
async def login_user(user_data: dict, request: Request, response: Response, db: Session = Depends(get_db)):
    """사용자 로그인"""
    try:
        email = user_data.get('email')
        password = user_data.get('password')
        
        if not all([email, password]):
            return {'error': '이메일과 비밀번호를 입력해주세요'}
        
        # 사용자 조회
        result = db.execute(sqlalchemy.text("""
            SELECT id, username, password_hash FROM users WHERE email = :email
        """), {'email': email})
        
        user = result.fetchone()
        if not user:
            return {'error': '존재하지 않는 이메일입니다'}
        
        # 비밀번호 확인
        if not bcrypt.checkpw(password.encode('utf-8'), user[2].encode('utf-8')):
            return {'error': '비밀번호가 일치하지 않습니다'}
        
        # 세션 생성 (간단한 쿠키 방식)
        session_id = f"session_{user[0]}"
        user_sessions[session_id] = user[0]
        
        response.set_cookie(
            key="session_id", 
            value=session_id, 
            httponly=True,
            secure=False,
            samesite='Lax'
        )
        
        return {
            'message': '로그인 성공',
            'user_id': user[0],
            'username': user[1]
        }
        
    except Exception as e:
        return {'error': f'로그인 실패: {str(e)}'}

@app.post('/api/auth/logout')
async def logout_user(request: Request, response: Response):
    """사용자 로그아웃"""
    try:
        session_id = request.cookies.get("session_id")
        if session_id and session_id in user_sessions:
            del user_sessions[session_id]
        
        response.delete_cookie("session_id")
        return {'message': '로그아웃 성공'}
        
    except Exception as e:
        return {'error': f'로그아웃 실패: {str(e)}'}

@app.post('/api/auth/google')
async def google_login(user_data: dict, request: Request, response: Response, db: Session = Depends(get_db)):
    """Google 로그인"""
    try:
        id_token_str = user_data.get('id_token')
        if not id_token_str:
            return {'error': 'ID 토큰이 필요합니다'}
        
        # Google 클라이언트 ID (환경 변수에서 가져오기)
        google_client_id = os.getenv('GOOGLE_CLIENT_ID')
        if not google_client_id:
            logger.error("GOOGLE_CLIENT_ID 환경 변수가 설정되지 않았습니다")
            return {'error': '서버 설정 오류입니다'}
        
        # Google ID 토큰 검증
        try:
            id_info = id_token.verify_oauth2_token(
                id_token_str, 
                requests.Request(), 
                google_client_id
            )
        except ValueError as e:
            logger.error(f"Google 토큰 검증 실패: {e}")
            return {'error': '유효하지 않은 Google 토큰입니다'}
        
        # Google 사용자 정보 추출
        google_id = id_info.get('sub')
        email = id_info.get('email')
        name = id_info.get('name', email.split('@')[0])  # 이름이 없으면 이메일 앞부분 사용
        picture = id_info.get('picture')
        
        if not email:
            return {'error': '이메일 정보를 가져올 수 없습니다'}
        
        # DB에서 사용자 확인 (이메일로)
        result = db.execute(sqlalchemy.text("""
            SELECT id, username, password_hash, google_id FROM users WHERE email = :email
        """), {'email': email})
        
        user = result.fetchone()
        
        if user:
            # 기존 사용자 - Google ID 업데이트 (없으면)
            user_id = user[0]
            username = user[1]
            existing_google_id = user[3]
            
            if not existing_google_id:
                # Google ID 업데이트
                db.execute(sqlalchemy.text("""
                    UPDATE users SET google_id = :google_id WHERE id = :user_id
                """), {'google_id': google_id, 'user_id': user_id})
                db.commit()
        else:
            # 새 사용자 - 자동 회원가입
            # username 생성 (이름 또는 이메일 앞부분)
            base_username = name.replace(' ', '_')
            username = base_username
            counter = 1
            
            # username 중복 체크 및 생성
            while True:
                check_result = db.execute(sqlalchemy.text("""
                    SELECT id FROM users WHERE username = :username
                """), {'username': username}).fetchone()
                
                if not check_result:
                    break
                username = f"{base_username}_{counter}"
                counter += 1
            
            # 사용자 생성 (password_hash는 NULL)
            cursor = db.execute(sqlalchemy.text("""
                INSERT INTO users (username, email, password_hash, google_id)
                VALUES (:username, :email, NULL, :google_id)
            """), {
                'username': username,
                'email': email,
                'google_id': google_id
            })
            
            # SQLite에서 lastrowid 사용
            user_id = cursor.lastrowid
            db.commit()
        
        # 세션 생성 (기존 로그인 방식과 동일)
        session_id = f"session_{user_id}"
        user_sessions[session_id] = user_id
        
        response.set_cookie(
            key="session_id", 
            value=session_id, 
            httponly=True,
            secure=False,
            samesite='Lax'
        )
        
        return {
            'message': 'Google 로그인 성공',
            'user_id': user_id,
            'username': username
        }
        
    except Exception as e:
        logger.error(f"Google 로그인 실패: {e}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        return {'error': f'Google 로그인 실패: {str(e)}'}

# 현재 로그인한 사용자 ID 가져오기
def get_current_user_id(request: Request) -> int:
    session_id = request.cookies.get("session_id")
    if not session_id or session_id not in user_sessions:
        raise HTTPException(status_code=401, detail="로그인이 필요합니다")
    return user_sessions[session_id]

@app.get('/api/themes')
async def get_themes(db: Session = Depends(get_db)):
    try:
        result = db.execute(sqlalchemy.text('SELECT * FROM themes ORDER BY id'))
        themes = result.fetchall()
        theme_list = []
        for theme in themes:
            theme_list.append({
                'id': theme[0],
                'name': theme[1],
                'description': theme[2],
                'icon_name': theme[3],
                'color_code': theme[4]
            })
        return {'themes': theme_list}
    except Exception as e:
        return {'error': f'테마 조회 실패: {str(e)}'}

@app.get('/api/spots')
async def get_spots(db: Session = Depends(get_db)):
    try:
        result = db.execute(sqlalchemy.text('''
            SELECT s.id, s.name, s.theme_id, s.description, s.address, 
                   s.latitude, s.longitude, s.image_url, s.operating_hours, 
                   s.contact_info, t.name as theme_name 
            FROM spots s 
            JOIN themes t ON s.theme_id = t.id 
            ORDER BY s.id
        '''))
        spots = result.fetchall()
        spot_list = []
        for spot in spots:
            spot_list.append({
                'id': spot[0],
                'name': spot[1],
                'theme_id': spot[2],
                'theme_name': spot[10],
                'description': spot[3],
                'address': spot[4],
                'latitude': float(spot[5]) if spot[5] else None,
                'longitude': float(spot[6]) if spot[6] else None,
                'image_url': spot[7],  # 이 줄을 추가해야 함!
                'operating_hours': spot[8],
                'contact_info': spot[9]
            })
        return {'spots': spot_list}
    except Exception as e:
        return {'error': f'거점 조회 실패: {str(e)}'}

@app.get('/api/themes/{theme_id}/spots')
async def get_spots_by_theme(theme_id: int, db: Session = Depends(get_db)):
    try:
        result = db.execute(sqlalchemy.text('SELECT * FROM spots WHERE theme_id = :theme_id ORDER BY id'), {'theme_id': theme_id})
        spots = result.fetchall()
        spot_list = []
        for spot in spots:
            spot_list.append({
                'id': spot[0],
                'name': spot[1],
                'theme_id': spot[2],
                'description': spot[3],
                'address': spot[4],
                'latitude': float(spot[5]) if spot[5] else None,
                'longitude': float(spot[6]) if spot[6] else None,
                'image_url': spot[7],  # 이 줄을 추가해야 함!
                'operating_hours': spot[8],
                'contact_info': spot[9]
            })
        return {'theme_id': theme_id, 'spots': spot_list}
    except Exception as e:
        return {'error': f'테마별 거점 조회 실패: {str(e)}'}

# ======================== 스탬프 투어 API ========================

@app.get("/api/stamp-spots")
def get_stamp_spots():
    """
    스탬프 투어에 사용할 지점 목록 반환.
    - 현재는 STAMP_SPOTS 리스트에서 바로 가져옴.
    """
    return {"spots": STAMP_SPOTS}


@app.post("/api/stamp/checkin")
def stamp_checkin(payload: StampCheckinRequest):
    """
    클라이언트에서 보낸 현재 위치로 스탬프 가능 여부 확인.

    요청: { "lat": float, "lng": float }
    응답:
      - success: true/false
      - matched_spot: 스탬프 성공한 지점 정보 + distance_m
      - nearest_spot: (실패 시) 가장 가까운 지점 + distance_m
    """
    user_lat = payload.lat
    user_lng = payload.lng

    if not STAMP_SPOTS:
        return {
            "success": False,
            "message": "등록된 스탬프 지점이 없습니다."
        }

    nearest_spot = None
    nearest_distance = None
    matched_spot = None

    for spot in STAMP_SPOTS:
        dist = haversine_distance_m(
            user_lat,
            user_lng,
            spot["latitude"],
            spot["longitude"],
        )

        # 가장 가까운 지점 계산
        if nearest_distance is None or dist < nearest_distance:
            nearest_distance = dist
            nearest_spot = spot

        # 해당 지점의 허용 반경 안에 들어왔는지 체크
        radius = spot.get("radius_m", 80)
        if dist <= radius and matched_spot is None:
            matched_spot = {**spot, "distance_m": dist}

    if matched_spot:
        return {
            "success": True,
            "matched_spot": matched_spot,
        }

    # 여기까지 왔다는 건, 아직 어떤 스탬프 범위에도 들어오지 않음
    resp = {
        "success": False,
        "message": "아직 스탬프 범위 안에 들어오지 않았습니다.",
    }
    if nearest_spot is not None and nearest_distance is not None:
        resp["nearest_spot"] = {
            **nearest_spot,
            "distance_m": nearest_distance,
        }
    return resp

# 루트 중복 체크 API
@app.post('/api/routes/check-duplicate')
async def check_route_duplicate(route_data: dict, request: Request, db: Session = Depends(get_db)):
    try:
        user_id = get_current_user_id(request)
        if not user_id:
            return {'error': '로그인이 필요합니다'}
        
        route_name = route_data.get('name')
        spots = route_data.get('spots', [])
        
        # 동일한 이름의 루트가 있는지 확인
        name_result = db.execute(sqlalchemy.text("""
            SELECT id FROM user_routes 
            WHERE user_id = :user_id AND name = :name
        """), {'user_id': user_id, 'name': route_name})
        
        if name_result.fetchone():
            return {'is_duplicate': True, 'reason': '동일한 이름의 루트가 이미 존재합니다'}
        
        # 동일한 관광지 조합의 루트가 있는지 확인
        if len(spots) > 0:
            # 사용자의 모든 루트에서 관광지 조합 확인 (SQLite 문법)
            routes_result = db.execute(sqlalchemy.text("""
                SELECT r.id, r.name, GROUP_CONCAT(CAST(rs.spot_id AS TEXT), ',') as spot_combination
                FROM user_routes r
                JOIN route_spots rs ON r.id = rs.route_id
                WHERE r.user_id = :user_id
                GROUP BY r.id, r.name
            """), {'user_id': user_id})
            
            existing_routes = routes_result.fetchall()
            new_spot_combination = ','.join(sorted([str(spot_id) for spot_id in spots]))
            
            for route in existing_routes:
                if route[2] == new_spot_combination:
                    return {'is_duplicate': True, 'reason': '동일한 관광지 조합의 루트가 이미 존재합니다'}
        
        return {'is_duplicate': False}
        
    except Exception as e:
        return {'error': f'중복 체크 실패: {str(e)}'}

# 루트 생성 API (사용자 연결)
@app.post('/api/routes')
async def create_route(route_data: dict, request: Request, db: Session = Depends(get_db)):
    try:
        # 현재 로그인한 사용자 ID 가져오기
        user_id = get_current_user_id(request)
        
        # 루트 기본 정보 저장 (사용자 ID 포함)
        from datetime import datetime
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor = db.execute(sqlalchemy.text("""
            INSERT INTO user_routes (name, description, estimated_time, total_distance, user_id, created_at)
            VALUES (:name, :description, :estimated_time, :total_distance, :user_id, :created_at)
        """), {
            'name': route_data.get('name'),
            'description': route_data.get('description'),
            'estimated_time': route_data.get('estimated_time'),
            'total_distance': route_data.get('total_distance'),
            'user_id': user_id,
            'created_at': current_time
        })
        
        # SQLite에서는 RETURNING을 지원하지 않으므로 lastrowid 사용
        route_id = cursor.lastrowid
        
        # 루트에 포함된 거점들 저장 (중복 제거)
        spots = route_data.get('spots', [])
        
        # 중복 제거: 같은 spot_id가 여러 번 들어오는 경우 제거
        unique_spots = []
        seen_spot_ids = set()
        for spot_id in spots:
            # spot_id가 정수인지 확인
            spot_id_int = int(spot_id) if spot_id else None
            if spot_id_int and spot_id_int not in seen_spot_ids:
                unique_spots.append(spot_id_int)
                seen_spot_ids.add(spot_id_int)
        
        # 디버깅: 저장할 관광지 정보 로그
        print(f"🔍 루트 저장 - 원본 spots 개수: {len(spots)}, 중복 제거 후: {len(unique_spots)}")
        print(f"🔍 원본 spots: {spots}")
        print(f"🔍 중복 제거 후 spots: {unique_spots}")
        
        # 기존에 저장된 관광지가 있다면 먼저 삭제 (중복 방지)
        db.execute(sqlalchemy.text("""
            DELETE FROM route_spots WHERE route_id = :route_id
        """), {'route_id': route_id})
        print(f"🔍 기존 route_spots 데이터 삭제 완료 (route_id={route_id})")
        
        # 중복 제거된 관광지들만 저장 (UNIQUE 제약조건이 있으므로 일반 INSERT 사용)
        print(f"🔍 실제로 데이터베이스에 저장할 관광지: {unique_spots}")
        for i, spot_id in enumerate(unique_spots):
            print(f"🔍 INSERT: route_id={route_id}, spot_id={spot_id}, order={i + 1}")
            try:
                db.execute(sqlalchemy.text("""
                    INSERT INTO route_spots (route_id, spot_id, spot_order)
                    VALUES (:route_id, :spot_id, :order)
                """), {
                    'route_id': route_id,
                    'spot_id': spot_id,
                    'order': i + 1
                })
            except Exception as e:
                error_str = str(e)
                print(f"⚠️ INSERT 실패: {error_str}")
                # UNIQUE 제약조건 위반 시 무시 (이미 존재하는 경우)
                if "UNIQUE constraint" in error_str or "UNIQUE constraint failed" in error_str:
                    print(f"⚠️ 중복 데이터 무시 (이미 존재): route_id={route_id}, spot_id={spot_id}")
                    continue
                # 다른 에러는 다시 발생시킴
                raise
        
        db.commit()
        
        # 저장 후 검증: 실제로 저장된 데이터 확인
        verify_result = db.execute(sqlalchemy.text("""
            SELECT spot_id, spot_order FROM route_spots 
            WHERE route_id = :route_id 
            ORDER BY spot_order
        """), {'route_id': route_id})
        saved_spots = verify_result.fetchall()
        print(f"🔍 저장 후 검증 - route_id={route_id}에 저장된 관광지:")
        for spot in saved_spots:
            print(f"🔍   spot_id={spot[0]}, spot_order={spot[1]}")
        print(f"🔍 총 저장된 관광지 개수: {len(saved_spots)}")
        
        return {'message': '루트 생성 성공', 'route_id': route_id}
        
    except Exception as e:
        db.rollback()
        return {'error': f'루트 생성 실패: {str(e)}'}

# 루트 목록 조회 API (내 루트만)
@app.get('/api/routes')
async def get_routes(request: Request, db: Session = Depends(get_db)):
    try:
        # 현재 로그인한 사용자 ID 가져오기
        user_id = get_current_user_id(request)
        
        result = db.execute(sqlalchemy.text("""
            SELECT r.id, r.name, r.description, r.estimated_time, r.total_distance, r.created_at, COUNT(rs.spot_id) as spot_count
            FROM user_routes r
            LEFT JOIN route_spots rs ON r.id = rs.route_id
            WHERE r.user_id = :user_id
            GROUP BY r.id, r.name, r.description, r.estimated_time, r.total_distance, r.created_at
            ORDER BY r.created_at DESC
            """), {'user_id': user_id})
        
        routes = result.fetchall()
        route_list = []
        for route in routes:
            route_list.append({
                'id': route[0],
                'name': route[1],
                'description': route[2],
                'estimated_time': route[3],
                'total_distance': float(route[4]) if route[4] else None,
                'created_at': route[5],
                'spot_count': route[6]
            })
        return {'routes': route_list}
        
    except Exception as e:
        return {'error': f'루트 조회 실패: {str(e)}'}

# 루트 상세 조회 API (내 루트만)
@app.get('/api/routes/{route_id}')
async def get_route_detail(route_id: int, request: Request, db: Session = Depends(get_db)):
    try:
        # 현재 로그인한 사용자 ID 가져오기
        user_id = get_current_user_id(request)
        
        # 루트 기본 정보 (내 루트인지 확인)
        route_result = db.execute(sqlalchemy.text("""
            SELECT id, name, description, estimated_time, total_distance, created_at 
            FROM user_routes WHERE id = :route_id AND user_id = :user_id
        """), {'route_id': route_id, 'user_id': user_id})
        
        route = route_result.fetchone()
        if not route:
            raise HTTPException(status_code=404, detail="루트를 찾을 수 없습니다")
        
        # 루트에 포함된 거점들
        spots_result = db.execute(sqlalchemy.text("""
            SELECT s.*, rs.spot_order
            FROM route_spots rs
            JOIN spots s ON rs.spot_id = s.id
            WHERE rs.route_id = :route_id
            ORDER BY rs.spot_order
        """), {'route_id': route_id})
        
        spots = spots_result.fetchall()
        
        # 디버깅: 데이터베이스에서 조회한 관광지 정보 로그
        print(f"🔍 루트 조회 - route_id: {route_id}, user_id: {user_id}")
        print(f"🔍 데이터베이스에서 조회한 관광지 개수 (원본): {len(spots)}")
        # spots 테이블은 12개 컬럼, spot_order는 13번째(인덱스 12)
        for i, spot in enumerate(spots):
            spot_order_idx = 12  # spots 테이블 12개 컬럼 + spot_order
            print(f"🔍 관광지 {i+1}: ID={spot[0]}, 이름={spot[1]}, spot_order={spot[spot_order_idx] if len(spot) > spot_order_idx else 'N/A'}")
        
        # 중복 제거: 같은 spot_id가 여러 번 들어있는 경우 제거 (spot_order가 가장 작은 것만 유지)
        seen_spot_ids = {}
        spot_order_idx = 12  # spots 테이블 12개 컬럼 + spot_order
        for spot in spots:
            spot_id = spot[0]
            spot_order = spot[spot_order_idx] if len(spot) > spot_order_idx else None
            if spot_order is None:
                print(f"⚠️ spot_order가 None입니다! spot 길이: {len(spot)}, spot_id: {spot_id}")
                continue
            if spot_id not in seen_spot_ids:
                seen_spot_ids[spot_id] = spot
            else:
                existing_order = seen_spot_ids[spot_id][spot_order_idx] if len(seen_spot_ids[spot_id]) > spot_order_idx else None
                if existing_order is None or (spot_order is not None and spot_order < existing_order):
                    seen_spot_ids[spot_id] = spot
        
        unique_spots = list(seen_spot_ids.values())
        # spot_order로 정렬
        unique_spots.sort(key=lambda x: x[spot_order_idx] if len(x) > spot_order_idx and x[spot_order_idx] is not None else 999)
        
        if len(unique_spots) != len(spots):
            print(f"⚠️ 중복 관광지 발견! 원본: {len(spots)}개, 중복제거후: {len(unique_spots)}개")
        
        spot_list = []
        for spot in unique_spots:
            spot_order_val = spot[spot_order_idx] if len(spot) > spot_order_idx else None
            spot_list.append({
                'id': spot[0],
                'name': spot[1],
                'theme_id': spot[2],
                'description': spot[3],
                'address': spot[4],
                'latitude': float(spot[5]) if spot[5] else None,
                'longitude': float(spot[6]) if spot[6] else None,
                'image_url': spot[11] if len(spot) > 11 else None,  # image_url은 12번째 컬럼 (인덱스 11)
                'operating_hours': spot[7] if len(spot) > 7 else None,
                'contact_info': spot[8] if len(spot) > 8 else None,
                'spot_order': spot_order_val
            })
        
        print(f"🔍 반환할 spot_list 개수 (중복 제거 후): {len(spot_list)}")
        
        return {
            'route': {
                'id': route[0],
                'name': route[1],
                'description': route[2],
                'estimated_time': route[3],
                'total_distance': float(route[4]) if route[4] else None,
                'created_at': route[5]
            },
            'spots': spot_list
        }
        
    except Exception as e:
        return {'error': f'루트 상세 조회 실패: {str(e)}'}

# 루트 삭제 API (DELETE 메서드)
@app.delete('/api/routes/{route_id}')
async def delete_route(route_id: int, request: Request, db: Session = Depends(get_db)):
    """루트 삭제"""
    try:
        # 현재 로그인한 사용자 ID 가져오기
        user_id = get_current_user_id(request)
        
        # 루트가 내 루트인지 확인
        route_result = db.execute(sqlalchemy.text("""
            SELECT id FROM user_routes WHERE id = :route_id AND user_id = :user_id
        """), {'route_id': route_id, 'user_id': user_id})
        
        if not route_result.fetchone():
            raise HTTPException(status_code=404, detail="루트를 찾을 수 없습니다")
        
        # 루트 삭제 (CASCADE로 route_spots도 자동 삭제됨)
        db.execute(sqlalchemy.text("""
            DELETE FROM user_routes WHERE id = :route_id AND user_id = :user_id
        """), {'route_id': route_id, 'user_id': user_id})
        
        db.commit()
        return {'message': '루트 삭제 성공'}
        
    except Exception as e:
        db.rollback()
        return {'error': f'루트 삭제 실패: {str(e)}'}

# 루트 삭제 API (POST 메서드 - 대체용)
@app.post('/api/routes/{route_id}/delete')
async def delete_route_post(route_id: int, request: Request, db: Session = Depends(get_db)):
    """루트 삭제 (POST 메서드)"""
    try:
        # 현재 로그인한 사용자 ID 가져오기
        user_id = get_current_user_id(request)
        
        # 루트가 내 루트인지 확인
        route_result = db.execute(sqlalchemy.text("""
            SELECT id FROM user_routes WHERE id = :route_id AND user_id = :user_id
        """), {'route_id': route_id, 'user_id': user_id})
        
        if not route_result.fetchone():
            raise HTTPException(status_code=404, detail="루트를 찾을 수 없습니다")
        
        # 루트 삭제 (CASCADE로 route_spots도 자동 삭제됨)
        db.execute(sqlalchemy.text("""
            DELETE FROM user_routes WHERE id = :route_id AND user_id = :user_id
        """), {'route_id': route_id, 'user_id': user_id})
        
        db.commit()
        return {'message': '루트 삭제 성공'}
        
    except Exception as e:
        db.rollback()
        return {'error': f'루트 삭제 실패: {str(e)}'}

# 루트 추천 API들 (사용자별 개인화)
@app.get('/api/recommendations/theme/{theme_id}')
async def get_theme_based_recommendations(theme_id: int, request: Request, db: Session = Depends(get_db)):
    """테마 기반 루트 추천 (내 루트 기반)"""
    try:
        # 현재 로그인한 사용자 ID 가져오기
        user_id = get_current_user_id(request)
        
        # 해당 테마의 거점들을 포함하는 내 루트들 찾기
        result = db.execute(sqlalchemy.text("""
            SELECT DISTINCT r.*, COUNT(rs.spot_id) as spot_count
            FROM user_routes r
            JOIN route_spots rs ON r.id = rs.route_id
            JOIN spots s ON rs.spot_id = s.id
            WHERE s.theme_id = :theme_id AND r.user_id = :user_id
            GROUP BY r.id
            ORDER BY r.created_at DESC
        """), {'theme_id': theme_id, 'user_id': user_id})
        
        routes = result.fetchall()
        route_list = []
        for route in routes:
            route_list.append({
                'id': route[0],
                'name': route[1],
                'description': route[2],
                'estimated_time': route[3],
                'total_distance': float(route[4]) if route[4] else None,
                'created_at': route[5],
                'spot_count': route[7]
            })
        
        # 테마 이름 가져오기
        theme_result = db.execute(sqlalchemy.text("SELECT name FROM themes WHERE id = :theme_id"), {'theme_id': theme_id})
        theme_row = theme_result.fetchone()
        theme_name = theme_row[0] if theme_row else "Unknown"
        
        return {
            "theme_id": theme_id,
            "theme_name": theme_name,
            "recommended_routes": route_list,
            "total_count": len(route_list)
        }
    except Exception as e:
        return {'error': f'테마 기반 추천 실패: {str(e)}'}

@app.get('/api/recommendations/spot/{spot_id}')
async def get_spot_based_recommendations(spot_id: int, request: Request, db: Session = Depends(get_db)):
    """특정 거점을 포함하는 루트 추천 (내 루트 기반)"""
    try:
        # 현재 로그인한 사용자 ID 가져오기
        user_id = get_current_user_id(request)
        
        # 해당 거점을 포함하는 내 루트들 찾기
        result = db.execute(sqlalchemy.text("""
            SELECT r.*, COUNT(rs.spot_id) as spot_count
            FROM user_routes r
            JOIN route_spots rs ON r.id = rs.route_id
            WHERE rs.spot_id = :spot_id AND r.user_id = :user_id
            GROUP BY r.id
            RETURNING id
        """), {'spot_id': spot_id, 'user_id': user_id})
        
        routes = result.fetchall()
        route_list = []
        for route in routes:
            route_list.append({
                'id': route[0],
                'name': route[1],
                'description': route[2],
                'estimated_time': route[3],
                'total_distance': float(route[4]) if route[4] else None,
                'created_at': route[5],
                'spot_count': route[7]
            })
        
        # 거점 이름 가져오기
        spot_result = db.execute(sqlalchemy.text("SELECT name FROM spots WHERE id = :spot_id"), {'spot_id': spot_id})
        spot_row = spot_result.fetchone()
        spot_name = spot_row[0] if spot_row else "Unknown"
        
        return {
            "spot_id": spot_id,
            "spot_name": spot_name,
            "recommended_routes": route_list,
            "total_count": len(route_list)
        }
    except Exception as e:
        return {'error': f'거점 기반 추천 실패: {str(e)}'}

@app.get('/api/recommendations/similar/{route_id}')
async def get_similar_routes(route_id: int, request: Request, db: Session = Depends(get_db)):
    """유사한 루트 추천 (내 루트들 중에서)"""
    try:
        # 현재 로그인한 사용자 ID 가져오기
        user_id = get_current_user_id(request)
        
        # 현재 루트 정보 가져오기 (내 루트인지 확인)
        route_result = db.execute(sqlalchemy.text("SELECT * FROM user_routes WHERE id = :route_id AND user_id = :user_id"), {'route_id': route_id, 'user_id': user_id})
        current_route = route_result.fetchone()
        if not current_route:
            raise HTTPException(status_code=404, detail="루트를 찾을 수 없습니다")
        
        # 현재 루트의 거점들
        spots_result = db.execute(sqlalchemy.text("SELECT spot_id FROM route_spots WHERE route_id = :route_id"), {'route_id': route_id})
        current_spot_ids = [spot[0] for spot in spots_result.fetchall()]
        
        if not current_spot_ids:
            return {
                "current_route_id": route_id,
                "current_route_name": current_route[1],
                "similar_routes": [],
                "total_count": 0
            }
        
        # 유사한 루트들 찾기 (내 루트들 중에서 공통 거점이 있는 루트들)
        placeholders = ','.join([':spot' + str(i) for i in range(len(current_spot_ids))])
        params = {f'spot{i}': spot_id for i, spot_id in enumerate(current_spot_ids)}
        params['route_id'] = route_id
        params['user_id'] = user_id
        
        result = db.execute(sqlalchemy.text(f"""
            SELECT DISTINCT r.*, COUNT(rs.spot_id) as spot_count,
                   COUNT(CASE WHEN rs.spot_id IN ({placeholders}) THEN 1 END) as common_spots
            FROM user_routes r
            JOIN route_spots rs ON r.id = rs.route_id
            WHERE r.id != :route_id AND r.user_id = :user_id
            GROUP BY r.id
            HAVING COUNT(CASE WHEN rs.spot_id IN ({placeholders}) THEN 1 END) > 0
            ORDER BY common_spots DESC, r.created_at DESC
        """), params)
        
        routes = result.fetchall()
        route_list = []
        for route in routes:
            route_list.append({
                'id': route[0],
                'name': route[1],
                'description': route[2],
                'estimated_time': route[3],
                'total_distance': float(route[4]) if route[4] else None,
                'created_at': route[5],
                'common_spots': route[8]
            })
        
        return {
            "current_route_id": route_id,
            "current_route_name": current_route[1],
            "similar_routes": route_list,
            "total_count": len(route_list)
        }
        
    except Exception as e:
        return {'error': f'유사 루트 추천 실패: {str(e)}'}

# 루트 추천 시스템 API들
@app.get('/api/ai/recommendations/spots')
async def get_ai_spot_recommendations(
    base_spot_id: int = None,
    user_id: int = None,
    limit: int = 5,
    request: Request = None,
    db: Session = Depends(get_db)
):
    """기반 관광지 추천 (임시 간단 버전)"""
    try:
        # 간단한 추천: 인기 관광지 반환
        result = db.execute(sqlalchemy.text("""
            SELECT id, name, theme_id, latitude, longitude, description
            FROM spots 
            WHERE latitude IS NOT NULL AND longitude IS NOT NULL
            ORDER BY id
            LIMIT :limit
        """), {'limit': limit})
        
        spots = result.fetchall()
        recommendations = []
        for spot in spots:
            recommendations.append({
                'id': spot[0],
                'name': spot[1],
                'theme_id': spot[2],
                'latitude': float(spot[3]) if spot[3] else None,
                'longitude': float(spot[4]) if spot[4] else None,
                'description': spot[5],
                'ai_score': 85.0,  # 고정 점수
                'collaborative_score': 0,
                'content_score': 85
            })
        
        return {
            "user_id": user_id or 1,
            "recommendations": recommendations,
            "algorithm": "simple_popular",
            "total_count": len(recommendations)
        }
        
    except Exception as e:
        return {'error': f'추천 실패: {str(e)}'}

@app.get('/api/ai/recommendations/routes')
async def get_ai_route_recommendations(
    limit: int = 5,
    request: Request = None,
    db: Session = Depends(get_db)
):
    """기반 루트 추천 - 사용자 패턴 분석 기반"""
    try:
        user_id = get_current_user_id(request)
        if not user_id:
            return {'error': '로그인이 필요합니다'}
        
        # 사용자의 루트 목록 가져오기 (최신순)
        routes_result = db.execute(sqlalchemy.text("""
            SELECT id, name, created_at FROM user_routes 
            WHERE user_id = :user_id 
            ORDER BY created_at DESC
        """), {'user_id': user_id})
        user_routes = routes_result.fetchall()
        
        if not user_routes:
            return {'error': '저장된 루트가 없습니다. 먼저 루트를 만들어주세요.'}
        
        # 가장 최근 루트 분석
        latest_route_id = user_routes[0][0]
        latest_route_name = user_routes[0][1]
        
        # 최근 루트의 관광지들 가져오기
        spots_result = db.execute(sqlalchemy.text("""
            SELECT s.id, s.name, s.theme_id, s.latitude, s.longitude
            FROM route_spots rs
            JOIN spots s ON rs.spot_id = s.id
            WHERE rs.route_id = :route_id
            ORDER BY rs.id
        """), {'route_id': latest_route_id})
        latest_route_spots = spots_result.fetchall()
        
        if not latest_route_spots:
            return {'error': '루트에 관광지가 없습니다.'}
        
        # 테마 분석
        theme_counts = {}
        for spot in latest_route_spots:
            theme_id = spot[2]
            theme_counts[theme_id] = theme_counts.get(theme_id, 0) + 1
        
        # 관광지 개수
        spot_count = len(latest_route_spots)
        
        # 루트 추천 생성
        recommended_routes = []
        
        # 테마별로 필요한 관광지들을 수집
        theme_spots = {}
        for spot in latest_route_spots:
            theme_id = spot[2]
            if theme_id not in theme_spots:
                theme_spots[theme_id] = []
            
            # 해당 테마의 다른 관광지들 가져오기
            other_spots_result = db.execute(sqlalchemy.text("""
                SELECT s.id, s.name, s.theme_id, s.latitude, s.longitude
                FROM spots s
                WHERE s.theme_id = :theme_id 
                AND s.id NOT IN (
                    SELECT rs.spot_id FROM route_spots rs WHERE rs.route_id = :route_id
                )
                ORDER BY RANDOM()
                LIMIT 3
            """), {
                'theme_id': theme_id, 
                'route_id': latest_route_id
            })
            other_spots = other_spots_result.fetchall()
            
            if other_spots:
                theme_spots[theme_id].extend([{
                    'id': spot_data[0],
                    'name': spot_data[1],
                    'theme_id': spot_data[2],
                    'latitude': float(spot_data[3]) if spot_data[3] else 0,
                    'longitude': float(spot_data[4]) if spot_data[4] else 0
                } for spot_data in other_spots])
            else:
                # 다른 관광지가 없으면 같은 테마의 다른 관광지 선택
                fallback_spots_result = db.execute(sqlalchemy.text("""
                    SELECT s.id, s.name, s.theme_id, s.latitude, s.longitude
                    FROM spots s
                    WHERE s.theme_id = :theme_id 
                    ORDER BY RANDOM()
                    LIMIT 3
                """), {
                    'theme_id': theme_id
                })
                fallback_spots = fallback_spots_result.fetchall()
                
                if fallback_spots:
                    theme_spots[theme_id].extend([{
                        'id': spot_data[0],
                        'name': spot_data[1],
                        'theme_id': spot_data[2],
                        'latitude': float(spot_data[3]) if spot_data[3] else 0,
                        'longitude': float(spot_data[4]) if spot_data[4] else 0
                    } for spot_data in fallback_spots])
        
        # 각 추천 루트 생성 (테마 순서 랜덤)
        for i in range(min(limit, 3)):  # 최대 3개 추천
            recommended_spots = []
            
            # 테마별로 필요한 개수만큼 관광지 선택 (순서 랜덤)
            import random
            
            # 원본 루트의 테마 순서를 랜덤하게 섞기
            theme_order = list(theme_counts.keys())
            random.shuffle(theme_order)
            
            # 각 테마별로 필요한 개수만큼 관광지 선택
            for theme_id in theme_order:
                count = theme_counts[theme_id]
                available_spots = theme_spots.get(theme_id, [])
                
                # 필요한 개수만큼 선택
                for _ in range(count):
                    if available_spots:
                        # 랜덤하게 선택
                        selected_spot = random.choice(available_spots)
                        recommended_spots.append(selected_spot)
                        # 중복 방지를 위해 선택된 관광지 제거
                        available_spots.remove(selected_spot)
            
            # 추천 루트가 비어있지 않으면 추가
            if recommended_spots:
                # 루트 이름 생성 (관광지 이름 기반)
                spot_names = [spot['name'] for spot in recommended_spots]
                if len(spot_names) <= 3:
                    # 3개 이하면 모든 관광지 이름 표시
                    route_name = f"{' → '.join(spot_names)} 루트"
                else:
                    # 3개 초과면 첫 번째와 마지막 관광지 + 개수 표시
                    route_name = f"{spot_names[0]} → ... → {spot_names[-1]} 루트 ({len(spot_names)}개)"
                
                # 거리와 시간 계산 (간단한 추정)
                total_distance = len(recommended_spots) * 1.5  # 관광지당 1.5km 추정
                estimated_time = len(recommended_spots) * 1.5  # 관광지당 1.5시간 추정
                
                recommended_routes.append({
                    'id': f"recommended_{i+1}",
                    'name': route_name,
                    'spots': recommended_spots,
                    'total_distance': round(total_distance, 1),
                    'estimated_time': round(estimated_time, 1),
                    'recommended': True,
                    'score': 85 + (i * 5),  # 첫 번째 추천이 가장 높은 점수
                    'based_on_route': latest_route_name
                })
        
        return {
            "user_id": user_id,
            "recommended_routes": recommended_routes,
            "algorithm": "pattern_based",
            "total_count": len(recommended_routes),
            "analysis": {
                "based_on_route": latest_route_name,
                "theme_pattern": theme_counts,
                "spot_count": spot_count
            }
        }
        
    except Exception as e:
        logger.error(f"루트 추천 실패: {e}")
        return {'error': f'루트 추천 실패: {str(e)}'}

@app.post('/api/ai/feedback')
async def submit_ai_feedback(
    feedback_data: dict,
    request: Request = None,
    db: Session = Depends(get_db)
):
    """추천 피드백 수집 (학습 데이터)"""
    try:
        user_id = get_current_user_id(request)
        
        if not user_id:
            # 테스트용으로 임시 사용자 ID 사용
            user_id = 1  # 임시 사용자 ID
            print("테스트 모드: 임시 사용자 ID 1 사용")
        
        # 피드백 데이터 저장
        save_user_feedback(user_id, feedback_data, db)
        
        # 실시간 모델 업데이트 (간단한 버전)
        update_recommendation_model(user_id, feedback_data, db)
        
        return {"message": "피드백이 성공적으로 저장되었습니다"}
        
    except Exception as e:
        return {'error': f'피드백 저장 실패: {str(e)}'}

# 루트 추천 시스템 헬퍼 함수들
def collect_user_behavior(user_id: int, db: Session):
    """사용자 행동 데이터 수집"""
    try:
        # 사용자의 루트 생성 패턴 (SQLite 문법)
        route_patterns = db.execute(sqlalchemy.text("""
            SELECT 
                r.id, r.name, r.created_at,
                COUNT(rs.spot_id) as spot_count,
                AVG(s.theme_id) as avg_theme_id,
                GROUP_CONCAT(DISTINCT CAST(s.theme_id AS TEXT), ',') as theme_sequence
            FROM user_routes r
            JOIN route_spots rs ON r.id = rs.route_id
            JOIN spots s ON rs.spot_id = s.id
            WHERE r.user_id = :user_id
            GROUP BY r.id, r.name, r.created_at
            ORDER BY r.created_at DESC
        """), {'user_id': user_id}).fetchall()
        
        # 사용자의 관광지 방문 패턴
        spot_preferences = db.execute(sqlalchemy.text("""
            SELECT 
                s.theme_id,
                COUNT(*) as visit_count,
                AVG(rs.spot_order) as avg_position
            FROM route_spots rs
            JOIN spots s ON rs.spot_id = s.id
            JOIN user_routes r ON rs.route_id = r.id
            WHERE r.user_id = :user_id
            GROUP BY s.theme_id
            ORDER BY visit_count DESC
        """), {'user_id': user_id}).fetchall()
        
        # 시간대별 패턴 (SQLite 문법)
        time_patterns = db.execute(sqlalchemy.text("""
            SELECT 
                CAST(strftime('%H', r.created_at) AS INTEGER) as hour,
                COUNT(*) as route_count
            FROM user_routes r
            WHERE r.user_id = :user_id
            GROUP BY hour
            ORDER BY route_count DESC
        """), {'user_id': user_id}).fetchall()
        
        return {
            'route_patterns': [dict(zip(['id', 'name', 'created_at', 'spot_count', 'avg_theme_id', 'theme_sequence'], row)) for row in route_patterns],
            'spot_preferences': [dict(zip(['theme_id', 'visit_count', 'avg_position'], row)) for row in spot_preferences],
            'time_patterns': [dict(zip(['hour', 'route_count'], row)) for row in time_patterns]
        }
        
    except Exception as e:
        print(f"사용자 행동 데이터 수집 실패: {e}")
        return {}

def find_similar_users(user_id: int, user_behavior: dict, db: Session):
    """협업 필터링: 비슷한 사용자 찾기"""
    try:
        # 현재 사용자의 테마 선호도
        current_user_themes = {pref['theme_id']: pref['visit_count'] for pref in user_behavior.get('spot_preferences', [])}
        
        # 다른 사용자들의 테마 선호도와 비교
        all_users = db.execute(sqlalchemy.text("""
            SELECT DISTINCT r.user_id
            FROM user_routes r
            WHERE r.user_id != :user_id
        """), {'user_id': user_id}).fetchall()
        
        similar_users = []
        for other_user in all_users:
            other_user_id = other_user[0]
            
            # 다른 사용자의 테마 선호도
            other_user_themes = db.execute(sqlalchemy.text("""
                SELECT 
                    s.theme_id,
                    COUNT(*) as visit_count
                FROM route_spots rs
                JOIN spots s ON rs.spot_id = s.id
                JOIN user_routes r ON rs.route_id = r.id
                WHERE r.user_id = :user_id
                GROUP BY s.theme_id
            """), {'user_id': other_user_id}).fetchall()
            
            other_user_themes_dict = {row[0]: row[1] for row in other_user_themes}
            
            # 코사인 유사도 계산
            similarity = calculate_cosine_similarity(current_user_themes, other_user_themes_dict)
            
            if similarity > 0.3:  # 유사도 임계값
                similar_users.append({
                    'user_id': other_user_id,
                    'similarity': similarity,
                    'themes': other_user_themes_dict
                })
        
        # 유사도 순으로 정렬
        similar_users.sort(key=lambda x: x['similarity'], reverse=True)
        return similar_users[:10]  # 상위 10명
        
    except Exception as e:
        print(f"유사 사용자 찾기 실패: {e}")
        return []

def calculate_cosine_similarity(user1_themes: dict, user2_themes: dict):
    """코사인 유사도 계산"""
    try:
        # 모든 테마 ID 수집
        all_themes = set(user1_themes.keys()) | set(user2_themes.keys())
        
        if not all_themes:
            return 0.0
        
        # 벡터 생성
        vector1 = [user1_themes.get(theme_id, 0) for theme_id in all_themes]
        vector2 = [user2_themes.get(theme_id, 0) for theme_id in all_themes]
        
        # 코사인 유사도 계산
        dot_product = sum(a * b for a, b in zip(vector1, vector2))
        magnitude1 = sum(a * a for a in vector1) ** 0.5
        magnitude2 = sum(b * b for b in vector2) ** 0.5
        
        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0
        
        return dot_product / (magnitude1 * magnitude2)
        
    except Exception as e:
        print(f"코사인 유사도 계산 실패: {e}")
        return 0.0

def content_based_recommendations(user_id: int, base_spot_id: int = None, db: Session = None):
    """콘텐츠 기반 추천 (관광지 특성 기반)"""
    try:
        # 사용자의 선호 테마
        user_themes = db.execute(sqlalchemy.text("""
            SELECT 
                s.theme_id,
                COUNT(*) as preference_score
            FROM route_spots rs
            JOIN spots s ON rs.spot_id = s.id
            JOIN user_routes r ON rs.route_id = r.id
            WHERE r.user_id = :user_id
            GROUP BY s.theme_id
            ORDER BY preference_score DESC
        """), {'user_id': user_id}).fetchall()
        
        preferred_themes = [row[0] for row in user_themes[:3]]  # 상위 3개 테마
        
        # 기준 관광지 정보
        base_spot = None
        if base_spot_id:
            base_spot = db.execute(sqlalchemy.text("""
                SELECT id, name, theme_id, latitude, longitude
                FROM spots WHERE id = :spot_id
            """), {'spot_id': base_spot_id}).fetchone()
        
        # 콘텐츠 기반 추천 계산
        if base_spot:
            # 기준 관광지와 유사한 관광지들
            similar_spots = db.execute(sqlalchemy.text("""
                SELECT 
                    s.*,
                    CASE 
                        WHEN s.theme_id = :base_theme_id THEN 100
                        WHEN s.theme_id = ANY(:preferred_themes) THEN 80
                        ELSE 50
                    END as content_score
                FROM spots s
                WHERE s.id != :base_spot_id
                AND s.latitude IS NOT NULL 
                AND s.longitude IS NOT NULL
                ORDER BY content_score DESC, s.id
                LIMIT 20
            """), {
                'base_spot_id': base_spot_id,
                'base_theme_id': base_spot[2],
                'preferred_themes': preferred_themes
            }).fetchall()
        else:
            # 선호 테마 기반 추천
            similar_spots = db.execute(sqlalchemy.text("""
                SELECT 
                    s.*,
                    CASE 
                        WHEN s.theme_id = ANY(:preferred_themes) THEN 100
                        ELSE 50
                    END as content_score
                FROM spots s
                WHERE s.latitude IS NOT NULL 
                AND s.longitude IS NOT NULL
                ORDER BY content_score DESC, s.id
                LIMIT 20
            """), {'preferred_themes': preferred_themes}).fetchall()
        
        return [dict(zip(['id', 'name', 'theme_id', 'latitude', 'longitude', 'content_score'], row)) for row in similar_spots]
        
    except Exception as e:
        print(f"콘텐츠 기반 추천 실패: {e}")
        return []

def hybrid_recommendation_algorithm(similar_users: list, content_recs: list, user_behavior: dict, limit: int, db: Session = None):
    """하이브리드 추천 알고리즘"""
    try:
        # 협업 필터링 점수 계산
        collaborative_scores = {}
        for similar_user in similar_users:
            try:
                # 유사 사용자가 방문한 관광지들
                visited_spots = db.execute(sqlalchemy.text("""
                    SELECT DISTINCT rs.spot_id
                    FROM route_spots rs
                    JOIN user_routes r ON rs.route_id = r.id
                    WHERE r.user_id = :user_id
                """), {'user_id': similar_user['user_id']}).fetchall()
                
                for spot_row in visited_spots:
                    spot_id = spot_row[0]
                    if spot_id not in collaborative_scores:
                        collaborative_scores[spot_id] = 0
                    collaborative_scores[spot_id] += similar_user['similarity'] * 10
            except Exception as e:
                print(f"협업 필터링 점수 계산 실패: {e}")
                continue
        
        # 콘텐츠 기반 점수
        content_scores = {spot['id']: spot['content_score'] for spot in content_recs}
        
        # 하이브리드 점수 계산 (협업 60% + 콘텐츠 40%)
        hybrid_scores = {}
        all_spot_ids = set(collaborative_scores.keys()) | set(content_scores.keys())
        
        for spot_id in all_spot_ids:
            collab_score = collaborative_scores.get(spot_id, 0)
            content_score = content_scores.get(spot_id, 0)
            
            # 정규화
            max_collab = max(collaborative_scores.values()) if collaborative_scores else 1
            max_content = max(content_scores.values()) if content_scores else 1
            
            normalized_collab = collab_score / max_collab if max_collab > 0 else 0
            normalized_content = content_score / max_content if max_content > 0 else 0
            
            hybrid_scores[spot_id] = normalized_collab * 0.6 + normalized_content * 0.4
        
        # 상위 추천 결과 반환
        sorted_spots = sorted(hybrid_scores.items(), key=lambda x: x[1], reverse=True)
        
        # 관광지 상세 정보 가져오기
        recommended_spots = []
        for spot_id, score in sorted_spots[:limit]:
            try:
                spot_info = db.execute(sqlalchemy.text("""
                    SELECT id, name, theme_id, latitude, longitude, description
                    FROM spots WHERE id = :spot_id
                """), {'spot_id': spot_id}).fetchone()
                
                if spot_info:
                    recommended_spots.append({
                        'id': spot_info[0],
                        'name': spot_info[1],
                        'theme_id': spot_info[2],
                        'latitude': spot_info[3],
                        'longitude': spot_info[4],
                        'description': spot_info[5],
                        'ai_score': score * 100,  # 백분율로 변환
                        'collaborative_score': collaborative_scores.get(spot_id, 0),
                        'content_score': content_scores.get(spot_id, 0)
                    })
            except Exception as e:
                print(f"관광지 {spot_id} 정보 조회 실패: {e}")
                continue
        
        return recommended_spots
        
    except Exception as e:
        print(f"하이브리드 추천 실패: {e}")
        return []

def analyze_user_route_patterns(user_id: int, db: Session):
    """사용자 루트 패턴 분석 - 사용자가 만든 루트들을 분석해서 선호 패턴 추출"""
    try:
        # 루트 길이 패턴 분석: 사용자가 만든 루트들의 관광지 개수별 빈도 분석
        # 예: 3개 관광지 루트를 5번, 4개 루트를 3번 만들었다면 -> 선호 길이는 3개
        try:
            route_length_patterns = db.execute(sqlalchemy.text("""
                SELECT 
                    route_length,
                    COUNT(*) as frequency
                FROM (
                    SELECT r.id, COUNT(rs.spot_id) as route_length
                    FROM user_routes r
                    JOIN route_spots rs ON r.id = rs.route_id
                    WHERE r.user_id = :user_id
                    GROUP BY r.id
                ) subquery
                GROUP BY route_length
                ORDER BY frequency DESC
            """), {'user_id': user_id}).fetchall()
        except Exception as e:
            print(f"루트 길이 패턴 분석 실패: {e}")
            route_length_patterns = []
        
        # 테마 조합 패턴 분석: 사용자가 자주 함께 선택한 테마들의 조합 분석
        # 예: "음식+문화" 조합을 7번, "자연+경험" 조합을 4번 만들었다면 -> 선호 조합은 "음식+문화"
        try:
            theme_combination_patterns = db.execute(sqlalchemy.text("""
                SELECT 
                    theme_combination,
                    COUNT(*) as frequency
                FROM (
                    SELECT r.id, GROUP_CONCAT(DISTINCT CAST(s.theme_id AS TEXT), ',') as theme_combination
                    FROM user_routes r
                    JOIN route_spots rs ON r.id = rs.route_id
                    JOIN spots s ON rs.spot_id = s.id
                    WHERE r.user_id = :user_id
                    GROUP BY r.id
                ) subquery
                GROUP BY theme_combination
                ORDER BY frequency DESC
            """), {'user_id': user_id}).fetchall()
        except Exception as e:
            print(f"테마 조합 패턴 분석 실패: {e}")
            theme_combination_patterns = []
        
        # 분석 결과를 딕셔너리 형태로 반환 (루트 길이별 빈도, 테마 조합별 빈도)
        return {
            'route_lengths': [dict(zip(['length', 'frequency'], row)) for row in route_length_patterns],
            'theme_combinations': [dict(zip(['combination', 'frequency'], row)) for row in theme_combination_patterns]
        }
        
    except Exception as e:
        print(f"루트 패턴 분석 실패: {e}")
        return {}

def generate_recommended_routes(user_patterns: dict, limit: int, db: Session):
    """추천 루트 생성 - 분석된 사용자 패턴을 바탕으로 새로운 루트 생성"""
    try:
        ai_routes = []
        
        # 요청한 개수(limit)만큼 추천 루트 생성
        for i in range(limit):
            try:
                # 선호하는 루트 길이 선택: 사용자가 가장 자주 만든 루트의 관광지 개수
                # 예: 3개 관광지 루트를 가장 많이 만들었다면 -> preferred_length = 3
                preferred_length = 3  # 기본값 (패턴 없을 때)
                if user_patterns.get('route_lengths') and len(user_patterns['route_lengths']) > 0:
                    preferred_length = user_patterns['route_lengths'][0]['length']
                
                # 선호하는 테마 조합 선택: 사용자가 가장 자주 조합한 테마들
                # 예: "1,2,3" (음식, 문화, 자연) 조합을 가장 많이 만들었다면 -> [1, 2, 3]
                preferred_themes = [1, 2, 3]  # 기본값 (패턴 없을 때)
                if user_patterns.get('theme_combinations') and len(user_patterns['theme_combinations']) > 0:
                    theme_combo = user_patterns['theme_combinations'][0]['combination']
                    try:
                        preferred_themes = [int(t) for t in theme_combo.split(',')]
                    except:
                        preferred_themes = [1, 2, 3]  # 파싱 실패 시 기본값
                
                # 추천 루트 생성: 선호 길이와 테마 조합으로 실제 루트 생성
                recommended_route = generate_single_recommended_route(preferred_length, preferred_themes, db)
                if recommended_route:
                    ai_routes.append(recommended_route)
            except Exception as e:
                print(f"추천 루트 {i+1} 생성 실패: {e}")
                continue
        
        return ai_routes
        
    except Exception as e:
        print(f"추천 루트 생성 실패: {e}")
        return []

def generate_single_recommended_route(length: int, preferred_themes: list, db: Session):
    """단일 추천 루트 생성"""
    try:
        # 선호 테마의 관광지들 선택
        selected_spots = []
        for theme_id in preferred_themes[:length]:
            try:
                spots = db.execute(sqlalchemy.text("""
                    SELECT id, name, theme_id, latitude, longitude
                    FROM spots 
                    WHERE theme_id = :theme_id
                    AND latitude IS NOT NULL 
                    AND longitude IS NOT NULL
                    ORDER BY RANDOM()
                    LIMIT 1
                """), {'theme_id': theme_id}).fetchall()
                
                if spots:
                    selected_spots.append(dict(zip(['id', 'name', 'theme_id', 'latitude', 'longitude'], spots[0])))
            except Exception as e:
                print(f"테마 {theme_id} 관광지 조회 실패: {e}")
                continue
        
        if not selected_spots:
            return None
        
        # 루트 정보 생성
        route_name = f"추천 루트 {len(selected_spots)}개 관광지"
        total_distance = calculate_route_distance(selected_spots)
        
        return {
            'name': route_name,
            'spots': selected_spots,
            'total_distance': total_distance,
            'estimated_time': len(selected_spots) * 2,  # 관광지당 2시간
            'recommended': True
        }
        
    except Exception as e:
        print(f"단일 추천 루트 생성 실패: {e}")
        return None

def calculate_route_distance(spots: list):
    """루트 총 거리 계산"""
    try:
        total_distance = 0
        for i in range(len(spots) - 1):
            spot1 = spots[i]
            spot2 = spots[i + 1]
            
            if spot1['latitude'] and spot1['longitude'] and spot2['latitude'] and spot2['longitude']:
                distance = calculate_distance(
                    spot1['latitude'], spot1['longitude'],
                    spot2['latitude'], spot2['longitude']
                )
                total_distance += distance
        
        return round(total_distance, 2)
        
    except Exception as e:
        print(f"거리 계산 실패: {e}")
        return 0

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float):
    """두 점 간의 거리 계산 (Haversine 공식)"""
    import math
    
    R = 6371  # 지구의 반지름 (km)
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = (math.sin(dlat/2) * math.sin(dlat/2) +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon/2) * math.sin(dlon/2))
    
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

# 간단한 직선 거리 계산 (기본 기능)
@app.post('/api/calculate-simple-distance')
async def calculate_simple_distance(route_data: dict):
    """간단한 직선 거리 계산"""
    try:
        spots = route_data.get('spots', [])
        if len(spots) < 2:
            return {'error': '최소 2개의 관광지가 필요합니다'}
        
        total_distance = 0
        route_details = []
        
        for i in range(len(spots) - 1):
            # Haversine 공식으로 직선 거리 계산
            straight_distance = calculate_distance(
                spots[i]['latitude'], spots[i]['longitude'],
                spots[i+1]['latitude'], spots[i+1]['longitude']
            )
            
            total_distance += straight_distance
            route_details.append({
                'from': spots[i]['name'],
                'to': spots[i+1]['name'],
                'distance_km': round(straight_distance, 2),
                'duration_minutes': round(straight_distance * 1.5, 1),
                'note': '직선 거리'
            })
        
        return {
            'total_distance_km': round(total_distance, 2),
            'total_distance_meters': int(total_distance * 1000),
            'route_details': route_details,
            'spot_count': len(spots)
        }
        
    except Exception as e:
        logger.error(f"거리 계산 실패: {e}")
        return {'error': f'거리 계산 실패: {str(e)}'}

def save_user_feedback(user_id: int, feedback_data: dict, db: Session):
    """사용자 피드백 저장"""
    try:
        # 피드백 테이블이 없다면 생성 (실제로는 마이그레이션 필요)
        db.execute(sqlalchemy.text("""
            CREATE TABLE IF NOT EXISTS user_feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                recommendation_type VARCHAR(50),
                item_id INTEGER,
                rating INTEGER,
                feedback_text TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """))
        
        # 피드백 저장
        db.execute(sqlalchemy.text("""
            INSERT INTO user_feedback (user_id, recommendation_type, item_id, rating, feedback_text)
            VALUES (:user_id, :type, :item_id, :rating, :feedback)
        """), {
            'user_id': user_id,
            'type': feedback_data.get('type'),
            'item_id': feedback_data.get('item_id'),
            'rating': feedback_data.get('rating'),
            'feedback': feedback_data.get('feedback')
        })
        
        db.commit()
        
    except Exception as e:
        print(f"피드백 저장 실패: {e}")
        db.rollback()

def update_recommendation_model(user_id: int, feedback_data: dict, db: Session):
    """추천 모델 실시간 업데이트 (간단한 버전)"""
    try:
        # 실제로는 더 복잡한 머신러닝 모델 업데이트가 필요
        # 여기서는 간단한 사용자 선호도 업데이트만 수행
        
        if feedback_data.get('rating', 0) >= 4:  # 높은 평점
            # 해당 아이템의 가중치 증가
            pass
        elif feedback_data.get('rating', 0) <= 2:  # 낮은 평점
            # 해당 아이템의 가중치 감소
            pass
            
    except Exception as e:
        print(f"모델 업데이트 실패: {e}")

# 프로필 관련 API
@app.get('/api/profile')
async def get_profile(request: Request, db: Session = Depends(get_db)):
    """내 프로필 정보 조회"""
    try:
        user_id = get_current_user_id(request)
        
        # 사용자 정보 조회
        user_result = db.execute(sqlalchemy.text("""
            SELECT username, email, created_at 
            FROM users 
            WHERE id = :user_id
        """), {'user_id': user_id})
        
        user = user_result.fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다")
        
        # 내 루트 개수 조회
        route_count_result = db.execute(sqlalchemy.text("""
            SELECT COUNT(*) 
            FROM user_routes 
            WHERE user_id = :user_id
        """), {'user_id': user_id})
        
        route_count = route_count_result.fetchone()[0]
        
        # 방문한 관광지 개수 조회 (루트에 포함된 관광지)
        visited_spots_result = db.execute(sqlalchemy.text("""
            SELECT COUNT(DISTINCT rs.spot_id) 
            FROM route_spots rs 
            JOIN user_routes ur ON rs.route_id = ur.id 
            WHERE ur.user_id = :user_id
        """), {'user_id': user_id})
        
        visited_spots_count = visited_spots_result.fetchone()[0]
        
        # SQLite는 날짜를 문자열로 반환하므로 isoformat() 체크 수정
        created_at = user[2]
        if created_at and hasattr(created_at, 'isoformat'):
            created_at = created_at.isoformat()
        
        return {
            'user_id': user_id,
            'username': user[0],
            'email': user[1],
            'created_at': created_at,
            'stats': {
                'total_routes': route_count,
                'visited_spots': visited_spots_count
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"프로필 조회 실패: {e}")
        return {'error': f'프로필 조회 실패: {str(e)}'}

@app.get('/api/my-routes')
async def get_my_routes(request: Request, db: Session = Depends(get_db)):
    """내가 만든 루트 목록 조회"""
    try:
        user_id = get_current_user_id(request)
        
        # 내 루트 목록 조회
        routes_result = db.execute(sqlalchemy.text("""
            SELECT id, name, description, estimated_time, total_distance, created_at
            FROM user_routes 
            WHERE user_id = :user_id 
            ORDER BY created_at DESC
        """), {'user_id': user_id})
        
        routes = routes_result.fetchall()
        route_list = []
        
        for route in routes:
            # SQLite는 날짜를 문자열로 반환하므로 isoformat() 체크 수정
            created_at = route[5]
            if created_at and hasattr(created_at, 'isoformat'):
                created_at = created_at.isoformat()
            
            route_list.append({
                'id': route[0],
                'name': route[1],
                'description': route[2],
                'estimated_time': route[3],
                'total_distance': route[4],
                'created_at': created_at
            })
        
        return {'routes': route_list}
        
    except Exception as e:
        logger.error(f"내 루트 조회 실패: {e}")
        return {'error': f'내 루트 조회 실패: {str(e)}'}

@app.put('/api/routes/{route_id}')
async def update_route(route_id: int, route_data: dict, request: Request, db: Session = Depends(get_db)):
    """루트 수정"""
    try:
        user_id = get_current_user_id(request)
        
        # 루트 소유권 확인
        route_result = db.execute(sqlalchemy.text("""
            SELECT id FROM user_routes WHERE id = :route_id AND user_id = :user_id
        """), {'route_id': route_id, 'user_id': user_id})
        
        if not route_result.fetchone():
            raise HTTPException(status_code=404, detail="루트를 찾을 수 없습니다")
        
        # 루트 이름 업데이트
        db.execute(sqlalchemy.text("""
            UPDATE user_routes 
            SET name = :name 
            WHERE id = :route_id AND user_id = :user_id
        """), {
            'name': route_data.get('name'),
            'route_id': route_id,
            'user_id': user_id
        })
        
        # 기존 관광지들 삭제
        db.execute(sqlalchemy.text("""
            DELETE FROM route_spots WHERE route_id = :route_id
        """), {'route_id': route_id})
        
        # 새로운 관광지들 추가
        spots = route_data.get('spots', [])
        for i, spot_id in enumerate(spots):
            db.execute(sqlalchemy.text("""
                INSERT INTO route_spots (route_id, spot_id, spot_order)
                VALUES (:route_id, :spot_id, :spot_order)
            """), {
                'route_id': route_id,
                'spot_id': spot_id,
                'spot_order': i
            })
        
        db.commit()
        return {'message': '루트 수정 성공'}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"루트 수정 실패: {e}")
        return {'error': f'루트 수정 실패: {str(e)}'}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
