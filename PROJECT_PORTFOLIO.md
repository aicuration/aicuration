# 광주 관광 앱 프로젝트 포트폴리오

## 📋 프로젝트 개요

**프로젝트명**: 지역관광 특화 AI 큐레이션 플랫폼  
**영문명**: Localized Tourism AI Curation System Development  
**프로젝트 유형**: 산학공동 기술개발 과제 (Full-Stack Web Application)  
**개발 기간**: 2025년  
**개발 인원**: 1명  
**개발 역할**: 풀스택 개발자 (Frontend + Backend + Database + Deployment)  
**GitHub 저장소**: [https://github.com/sibasdeagal/GwangjuTourApp](https://github.com/sibasdeagal/GwangjuTourApp)  
**개발 환경**: 
  - OS: Windows 10
  - Language: Python 3.13, JavaScript (ES6+), SQL
  - Frontend: React 19.1.1, Create React App 5.0.1
  - Backend: FastAPI 0.104.1, Flask, Uvicorn 0.24.0
  - Database: SQLite 3
  - IDE: Visual Studio Code / Cursor
  - Version Control: Git
**배포 환경**: 로컬 네트워크 + Cloudflare Tunnel  
**프로젝트 규모**: 160개 관광지, 8가지 테마, 20개 이상의 API 엔드포인트

---

## 🎯 프로젝트 목표

### 연구개발 목표
광주지역 관광자원을 기반으로 **AI 기반 맞춤형 관광 루트 추천 시스템**을 포함한 스마트관광 플랫폼을 개발하여, 지역 관광산업의 **디지털 전환**을 실현하고 데이터 기반 정책 수립을 지원하는 것이 목표입니다.

### 인력양성 목표
관광·ICT 융합형 현장 실무 인재를 양성하고, 플랫폼 설계·운영·분석 역량을 갖춘 지역 전문인력을 배출하는 것을 목표로 합니다.

### 해결하고자 하는 문제
1. **정보 접근성**: 분산된 관광 정보를 한 곳에서 제공
2. **개인화**: 사용자 취향에 맞는 맞춤형 AI 기반 루트 추천
3. **효율성**: 최적화된 관광 경로 제안으로 시간 절약
4. **데이터 기반 정책**: 사용자 행동 데이터 수집 및 분석을 통한 정책 수립 지원
5. **지역 관광 활성화**: 스마트관광 도시모델 실현을 통한 지역 관광산업 발전

---

## 🏗 시스템 아키텍처

### 전체 시스템 구성

```
┌─────────────────────────────────────────────────────────────────────┐
│                         클라이언트 레이어                            │
│                         (React Frontend)                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │   홈 화면        │  │   예약 화면      │  │   관광지 화면    │  │
│  │  - 관광지 목록    │  │  - 투어 선택     │  │  - 테마별 필터   │  │
│  │  - 테마 필터     │  │  - 투어 상세     │  │  - 루트 생성     │  │
│  │  - AI 추천       │  │  - 예약 링크     │  │  - 관광지 선택   │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │   지도 화면      │  │   프로필 페이지  │  │  관광지 상세     │  │
│  │  - Google Maps  │  │  - 내 루트 목록   │  │  - 이미지/비디오  │  │
│  │  - 마커 표시    │  │  - 통계 정보      │  │  - 위치 정보     │  │
│  │  - 경로 표시    │  │  - 사용자 정보    │  │  - 루트 추가     │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ↓ HTTPS (포트 5000)
┌─────────────────────────────────────────────────────────────────────┐
│                      프록시 레이어                                   │
│                      (Flask Server)                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  프록시 서버 (Port 5000)                                     │  │
│  │  - 정적 파일 서빙 (React build)                              │  │
│  │  - 요청 라우팅                                               │  │
│  │  - Cookie 세션 관리                                          │  │
│  │  - 설문조사 저장                                             │  │
│  │  - 관리자 통계                                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ↓                         ↓
┌──────────────────────────┐    ┌──────────────────────────┐
│    API 레이어            │    │   설문조사/관리자        │
│  (FastAPI Server)        │    │   (Flask 내장)           │
│  Port 8000               │    │                          │
│  ┌────────────────────┐  │    │  ┌────────────────────┐  │
│  │ 인증 API           │  │    │  │ 설문조사 저장      │  │
│  │ - 회원가입         │  │    │  │ 관리자 통계        │  │
│  │ - 로그인           │  │    │  │ 세션 관리          │  │
│  └────────────────────┘  │    │  └────────────────────┘  │
│  ┌────────────────────┐  │    └──────────────────────────┘
│  │ 관광지 API         │  │
│  │ - 목록 조회        │  │
│  │ - 상세 정보        │  │
│  │ - 테마 필터        │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ 루트 API           │  │
│  │ - 생성/수정/삭제   │  │
│  │ - 중복 체크        │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ AI 추천 API        │  │
│  │ - Demographic      │  │
│  │ - Collaborative    │  │
│  │ - Content-Based    │  │
│  │ - Hybrid           │  │
│  └────────────────────┘  │
└──────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      데이터 레이어                                   │
│                      (SQLite Database)                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   spots      │  │   themes     │  │   users      │             │
│  │   (160개)    │  │   (8개)      │  │              │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ user_routes  │  │ route_spots  │  │survey_res    │             │
│  │              │  │              │  │              │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
```

### 레이어별 상세 설명

#### 1. 클라이언트 레이어 (Frontend)
- **기술**: React 19.1.1, JavaScript ES6+, CSS3
- **역할**: 사용자 인터페이스 및 상호작용
- **주요 컴포넌트**:
  - `App.js`: 메인 앱 컴포넌트 (라우팅, 상태 관리)
  - `HomeScreen.js`: 관광지 목록, 검색, 테마 필터
  - `MapScreen.js`: Google Maps 지도 표시
  - `AIRecommendationComponent.js`: AI 추천 결과 표시
- **통신 방식**: Fetch API / Axios를 통한 RESTful API 호출
- **빌드**: `react-scripts build` → 정적 파일 생성

#### 2. 프록시 레이어 (Flask Server)
- **기술**: Flask, Python
- **포트**: 5000
- **역할**:
  1. 정적 파일 서빙 (React build 결과물)
  2. FastAPI로의 프록시 요청 라우팅
  3. 설문조사 데이터 저장
  4. 관리자 통계 대시보드
- **Cookie 관리**: 세션 쿠키를 FastAPI로 전달
- **CORS**: Cross-Origin 요청 처리

#### 3. API 레이어 (FastAPI Server)
- **기술**: FastAPI, SQLAlchemy, Python
- **포트**: 8000
- **역할**:
  1. 인증 관리 (회원가입, 로그인, 세션)
  2. 관광지 데이터 CRUD
  3. 루트 생성 및 관리
  4. AI 추천 알고리즘 실행
- **특징**:
  - 비동기 처리 (async/await)
  - 자동 API 문서화 (Swagger)
  - 예외 처리 및 로깅
- **AI 추천 시스템**:
  - Demographic Filtering
  - Collaborative Filtering (Cosine Similarity)
  - Content-Based Filtering
  - Hybrid Approach

#### 4. 데이터 레이어 (SQLite Database)
- **기술**: SQLite 3, SQLAlchemy ORM
- **역할**: 데이터 영구 저장 및 관리
- **주요 테이블**:
  - `spots`: 160개 관광지 정보
  - `themes`: 8개 테마 정보
  - `users`: 사용자 정보
  - `user_routes`: 사용자 생성 루트
  - `route_spots`: 루트-관광지 매핑
  - `survey_responses`: 설문조사 응답
- **관계**: 외래 키 제약 조건으로 데이터 무결성 보장

### 데이터 흐름 (Request Flow)

#### 예시 1: 사용자 로그인
```
1. 사용자가 로그인 폼 입력
2. React → Flask (POST /api/auth/login)
3. Flask → FastAPI (Proxy 요청)
4. FastAPI → SQLite (사용자 조회)
5. bcrypt로 비밀번호 검증
6. 세션 ID 생성 → Cookie 설정
7. FastAPI → Flask → React (성공 응답)
```

#### 예시 2: AI 추천 루트 조회
```
1. 사용자가 추천 루트 버튼 클릭
2. React → Flask (GET /api/ai/recommendations/routes)
3. Flask → FastAPI (Proxy 요청)
4. FastAPI → SQLite (사용자 행동 데이터 조회)
5. AI 알고리즘 실행:
   - Demographic Filtering
   - Collaborative Filtering
   - Content-Based Filtering
   - Hybrid 추천 점수 계산
6. 추천 루트 반환 → React 표시
```

#### 예시 3: Google Maps 경로 표시
```
1. 사용자가 루트 선택
2. React에서 Google Maps API 호출
3. Google Maps Directions Service 사용
4. 실시간 도로 경로 계산
5. 마커 및 경로 렌더링
```

### 외부 서비스 통합

#### Google Maps API
- **역할**: 지도 표시, 마커, 경로 계산
- **통합 방식**: 클라이언트 사이드 직접 호출
- **라이브러리**: `@googlemaps/js-api-loader`

#### YouTube API
- **역할**: 관광지 소개 영상 표시
- **통합 방식**: iframe 임베드
- **설정**: 자동재생, 음소거

### 보안 아키텍처

#### 인증 및 세션 관리
```
사용자 로그인
    ↓
FastAPI: bcrypt 비밀번호 검증
    ↓
세션 ID 생성 → HTTPOnly Cookie
    ↓
Flask 프록시: Cookie 전달
    ↓
FastAPI: 세션 검증 → 사용자 정보 반환
```

#### SQL Injection 방지
- 파라미터화된 쿼리 사용
- SQLAlchemy ORM 활용
- 입력값 유효성 검사

#### XSS 방지
- HTTPOnly Cookie 사용
- React의 자동 이스케이핑
- 사용자 입력 sanitization

### 배포 아키텍처

#### 로컬 네트워크 배포
```
Windows Server
    ↓
[Flask + FastAPI] → [SQLite DB]
    ↓
클라이언트 브라우저 접속
```

#### Cloudflare Tunnel 배포
```
Windows Server
    ↓
[Flask + FastAPI] → [SQLite DB]
    ↓
cloudflared.exe
    ↓
Cloudflare Tunnel
    ↓
공개 URL: https://xxx.trycloudflare.com
    ↓
원격 클라이언트 접속
```

---

## ✨ 주요 기능

### 1. 관광지 정보 조회 (160개 관광지)

#### 테마별 분류 시스템
- **8가지 테마**로 160개 관광지를 체계적으로 분류
  - 🛍️ 쇼핑 테마 (20개): 지하상가, 백화점, 아울렛, 시장
  - 🏛️ 역사 테마 (20개): 기념관, 박물관, 유적지, 서원
  - 🎨 문화 테마 (20개): 미술관, 갤러리, 공연장, 문화공간
  - 🍽️ 음식 테마 (20개): 맛집거리, 시장, 특색 음식점
  - 🌲 자연 테마 (20개): 공원, 산, 호수, 생태원
  - 🎪 체험 테마 (20개): 체험 프로그램, 워크숍, 전통 활동
  - 🏨 숙박 테마 (20개): 호텔, 리조트, 게스트하우스
  - 🌄 근교 테마 (20개): 광주 인근 지역 관광지 (담양, 나주, 화순 등)

#### 관광지 상세 정보
- **기본 정보**
  - 관광지명, 상세 설명 (평균 500자 이상)
  - 주소 (전체 주소 + 도로명 주소)
  - GPS 좌표 (위도, 경도) - Google Maps 연동용
  - 운영시간 및 휴무일
  - 연락처 (전화번호)
- **미디어 콘텐츠**
  - 대표 이미지 (각 관광지당 1~3장)
  - YouTube 동영상 임베드 (관광지 소개 영상)
  - 이미지 갤러리 기능
- **추가 기능**
  - 테마별 필터링
  - 검색 기능 (관광지명 검색)
  - 관광지별 테마 색상 적용

### 2. 사용자 인증 시스템

#### 회원가입 기능
- **입력 항목**
  - 사용자명 (username)
  - 이메일 (email)
  - 비밀번호 (password)
- **보안 기능**
  - bcrypt를 이용한 비밀번호 해싱
  - 이메일 중복 확인
  - SQL Injection 방지 (파라미터화된 쿼리)
- **에러 핸들링**
  - 중복 이메일/사용자명 처리
  - 입력값 유효성 검사

#### 로그인 기능
- **일반 로그인**
  - 이메일/비밀번호로 사용자 인증
  - bcrypt로 해시된 비밀번호 검증
  - 세션 ID 생성 및 쿠키 설정
- **Google 간편 로그인**
  - Google Identity Services (GIS) 통합
  - OAuth 2.0 기반 인증
  - Google ID 토큰 검증 (`google-auth`, `google.oauth2.id_token`)
  - 자동 회원가입 (Google 계정으로 첫 로그인 시)
  - `google_id` 컬럼으로 Google 계정 연결
  - `password_hash` nullable 처리 (Google 로그인 사용자 지원)
- **세션 관리**
  - HTTPOnly 쿠키 사용 (XSS 공격 방지)
  - 세션 스토어에 사용자 ID 저장
  - 로그아웃 시 세션 삭제
  - Cross-Origin-Opener-Policy (COOP) 설정
- **보안**
  - SameSite 쿠키 설정
  - 세션 만료 시간 관리
  - Google 클라이언트 ID 환경변수 관리

#### 프로필 관리
- **프로필 정보**
  - 사용자명, 이메일
  - 가입일시 (날짜 포맷팅)
  - 저장된 루트 개수
  - 방문한 관광지 개수
- **내가 만든 루트 섹션**
  - 사용자가 생성한 모든 루트 목록 표시
  - 루트 이름, 생성일, 예상 소요시간, 총 거리 표시
  - 루트 편집 기능 (관광지 추가/삭제/순서 변경)
  - 루트 삭제 기능
  - 루트 상세 정보 조회
- **통계 정보**
  - 총 루트 개수
  - 방문한 관광지 개수
  - 테마별 방문 통계

### 3. 루트 생성 및 관리

#### 루트 생성
- **관광지 선택**
  - 테마별 필터링된 목록에서 선택
  - 여러 관광지 선택 가능
  - 중복 추가 방지 (같은 관광지 재선택 불가)
  - 함수형 상태 업데이트로 일관성 보장
- **루트 정보 입력**
  - 루트 이름 지정
  - 루트 설명 (선택사항)
  - 생성일시 자동 저장 (`created_at`)
- **거리 및 시간 계산**
  - Haversine 공식을 이용한 직선 거리 계산
  - Google Maps Directions Service를 통한 실제 도로 거리 계산
  - 관광지 간 예상 소요시간 계산 (도보/자전거/자동차)
  - 총 거리 및 총 소요시간 표시
- **중복 방지**
  - 프론트엔드: 선택 단계에서 중복 체크
  - 백엔드: 저장 전 중복 제거 로직
  - 데이터베이스: `route_spots` 테이블에 UNIQUE 제약조건 (`route_id`, `spot_id`)
  - 동일한 이름의 루트가 있는지 확인
  - 동일한 관광지 조합의 루트가 있는지 확인
- **저장**
  - 데이터베이스에 루트 정보 저장
  - 기존 `route_spots` 데이터 삭제 후 재삽입 (중복 방지)
  - 관광지 순서 정보 저장 (`spot_order`)
  - 사용자 ID와 연결
  - 생성일시 자동 기록

#### 루트 관리
- **루트 목록 조회**
  - 내가 만든 모든 루트 목록
  - 생성일순 정렬
  - 루트명, 생성일, 총 거리, 소요시간 표시
  - 중복 제거 로직 적용 (데이터베이스 레벨)
- **루트 상세 조회**
  - 루트에 포함된 관광지 목록
  - 순서별로 표시 (`spot_order` 기준 정렬)
  - 각 관광지의 상세 정보
  - 중복 관광지 자동 제거
- **루트 수정**
  - 루트 이름 변경
  - 관광지 추가/삭제
  - 순서 변경 (위/아래 이동)
  - 변경사항 저장
  - 낙관적 업데이트 (Optimistic Update)로 즉시 UI 반영
- **루트 삭제**
  - 루트 삭제 확인
  - CASCADE로 관련 데이터 삭제
  - 삭제 후 목록 갱신
  - 지도에서 표시 중인 루트 삭제 시 지도 초기화

#### 지도 연동
- **Google Maps 표시**
  - Google Maps JavaScript API 사용
  - 선택한 관광지 마커 표시
  - 마커 클릭 이벤트
  - 지도 중심 자동 이동
- **경로 표시**
  - Directions Service를 이용한 경로 그리기
  - 관광지 간 경로 라인 표시
  - 실시간 도로 거리 계산
- **커스텀 설정**
  - 관광지 POI 라벨 숨김
  - 커스텀 스타일 적용

### 4. AI 기반 추천 시스템

#### 추천 알고리즘 개요
세 가지 추천 방식(Demographic Filtering, 협업 필터링, 콘텐츠 기반)을 조합한 하이브리드 추천 시스템 구현

#### 1) 사용자 행동 분석
```python
# 사용자의 루트 패턴 분석
- 루트 길이 패턴 (몇 개의 관광지를 선호하는지)
- 테마 조합 패턴 (어떤 테마 조합을 선호하는지)
- 시간대별 패턴 (언제 루트를 만드는지)
- 관광지 방문 순서 패턴

# 테마별 선호도 분석
- 각 테마의 방문 빈도
- 테마별 평균 방문 순서
- 선호도 점수 계산
```

#### 2) 협업 필터링 (Collaborative Filtering)
```python
# 유사 사용자 찾기
- 코사인 유사도(Cosine Similarity) 계산
- 테마 선호도 기반 유사도 측정
- 유사도 임계값(0.3) 이상인 사용자 추출
- 상위 10명의 유사 사용자 선정

# 추천 생성
- 유사 사용자가 방문한 관광지 수집
- 유사도 점수를 가중치로 사용
- 협업 필터링 점수 계산
```

#### 3) 콘텐츠 기반 필터링 (Content-Based Filtering)
```python
# 관광지 특성 분석
- 테마 일치도 점수
- 선호 테마 기반 점수
- 콘텐츠 기반 점수 계산

# 점수 계산
- 기준 관광지와 동일 테마: 100점
- 선호 테마: 80점
- 그 외: 50점
```

#### 4) 하이브리드 추천
```python
# 최종 점수 계산
hybrid_score = (collaborative_score * 0.6) + (content_score * 0.4)

# 협업 필터링 60% + 콘텐츠 기반 40%
# 가중치 조절을 통한 추천 품질 최적화
```

#### 추천 결과
- **추천 루트 생성**
  - 3~5개의 맞춤형 루트 추천
  - 각 루트의 추천 점수 표시
  - 추천 근거 설명
- **동적 업데이트**
  - 사용자가 루트를 추가할 때마다 학습
  - 실시간 추천 모델 업데이트

### 5. 설문조사 시스템

#### 설문 항목
- **전체 만족도**: 1~5점 척도
- **디자인 평가**: 1~5점 척도
- **기능성 평가**: 1~5점 척도
- **콘텐츠 품질 평가**: 1~5점 척도
- **네비게이션 평가**: 1~5점 척도
- **선호하는 기능**: 다중 선택 (체크박스)
- **개선 사항**: 자유 입력
- **추천 의향**: 예/아니오
- **추가 의견**: 자유 입력

#### 세션 관리
- 로컬 스토리지를 통한 세션 ID 관리
- 중복 제출 방지
- 응답 수정 기능
- UPSERT 방식으로 저장 (같은 세션 ID면 업데이트)

#### 관리자 통계 대시보드
- **전체 응답 수**
- **만족도 분포**: 항목별 점수 분포 그래프
- **평가 통계**: 디자인, 기능성, 콘텐츠, 네비게이션 항목별 통계
- **최근 응답**: 최근 10개 응답 확인
- **개선 사항 요약**: 사용자가 입력한 개선 사항 목록
- **인증 시스템**: 개발자 토큰 기반 인증

---

## 🛠 기술 스택

### Frontend
- **React.js** (19.1.1)
  - **역할**: 사용자 인터페이스 구현
  - 함수형 컴포넌트로 모듈화된 UI 개발
  - Hooks (useState, useEffect, useRef, forwardRef)
  - Context API
  - 비동기 데이터 페칭
  - **react-scripts** (5.0.1) - Create React App 기반
- **JavaScript (ES6+)**
  - **역할**: 프론트엔드 로직 및 비즈니스 로직 구현
  - Arrow Functions
  - Async/Await
  - Destructuring
  - Template Literals
  - Spread Operator
- **CSS3**
  - **역할**: UI 스타일링 및 레이아웃 디자인
  - Flexbox Layout
  - Grid Layout
  - Media Queries (반응형 디자인)
  - CSS Variables
  - Transitions & Animations
- **Fetch API / Axios**
  - **역할**: 백엔드 API와 통신
  - RESTful API 통신
  - Credentials: 'include' (쿠키 전달)
  - Error Handling
  - Axios 1.11.0 (HTTP 클라이언트 라이브러리)
- **Toast Notification 시스템**
  - **역할**: 사용자 알림 메시지 표시
  - 브라우저 `alert()` 대체
  - 커스텀 Toast 컴포넌트 구현
  - 타입별 스타일 (success, error, info, warning)
  - 자동 사라짐 (3초 후)
  - 수동 닫기 기능
- **YouTube API**
  - **역할**: 관광지 소개 영상 표시
  - iframe 임베드
  - 자동 재생, 음소거 설정
- **Google Maps API**
  - **역할**: 지도 표시 및 경로 시각화
  - `@googlemaps/js-api-loader` (1.16.10) 사용
  - JavaScript API 사용
  - 마커 표시 및 클릭 이벤트
  - 경로 표시 (Directions Service)
  - 실시간 도로 거리 계산
  - 커스텀 스타일 적용
- **Google Identity Services (GIS)**
  - **역할**: Google 간편 로그인
  - OAuth 2.0 기반 인증
  - Google ID 토큰 검증
  - `https://accounts.google.com/gsi/client` 스크립트 로드
  - 환경변수로 클라이언트 ID 관리 (`REACT_APP_GOOGLE_CLIENT_ID`)

### Backend
- **FastAPI** (Python 3.9+)
  - **역할**: RESTful API 서버, 비즈니스 로직 처리
  - 비동기 프로그래밍 (async/await)
  - 의존성 주입 (Dependency Injection)
  - 자동 API 문서 생성 (Swagger)
  - CORS 미들웨어
  - 예외 처리 (Exception Handler)
  - **주요 엔드포인트**:
    - `/api/auth/*` - 인증 관련
    - `/api/profile` - 프로필 조회
    - `/api/routes` - 루트 CRUD
    - `/api/ai/recommendations/*` - AI 추천
  - **포트**: 8000
- **Flask** (Python 3.9+)
  - **역할**: 프록시 서버 및 정적 파일 서빙
  - 프록시 서버 역할 (FastAPI로 요청 전달)
  - 정적 파일 서빙 (React 빌드 파일)
  - CORS 처리
  - **주요 엔드포인트**:
    - `/api/surveys` - 설문조사 저장
    - `/api/admin/*` - 관리자 통계
    - 프록시 라우트 (모든 `/api/*` → FastAPI로 전달)
  - **포트**: 5000
- **Python 라이브러리**
  - `fastapi` (0.104.1) - FastAPI 프레임워크
  - `uvicorn` (0.24.0) - ASGI 서버
  - `sqlalchemy` (2.0.23) - ORM
  - `bcrypt` - 비밀번호 해싱 (passlib 내장)
  - `passlib` (1.7.4) - 비밀번호 관리
  - `python-jose` (3.3.0) - JWT 토큰 (향후 확장용)
  - `python-multipart` (0.0.6) - 멀티파트 폼 데이터
  - `requests` (2.31.0) - HTTP 클라이언트
  - `flask` (3.0.0) - Flask 프레임워크
  - `flask-cors` (4.0.0) - CORS 처리
  - `google-auth` (2.23.4) - Google 인증 라이브러리
  - `google.oauth2.id_token` - Google ID 토큰 검증
  - `python-dotenv` (1.0.0) - 환경변수 관리

### Database
- **SQLite 3**
  - **역할**: 데이터 영구 저장 및 관리
  - 파일 기반 관계형 데이터베이스
  - ACID 트랜잭션 지원
  - **주요 테이블**:
    - `spots` (160개 관광지 정보)
    - `themes` (8개 테마 정보)
    - `users` (사용자 정보)
    - `user_routes` (사용자 루트)
    - `route_spots` (루트-관광지 연결)
    - `survey_responses` (설문조사 응답)
  - **인덱스**: PRIMARY KEY, FOREIGN KEY
  - **제약조건**: NOT NULL, UNIQUE, CASCADE

### Deployment & Tools
- **Cloudflare Tunnel**
  - **역할**: 원격 접속을 위한 터널링
  - `cloudflared.exe` 사용
  - HTTPS 지원
  - 동적 URL 생성
  - TCP 터널링
- **Windows Batch Script**
  - **역할**: 서버 자동 실행 및 환경 설정
  - `start_app.bat` - 자동 서버 실행
  - 방화벽 포트 개방
  - IP 주소 표시
  - 브라우저 자동 열기
- **PyInstaller**
  - **역할**: 실행 파일 패키징
  - EXE 파일 패키징
  - 단일 파일 생성
  - 자동 의존성 포함
- **Git**
  - **역할**: 소스 코드 버전 관리
  - 버전 관리
  - 커밋 히스토리 관리

---

## 📁 프로젝트 구조

```
GwangjuTourApp/
│
├── frontend/                          # React 프론트엔드
│   ├── build/                         # React 빌드 결과물
│   │   ├── static/                    # CSS, JS 번들
│   │   ├── images/                    # 이미지 파일
│   │   └── index.html                 # 엔트리 HTML
│   │
│   ├── public/                        # 정적 파일
│   │   ├── images/                    # 관광지 이미지 (160개)
│   │   │   ├── 5.18_memorial_park.jpg
│   │   │   ├── art_street.jpg
│   │   │   └── ... (160개 파일)
│   │   └── index.html                 # HTML 템플릿 (Google GIS 스크립트 포함)
│   │
│   └── src/                           # 소스 코드
│       ├── App.js                     # 메인 앱 컴포넌트 (3386줄)
│       │   ├── State 관리
│       │   ├── 데이터 페칭
│       │   ├── 이미지/비디오 매핑
│       │   ├── 라우팅 로직
│       │   ├── Toast Notification 관리
│       │   └── Google 로그인 처리
│       │
│       ├── HomeScreen.js              # 홈 화면 컴포넌트
│       │   ├── 관광지 그리드 표시
│       │   ├── 테마 필터링
│       │   ├── 검색 기능
│       │   └── AI 추천 표시
│       │
│       ├── ProfilePage.js             # 프로필 페이지
│       │   ├── 사용자 정보 표시
│       │   ├── 내가 만든 루트 목록
│       │   ├── 루트 편집 기능
│       │   └── 통계 정보
│       │
│       ├── AuthPage.js                # 로그인/회원가입 페이지
│       │   ├── 일반 로그인/회원가입
│       │   ├── Google 로그인 통합
│       │   └── Google Identity Services 초기화
│       │
│       ├── MapScreen.js               # 지도 화면
│       │   ├── Google Maps 연동
│       │   ├── 마커 표시
│       │   └── 경로 표시
│       │
│       ├── GoogleMapsComponent.js     # Google Maps 컴포넌트 (636줄)
│       │   ├── Directions Service
│       │   ├── 마커 관리
│       │   └── 경로 렌더링
│       │
│       ├── SurveyPage.js              # 설문조사 페이지
│       │   ├── 설문 항목 입력
│       │   ├── 유효성 검사
│       │   └── 제출 처리
│       │
│       ├── AIRecommendationComponent.js  # AI 추천 컴포넌트
│       │   ├── 추천 루트 표시
│       │   ├── 추천 점수
│       │   └── 루트 상세 정보
│       │
│       ├── Toast.js                   # Toast Notification 컴포넌트
│       │   ├── 타입별 스타일
│       │   ├── 자동 사라짐
│       │   └── 수동 닫기
│       │
│       ├── Toast.css                  # Toast 스타일시트
│       │   ├── 애니메이션
│       │   └── 반응형 디자인
│       │
│       ├── CommonHeader.js            # 공통 헤더
│       │   ├── 네비게이션 바
│       │   └── 로그인 상태 표시
│       │
│       ├── App.css                    # 스타일시트 (7444줄)
│       │   ├── 공통 스타일
│       │   ├── 컴포넌트별 스타일
│       │   ├── 반응형 디자인
│       │   └── Google 로그인 버튼 스타일
│       │
│       ├── .env                       # 환경변수
│       │   └── REACT_APP_GOOGLE_CLIENT_ID
│       │
│       └── package.json               # 의존성 관리
│           ├── react, react-dom
│           └── build scripts
│
├── backend/                           # Python 백엔드
│   ├── main.py                        # FastAPI 서버 (1768줄)
│   │   ├── /api/auth/*                # 인증 엔드포인트
│   │   │   ├── /api/auth/login        # 일반 로그인
│   │   │   ├── /api/auth/register     # 회원가입
│   │   │   ├── /api/auth/google       # Google 로그인
│   │   │   └── /api/auth/logout       # 로그아웃
│   │   ├── /api/profile               # 프로필 엔드포인트
│   │   ├── /api/routes                # 루트 CRUD
│   │   │   ├── 중복 방지 로직
│   │   │   └── created_at 자동 설정
│   │   ├── /api/ai/recommendations/*  # AI 추천
│   │   ├── 협업 필터링 로직
│   │   ├── 콘텐츠 기반 필터링 로직
│   │   └── 하이브리드 추천 로직
│   │
│   ├── app.py                         # Flask 프록시 서버 (391줄)
│   │   ├── /api/surveys               # 설문조사 저장
│   │   ├── /api/admin/*               # 관리자 통계
│   │   ├── 프록시 라우팅
│   │   ├── 정적 파일 서빙
│   │   ├── CORS 설정
│   │   └── Cross-Origin-Opener-Policy 설정
│   │
│   ├── database.py                    # DB 연결 설정
│   │   ├── SQLite 연결
│   │   ├── get_db() 함수
│   │   └── CORS 설정
│   │
│   ├── models.py                      # SQLAlchemy 모델
│   │   ├── 테이블 정의
│   │   └── 관계 정의
│   │
│   ├── gwangju_tour.db                # SQLite 데이터베이스
│   │   └── 160개 관광지 데이터
│   │
│   ├── requirements.txt               # Python 패키지
│   │   ├── fastapi, uvicorn
│   │   ├── flask (3.0.0), flask-cors (4.0.0)
│   │   ├── sqlalchemy
│   │   ├── bcrypt, requests
│   │   ├── google-auth (2.23.4)
│   │   └── python-dotenv (1.0.0)
│   │
│   └── cloudflared.exe                # Cloudflare Tunnel 실행 파일
│
├── package.json                       # Electron 설정
│   ├── electron, electron-builder
│   └── 빌드 스크립트
│
├── electron.js                        # Electron 메인 프로세스 (선택사항)
│   └── 데스크톱 앱 래퍼
│
├── create_cloudflare_exe.py           # EXE 생성 스크립트
│   ├── Cloudflare URL 업데이트
│   ├── open_cloudflare_tunnel.py 생성
│   └── PyInstaller로 EXE 패키징
│
├── open_cloudflare_tunnel.py          # 터널 실행 스크립트
│   └── 웹 브라우저로 URL 열기
│
├── backend/
│   └── open_cloudflare_tunnel.py      # 백엔드용 터널 실행 스크립트
│
├── export_to_csv.py                   # 데이터 내보내기
│   └── 관광지 정보 CSV 파일 생성
│
└── PROJECT_PORTFOLIO.md               # 포트폴리오 문서
```

---

## 🔑 핵심 구현 내용

### 1. 데이터베이스 설계

#### ERD (Entity-Relationship Diagram)
```
Users (1) ────┬───(N) User_Routes
              │
              └───(N) Survey_Responses

User_Routes (1) ────(N) Route_Spots (N) ────(1) Spots (N) ────(1) Themes
```

#### 테이블 스키마

**spots** (관광지)
```sql
CREATE TABLE spots (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    theme_id INTEGER NOT NULL,
    description TEXT,
    address TEXT,
    latitude REAL,
    longitude REAL,
    image_url TEXT,
    operating_hours TEXT,
    contact_info TEXT,
    FOREIGN KEY (theme_id) REFERENCES themes(id)
);
-- 인덱스: theme_id (테마별 조회 성능 향상)
```

**themes** (테마)
```sql
CREATE TABLE themes (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon_name TEXT,
    color_code TEXT
);
-- 8개 테마 데이터
```

**users** (사용자)
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash VARCHAR(255),  -- nullable (Google 로그인 사용자용)
    google_id TEXT,              -- Google 계정 ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(google_id) WHERE google_id IS NOT NULL
);
-- 인덱스: email (로그인 성능 향상)
-- 인덱스: google_id (Google 로그인 성능 향상)
```

**user_routes** (사용자 루트)
```sql
CREATE TABLE user_routes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    estimated_time TEXT,  -- "50분 (도보)" 형식
    total_distance REAL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,  -- 명시적 설정 (NULL 방지)
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- 인덱스: user_id (사용자별 조회 성능 향상)
-- 인덱스: created_at (정렬 성능 향상)
```

**route_spots** (루트-관광지 연결)
```sql
CREATE TABLE route_spots (
    route_id INTEGER NOT NULL,
    spot_id INTEGER NOT NULL,
    spot_order INTEGER NOT NULL,
    PRIMARY KEY (route_id, spot_id),
    FOREIGN KEY (route_id) REFERENCES user_routes(id) ON DELETE CASCADE,
    FOREIGN KEY (spot_id) REFERENCES spots(id),
    UNIQUE(route_id, spot_id)  -- 중복 방지
);
-- 복합 인덱스: (route_id, spot_order) - 순서 조회 최적화
-- UNIQUE 제약조건: 동일 루트에 같은 관광지 중복 저장 방지
```

**survey_responses** (설문조사 응답)
```sql
CREATE TABLE survey_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    session_id TEXT NOT NULL,
    responses TEXT NOT NULL,  -- JSON 형식
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 인덱스: session_id (세션 기반 조회)
```

### 2. 세션 기반 인증
- 로그인 시 세션 ID 생성 및 쿠키 저장
- 세션 스토어를 통한 사용자 상태 관리
- HTTPOnly 쿠키로 보안 강화

### 3. AI 추천 알고리즘
- **사용자 행동 분석**
  - 루트 패턴 분석
  - 테마별 선호도 추출
  - 시간대별 활동 패턴
- **협업 필터링**
  - 코사인 유사도 기반 유사 사용자 찾기
  - 유사 사용자의 선호 관광지 추천
- **콘텐츠 기반 필터링**
  - 테마 일치도 기반 추천
  - 거리 기반 추천

### 4. 프록시 서버 아키텍처
```
클라이언트 → Flask (5000) → FastAPI (8000)
                ↓
            정적 파일 서빙
```
- Flask를 통한 API 라우팅
- 정적 파일 직접 서빙으로 성능 최적화
- CORS 처리 및 쿠키 전달

---

## 🚀 배포 방식

### 1. 로컬 네트워크 배포
- Windows Batch Script로 Flask + FastAPI 동시 실행
- 방화벽 포트 개방 자동화
- 로컬 IP 주소로 접속 가능

### 2. Cloudflare Tunnel 배포
- 원격 접속을 위한 터널링
- HTTPS 지원
- 동적 URL 생성
- EXE 파일로 Cloudflare URL 업데이트 자동화
- `cloudflared.exe tunnel --url http://localhost:5000` 명령어로 터널 실행

### 3. EXE 파일 패키징
- 자동 서버 실행 스크립트 포함
- 배포폴더 방식으로 파일 구성
- 단일 실행 파일로 간편 배포

---

## 📊 프로젝트 통계

- **총 관광지 수**: 160개
- **테마 수**: 8개
- **API 엔드포인트**: 20개 이상
- **데이터베이스 테이블**: 10개 이상
- **프론트엔드 컴포넌트**: 10개 이상
- **인증 방식**: 일반 로그인 + Google 간편 로그인
- **UI 컴포넌트**: Toast Notification 시스템
- **중복 방지**: 데이터베이스 UNIQUE 제약조건 + 애플리케이션 레벨 검증

---

## 🎨 주요 화면 구성

### 하단 네비게이션 바
- **홈**: 홈 화면으로 이동
- **예약**: 투어 선택 페이지로 이동 (`TourSelectionPage`)
- **관광지**: 관광지 목록 및 루트 생성 페이지
- **지도**: Google Maps 지도 및 루트 시각화
- **프로필**: 사용자 프로필 및 내 루트 관리

### 홈 화면
- 카테고리별 관광지 그리드 표시
- 테마별 필터링
- 검색 기능
- 인기 관광지 추천
- AI 추천 루트 표시

### 로그인/회원가입 화면
- 일반 로그인/회원가입
  - 이메일, 비밀번호 입력
  - 사용자명 입력 (회원가입 시)
- Google 간편 로그인
  - Google Identity Services 버튼
  - OAuth 2.0 인증
  - 자동 회원가입
- Toast Notification으로 에러/성공 메시지 표시

### 관광지 상세 화면
- 대표 이미지 (여러 장)
- YouTube 동영상 임베드
- 위치 정보
- 루트에 추가 기능

### 관광지 화면 (루트 생성)
- 테마별 관광지 그리드 표시
- 관광지 선택 및 루트에 추가
- 선택된 관광지 목록 표시
- 루트 만들기 버튼
- 관광지 상세 정보 모달

### 지도 화면
- Google Maps JavaScript API 연동
- 저장된 루트 목록 표시
- 루트 선택 및 지도에 표시
- 관광지 마커 표시
- 루트 경로 표시 (Directions Service)
- 실시간 도로 거리 계산
- 루트 정보 카드 (거리, 시간, 관광지 개수)

### 프로필 화면
- 사용자 정보
  - 사용자명, 이메일
  - 가입일 (날짜 포맷팅)
- 내가 만든 루트 섹션
  - 루트 목록 (생성일, 예상 소요시간, 총 거리)
  - 루트 편집 기능
  - 루트 삭제 기능
  - 루트 상세 조회
- AI 추천 루트
- 통계 정보
  - 총 루트 개수
  - 방문한 관광지 개수

### 설문조사 화면
- 만족도 평가
- 기능 평가
- 개선사항 피드백

### 사이드바 네비게이션
- **로그인 상태**:
  - 마이 페이지
  - 설문조사
  - 로그아웃
  - 환경설정 (사이드바로 이동)
  - 회원 탈퇴
  - 관리자 대시보드
- **비로그인 상태**:
  - 로그인/회원가입

---

## 🔧 주요 기술적 도전 과제

### 1. PostgreSQL → SQLite 마이그레이션
- **문제**: 포트폴리오 배포를 위해 로컬 DB 필요
- **해결**: SQLite로 마이그레이션
- **구현**: SQL 문법 차이 해결 (SERIAL → INTEGER PRIMARY KEY AUTOINCREMENT, JSONB → TEXT, STRING_AGG → GROUP_CONCAT 등)

### 2. 세션 관리 및 쿠키 전달
- **문제**: Cloudflare Tunnel을 통한 요청 시 세션 유지 어려움
- **해결**: Flask 프록시에서 쿠키 명시적 전달
- **구현**: Session 사용 및 Flask의 set_cookie 메서드 활용

### 3. 이미지 매핑 및 관리
- **문제**: 160개 관광지의 이미지 URL 관리
- **해결**: 중앙 집중식 imageMapping 객체
- **구현**: 객체 기반 관리로 유지보수성 향상

### 4. AI 추천 시스템 구현
- **문제**: 사용자별 맞춤 추천 구현
- **해결**: 행동 패턴 분석 + 협업 필터링 + 콘텐츠 기반 하이브리드
- **구현**: 데이터 분석을 통한 선호도 추출

### 5. Google 간편 로그인 구현
- **문제**: OAuth 2.0 기반 Google 로그인 통합
- **해결**: Google Identity Services (GIS) 사용
- **구현**:
  - Google ID 토큰 검증 (`google.oauth2.id_token`)
  - 데이터베이스 스키마 변경 (`google_id` 컬럼 추가, `password_hash` nullable)
  - Cross-Origin-Opener-Policy (COOP) 설정
  - 환경변수로 클라이언트 ID 관리
  - 자동 회원가입 로직

### 6. 루트 생성 중복 방지
- **문제**: 루트 생성 시 관광지 중복 저장 문제
- **해결**: 다층 중복 방지 시스템 구현
- **구현**:
  - 프론트엔드: 함수형 상태 업데이트로 일관성 보장
  - 백엔드: 저장 전 중복 제거 로직
  - 데이터베이스: UNIQUE 제약조건 (`route_id`, `spot_id`)
  - 조회 시 중복 제거 로직

### 7. Toast Notification 시스템 구현
- **문제**: 브라우저 `alert()` 사용으로 인한 사용자 경험 저하
- **해결**: 커스텀 Toast Notification 컴포넌트 구현
- **구현**:
  - React 컴포넌트로 재사용 가능한 Toast 시스템
  - 타입별 스타일 (success, error, info, warning)
  - 자동 사라짐 기능 (3초)
  - 수동 닫기 기능

---

## 📝 보안 고려사항

- **인증 및 권한**
  - 비밀번호 해싱 (bcrypt)
  - HTTPOnly 쿠키 사용 (XSS 공격 방지)
  - 세션 기반 인증
  - Google OAuth 2.0 토큰 검증
- **데이터 보안**
  - SQL Injection 방지 (파라미터화된 쿼리)
  - 입력값 유효성 검사
  - UNIQUE 제약조건으로 데이터 무결성 보장
- **네트워크 보안**
  - CORS 설정
  - Cross-Origin-Opener-Policy (COOP) 설정
  - Secure Cookie 설정 (HTTPS 환경)
  - SameSite 쿠키 설정
- **환경변수 관리**
  - Google 클라이언트 ID 환경변수 관리
  - API 키 보안 관리

---

## 🎓 학습 경험

### 기술 학습
- React.js 상태 관리 및 컴포넌트 설계
- FastAPI 비동기 프로그래밍
- SQLite 데이터베이스 설계 및 쿼리 최적화
- AI 추천 시스템 구현
- 네트워크 프로그래밍 (프록시, 터널링)

### 문제 해결
- 데이터베이스 마이그레이션
- 크로스 도메인 쿠키 관리
- 대용량 이미지 관리
- 사용자 경험 최적화

---

## 🔮 기대 효과 및 활용 방안

### 연구개발 효과
1. **지역 관광 플랫폼의 기술 자립 기반 확보**
   - 수입 API 대체 및 기술이전 가능성 확보
   - 지역 타 도시 확산형 구조 설계

2. **AI 추천 기반 스마트관광 도시모델 실현**
   - 사용자 행동 데이터 기반 맞춤형 추천
   - 지역 관광산업의 디지털 전환

3. **데이터 기반 정책 수립 지원**
   - 사용자 행동 패턴 분석
   - 관광지별 방문 통계
   - 설문조사 데이터 기반 개선사항 도출

### 인력양성 효과
1. **지역 청년의 관광산업 내 디지털 적응력 강화**
   - 관광·ICT 융합형 실무 경험
   - 플랫폼 설계·운영·분석 역량 확보

2. **스마트관광 전문 인력 순환 구조 형성**
   - 지역 기업과의 산학 협력
   - 졸업생 창업/취업 연계 확대

3. **지역 정착 유도**
   - 지역 관광 산업 이해도 제고
   - 실무 능력 향상을 통한 지역 기업 취업 유도

---

## 🔮 향후 개선 방향

### 단기 개선사항
1. **AI 추천 성능 향상**
   - 실시간 추천 시스템 구현
   - Redis 캐싱 도입으로 성능 최적화
   - 머신러닝 모델 연동 (TensorFlow/PyTorch)

2. **데이터 분석 고도화**
   - 사용자 행동 패턴 심층 분석
   - 관광지별 인기도 예측
   - 계절별/시간대별 추천 최적화

### 중장기 개선사항
1. **모바일 앱 개발**
   - React Native 전환
   - 푸시 알림 기능
   - 위치 기반 서비스 (LBS) 강화

2. **소셜 기능 추가**
   - 루트 공유 기능
   - 댓글 및 리뷰 시스템
   - 사용자 간 팔로우 시스템

3. **지자체 연계 기능**
   - 관광지 운영시간 실시간 업데이트
   - 행사/축제 정보 연동
   - 체험 프로그램 예약 시스템

---

## 📊 프로젝트 핵심어

- **한국어**: 지역관광, AI 큐레이션, 추천시스템, 행동데이터, 스마트관광
- **English**: Local Tourism, AI Curation, Recommender System, Behavioral Data, Smart Tourism

---

## 📞 프로젝트 정보

프로젝트에 대한 자세한 정보는 GitHub 저장소를 참고해주세요.

**GitHub 저장소**: [https://github.com/sibasdeagal/GwangjuTourApp](https://github.com/sibasdeagal/GwangjuTourApp)  
**기술 스택**: React, FastAPI, Flask, SQLite, Python  
**버전 관리**: Git  
**라이센스**: 산학공동 기술개발 과제 (Open Source - MIT License 추천)  
**대학**: 호남대학교 (Honam University)

