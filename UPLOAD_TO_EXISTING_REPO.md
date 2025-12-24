# 기존 GitHub 저장소에 파일 업로드하기

저장소가 이미 생성되어 있습니다: https://github.com/sibasdeagal/GwangjuTourApp

## 🚀 업로드 방법

### 방법 1: GitHub Desktop 사용 (추천)

#### 1단계: GitHub Desktop 설치
1. https://desktop.github.com/ 다운로드 및 설치
2. GitHub 계정(`sibasdeagal`)으로 로그인

#### 2단계: 기존 저장소 Clone
1. GitHub Desktop 열기
2. File → Clone repository 클릭
3. GitHub.com 탭에서 `sibasdeagal/GwangjuTourApp` 찾기
4. Local path: `C:\Users\user\GwangjuTourApp_Clone` (또는 원하는 경로)
5. Clone 클릭

#### 3단계: 파일 복사 및 업로드
1. 기존 프로젝트의 모든 파일을 복사
2. Cloned 폴더에 붙여넣기
3. GitHub Desktop에서 변경사항 확인
4. Summary: "Add all project files"
5. Commit to main 클릭
6. Push origin 클릭 (오른쪽 위)

**주의**: `.gitignore`에 의해 불필요한 파일은 자동 제외됩니다.

---

### 방법 2: Git 명령어 사용

#### 1단계: Git 설치
1. https://git-scm.com/download/win 다운로드
2. 설치 후 PowerShell 재시작

#### 2단계: 명령어 실행

PowerShell에서 프로젝트 폴더로 이동:

```powershell
cd C:\Users\user\GwangjuTourApp
```

저장소가 이미 있으면 기존 원격 추가 후:

```powershell
# Git 초기화
git init

# 원격 저장소 추가
git remote add origin https://github.com/sibasdeagal/GwangjuTourApp.git

# 파일 추가
git add .

# 커밋
git commit -m "Add full project files"

# 브랜치 설정 및 푸시
git branch -M main
git push -u origin main
```

만약 충돌이 발생하면:

```powershell
git pull origin main --allow-unrelated-histories
git push origin main
```

---

### 방법 3: GitHub 웹에서 직접 업로드

소량 파일용입니다.

1. https://github.com/sibasdeagal/GwangjuTourApp 접속
2. "Add file" → "Upload files" 클릭
3. 파일 드래그 앤 드롭
4. "Commit changes" 클릭

**주의**: 대량의 파일에는 적합하지 않습니다.

---

## ✅ 업로드 전 체크리스트

- [ ] `.gitignore` 파일 확인
- [ ] `gwangju_tour.db` 데이터베이스 파일 제외 확인
- [ ] `node_modules/`, `venv/`, `__pycache__/` 제외 확인
- [ ] `build/`, `dist/` 빌드 파일 제외 확인
- [ ] 민감한 정보(API 키, 비밀번호) 제거 확인

## 📝 추천 파일 구조

다음 파일들이 업로드됩니다:

```
GwangjuTourApp/
├── .gitignore              # Git 무시 파일
├── README.md              # 프로젝트 설명
├── PROJECT_PORTFOLIO.md   # 포트폴리오
├── backend/               # 백엔드
│   ├── app.py
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── requirements.txt
│   └── ...
├── frontend/              # 프론트엔드
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── create_cloudflare_exe.py
├── open_cloudflare_tunnel.py
├── export_to_csv.py
└── GITHUB_SIMPLE_GUIDE.md
```

**제외되는 파일:**
- `*.db` (데이터베이스)
- `node_modules/`
- `venv/`
- `__pycache__/`
- `build/`, `dist/`
- `*.exe`
- `*.log`

---

## 🔗 참고 링크

- 저장소: https://github.com/sibasdeagal/GwangjuTourApp
- GitHub Desktop: https://desktop.github.com/
- Git 다운로드: https://git-scm.com/download/win




















