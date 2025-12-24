# GitHub 업로드 가이드

프로젝트를 GitHub에 업로드하는 방법입니다.

## 📋 사전 준비

### 1. Git 설치 확인
Git이 설치되어 있지 않다면 다음 링크에서 다운로드하세요:
- Windows: https://git-scm.com/download/win
- 설치 후 PowerShell을 재시작하세요.

### 2. GitHub 계정 준비
https://github.com 에서 계정을 만드세요.

## 🚀 업로드 절차

### Step 1: GitHub 저장소 생성
1. https://github.com/new 접속
2. Repository name: `GwangjuTourApp` (또는 원하는 이름)
3. Description: "지역관광 특화 AI 큐레이션 플랫폼"
4. Public 또는 Private 선택
5. "Create repository" 클릭

### Step 2: Git 초기화 및 커밋

PowerShell에서 프로젝트 폴더로 이동:

```powershell
cd C:\Users\user\GwangjuTourApp
```

#### Git 초기화
```powershell
git init
```

#### 파일 추가
```powershell
git add .
```

#### 첫 번째 커밋
```powershell
git commit -m "Initial commit: 광주 관광지 AI 큐레이션 플랫폼"
```

### Step 3: GitHub 원격 저장소 연결

생성한 GitHub 저장소의 URL을 확인하고 (예: `https://github.com/YOUR_USERNAME/GwangjuTourApp.git`)

```powershell
git remote add origin https://github.com/YOUR_USERNAME/GwangjuTourApp.git
```

### Step 4: 파일 푸시

```powershell
git branch -M main
git push -u origin main
```

GitHub 인증 정보를 입력하면 업로드됩니다.

## 📝 업로드되는 파일

다음 파일들이 GitHub에 업로드됩니다:

### 백엔드
- `backend/app.py` - Flask 프록시 서버
- `backend/main.py` - FastAPI 메인 서버
- `backend/database.py` - 데이터베이스 연결
- `backend/models.py` - 데이터베이스 모델
- `backend/requirements.txt` - Python 패키지 목록

### 프론트엔드
- `frontend/src/` - React 소스 코드
- `frontend/public/` - 정적 파일
- `frontend/package.json` - Node.js 패키지 목록

### 설정 파일
- `.gitignore` - Git 무시 파일
- `README.md` - 프로젝트 설명
- `PROJECT_PORTFOLIO.md` - 포트폴리오 문서

### 스크립트
- `create_cloudflare_exe.py` - EXE 파일 생성
- `open_cloudflare_tunnel.py` - Cloudflare Tunnel 실행
- `export_to_csv.py` - CSV 내보내기

## ❌ 업로드되지 않는 파일

`.gitignore`에 의해 다음 파일들은 업로드되지 않습니다:

- `*.db` - 데이터베이스 파일 (민감 정보 포함)
- `node_modules/` - Node.js 패키지
- `venv/` - Python 가상환경
- `__pycache__/` - Python 캐시
- `build/`, `dist/` - 빌드 결과물
- `*.exe` - 실행 파일
- `*.log` - 로그 파일
- `uploads/` - 업로드된 파일

## 🔐 주의사항

### 보안
1. **데이터베이스 파일 절대 업로드하지 마세요**
   - `gwangju_tour.db`는 사용자 정보가 포함되어 있습니다.
2. **API 키 및 비밀번호**
   - Google Maps API 키, Cloudflare Tunnel URL 등 민감한 정보는 환경 변수로 관리하세요.
3. **Private 저장소 권장**
   - 내부 프로젝트인 경우 Private 저장소를 사용하세요.

### 업로드 전 체크리스트
- [ ] `.gitignore` 파일이 있는지 확인
- [ ] 데이터베이스 파일이 제외되는지 확인
- [ ] 민감한 정보(API 키, 비밀번호)가 코드에 하드코딩되지 않았는지 확인
- [ ] `README.md`가 최신 정보를 담고 있는지 확인

## 🔄 이후 업데이트

코드를 수정한 후 업데이트하는 방법:

```powershell
git add .
git commit -m "변경 내용 설명"
git push origin main
```

## 📞 문제 해결

### Git 인증 오류
```powershell
# Personal Access Token 사용
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/GwangjuTourApp.git
```

### 대용량 파일 오류
GitHub는 100MB 이상의 파일을 업로드할 수 없습니다.
- 이미지 파일이 많으면 Git LFS 사용 고려
- 또는 이미지를 외부 저장소에 업로드

### 브랜치 충돌
```powershell
git pull origin main --rebase
```

## 📚 참고 자료

- Git 기본 사용법: https://git-scm.com/book
- GitHub 가이드: https://docs.github.com
- Git 명령어 치트시트: https://education.github.com/git-cheat-sheet




















