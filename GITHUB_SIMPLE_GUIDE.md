# GitHub 업로드 간단 가이드

## 방법 1: GitHub Desktop 사용 (가장 쉬움) ⭐

### 1단계: GitHub Desktop 설치
- https://desktop.github.com/ 다운로드 및 설치
- GitHub 계정으로 로그인

### 2단계: 프로젝트 업로드
1. GitHub Desktop 열기
2. File → Add Local Repository 클릭
3. "Choose..." 버튼 클릭
4. `C:\Users\user\GwangjuTourApp` 폴더 선택
5. "Add repository" 클릭

### 3단계: GitHub 저장소 생성 및 푸시
1. Publish repository 클릭 (오른쪽 위)
2. Repository name: `GwangjuTourApp`
3. Description: "지역관광 특화 AI 큐레이션 플랫폼"
4. "Keep this code private" 체크 (원하는 경우)
5. "Publish GwangjuTourApp" 클릭

완료! 🎉

---

## 방법 2: Git 명령어 사용

### 사전 작업: Git 설치
1. https://git-scm.com/download/win 다운로드
2. 실행 후 Next 계속 클릭 (기본 설정 유지)
3. PowerShell 재시작

### 업로드 절차

```powershell
# 1. 프로젝트 폴더로 이동
cd C:\Users\user\GwangjuTourApp

# 2. Git 초기화
git init

# 3. 파일 추가
git add .

# 4. 첫 커밋
git commit -m "Initial commit: 광주 관광지 AI 큐레이션 플랫폼"

# 5. GitHub 저장소 연결 (YOUR_USERNAME을 실제 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/GwangjuTourApp.git

# 6. 브랜치 이름 변경 및 푸시
git branch -M main
git push -u origin main
```

### GitHub 저장소 생성 방법
1. https://github.com/new 접속
2. Repository name 입력
3. Private 또는 Public 선택
4. Create repository 클릭
5. 위 명령어 실행

---

## 중요 체크리스트 ✓

- [x] `.gitignore` 생성됨 (불필요한 파일 제외)
- [x] `README.md` 생성됨 (프로젝트 설명)
- [x] 데이터베이스 파일(`.db`) 제외됨
- [ ] Git 설치 또는 GitHub Desktop 설치
- [ ] GitHub 계정 생성
- [ ] GitHub 저장소 생성
- [ ] 파일 업로드 완료

## 🔒 보안 주의사항

**절대 업로드하지 말아야 할 것:**
- `*.db` - 데이터베이스 파일 (사용자 정보 포함)
- API 키, 비밀번호 하드코딩
- `gwangju_tour.db` - 민감 정보

이미 `.gitignore`에 설정되어 있어서 자동으로 제외됩니다.




















