# 지역관광 특화 AI 큐레이션 플랫폼

광주광역시를 중심으로 한 지역 관광지 추천 및 맞춤형 여행 루트 생성 시스템

## 📋 프로젝트 개요

- **프로젝트명**: 지역관광 특화 AI 큐레이션 플랫폼
- **영문명**: Localized Tourism AI Curation System Development
- **프로젝트 유형**: 산학공동 기술개발 과제 (Full-Stack Web Application)
- **개발 기간**: 2025년
- **개발 인원**: 1명
- **개발 역할**: 풀스택 개발자 (Frontend + Backend + Database + Deployment)

## 🎯 주요 기능

### 1. 관광지 탐색
- **8가지 테마**로 분류된 160개 관광지
- 테마: 역사·문화, 음식, 자연, 체험, 숙박, 근교, 야경, 주말여행
- 각 관광지별 상세 정보 및 이미지 제공

### 2. 맞춤형 추천 시스템
- **Demographic Filtering**: 사용자 연령, 성별, 선호 테마 기반
- **Collaborative Filtering**: 다른 사용자 평점 기반 협업 필터링
- **Content-Based Filtering**: 관광지 특성 분석 기반
- **Hybrid Approach**: 위 3가지 방식 결합

### 3. 루트 생성 및 관리
- 관광지 선택으로 여행 루트 자동 생성
- Google Maps 연동으로 실제 도로 거리 계산
- 저장된 루트 관리 및 수정

### 4. 사용자 인증
- 회원가입 및 로그인
- bcrypt 기반 비밀번호 해싱
- 세션 관리

### 5. 관리자 통계 대시보드
- 전체 응답 수
- 만족도 분포
- 최근 응답
- 인기 기능 통계

## 🛠 기술 스택

### Frontend
- React.js (19.1.1)
- JavaScript (ES6+)
- CSS3
- Fetch API / Axios
- YouTube API
- Google Maps API

### Backend
- FastAPI (Python 3.13)
- Flask
- Python 라이브러리: SQLAlchemy, bcrypt, passlib, python-jose 등

### Database
- SQLite 3
- 주요 테이블: spots, themes, users, user_routes, route_spots, survey_responses

### Deployment
- Cloudflare Tunnel
- Windows Batch Script
- PyInstaller

## 📁 프로젝트 구조

```
GwangjuTourApp/
├── backend/               # 백엔드 서버
│   ├── app.py            # Flask 프록시 서버
│   ├── main.py           # FastAPI 메인 서버
│   ├── database.py       # 데이터베이스 연결
│   ├── models.py         # 데이터베이스 모델
│   ├── requirements.txt  # Python 패키지 목록
│   └── gwangju_tour.db   # SQLite 데이터베이스
├── frontend/             # 프론트엔드
│   ├── src/             # React 소스 코드
│   │   ├── App.js       # 메인 컴포넌트
│   │   ├── components/  # 컴포넌트
│   │   └── styles/      # 스타일 파일
│   ├── public/          # 정적 파일
│   └── package.json     # Node.js 패키지 목록
├── create_cloudflare_exe.py  # EXE 파일 생성 스크립트
├── open_cloudflare_tunnel.py # Cloudflare Tunnel 실행
├── .gitignore           # Git 무시 파일
├── README.md            # 프로젝트 설명
└── PROJECT_PORTFOLIO.md # 포트폴리오 문서
```

## 🚀 설치 및 실행

### 필수 요구사항
- Python 3.13+
- Node.js 18+
- npm 또는 yarn

### 1. 저장소 클론
```bash
git clone https://github.com/YOUR_USERNAME/GwangjuTourApp.git
cd GwangjuTourApp
```

### 2. 백엔드 설정
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
```

### 3. 프론트엔드 설정
```bash
cd frontend
npm install
```

### 4. 데이터베이스 설정
```bash
cd backend
python create_route_tables.py
python create_survey_tables.py
# 필요한 경우 데이터베이스 초기화 스크립트 실행
```

### 5. 개발 서버 실행

**Backend (FastAPI)**
```bash
cd backend
python main.py
# 서버: http://localhost:8000
```

**Backend (Flask)**
```bash
cd backend
python app.py
# 서버: http://localhost:5000
```

**Frontend**
```bash
cd frontend
npm start
# 브라우저: http://localhost:3000
```

## 📦 배포

### EXE 파일 생성
```bash
python create_cloudflare_exe.py --build
```

### Cloudflare Tunnel을 통한 원격 배포
```bash
cd backend
.\cloudflared.exe tunnel --url http://localhost:5000
```

## 📊 주요 통계

- **관광지**: 160개
- **테마**: 8개
- **API 엔드포인트**: 20개 이상
- **데이터베이스 테이블**: 10개 이상

## 🔧 주요 해결 과제

1. **데이터베이스 마이그레이션**: PostgreSQL → SQLite 변환
2. **프록시 서버 구현**: Flask를 통한 FastAPI 프록시
3. **세션 관리**: Cookie 기반 인증 시스템
4. **AI 추천 알고리즘**: 3가지 추천 방식 Hybrid 접근
5. **외부 API 연동**: YouTube, Google Maps API
6. **배포 환경 구축**: Cloudflare Tunnel, EXE 패키징

## 📝 라이센스

이 프로젝트는 산학공동 기술개발 과제로 개발되었습니다.

## 👤 개발자

프로젝트에 대한 문의사항이 있으시면 이슈를 등록해 주세요.

## 📄 추가 문서

상세한 프로젝트 포트폴리오는 `PROJECT_PORTFOLIO.md`를 참조하세요.




















