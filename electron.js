const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;
let frontendProcess;

// 백엔드 서버 시작 함수
function startBackendServer() {
  console.log('🚀 백엔드 서버 시작 중...');
  backendProcess = spawn('python', ['backend/app.py'], {
    cwd: __dirname,
    stdio: 'inherit'
  });

  backendProcess.on('error', (err) => {
    console.error('❌ 백엔드 서버 시작 실패:', err);
  });

  backendProcess.on('exit', (code) => {
    console.log(`백엔드 서버 종료 (코드: ${code})`);
  });
}

// 메인 윈도우 생성
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    },
    icon: path.join(__dirname, 'frontend/public/main_icons/main_1.png'),
    title: '광주관광 루트찾기'
  });

  // 백엔드 서버 시작
  startBackendServer();

  // 서버가 시작될 때까지 잠시 대기 후 로드
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:5000');
  }, 3000);

  // 개발자 도구 열기 (개발 시에만)
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // 외부 링크는 기본 브라우저에서 열기
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// 앱이 준비되면 윈도우 생성
app.whenReady().then(createWindow);

// 모든 윈도우가 닫히면 앱 종료 (macOS 제외)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // 백엔드 프로세스 종료
    if (backendProcess) {
      backendProcess.kill();
    }
    if (frontendProcess) {
      frontendProcess.kill();
    }
    app.quit();
  }
});

// 앱이 활성화되면 윈도우 생성 (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 앱 종료 전 정리
app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  if (frontendProcess) {
    frontendProcess.kill();
  }
});




















