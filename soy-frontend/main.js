const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const { spawn } = require('child_process');
const waitOn = require('wait-on');
const isDev = require('electron-is-dev'); // 더 확실한 개발 환경 감지

const devServerUrl = 'http://localhost:9879';
let serverProcess = null;

function startServer() {
  const exePath = path.join(__dirname, 'server', 'soy_AI_System.exe');
  if (fs.existsSync(exePath)) {
    serverProcess = spawn(exePath, [], {
      detached: false,
      stdio: 'ignore'
    });
    serverProcess.unref();
    console.log('서버 실행됨:', exePath);
  } else {
    console.warn('서버 EXE 파일을 찾을 수 없습니다:', exePath);
  }
}

function stopServer() {
  if (serverProcess && !serverProcess.killed) {
    try {
      process.kill(-serverProcess.pid); // detached 프로세스는 -PID로 그룹 종료
      console.log('서버 프로세스 종료됨');
    } catch (err) {
      console.warn('서버 종료 중 오류 발생:', err);
    }
  }
}

process.on('uncaughtException', function (err) {
  console.error('Uncaught Exception:', err);
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false // Disable web security for local files
    }
  });

  console.log('환경 감지:', { isDev, NODE_ENV: process.env.NODE_ENV });
  
  if (isDev) {
    console.log('개발 모드: React 개발 서버 로드 중...');
    win.loadURL(devServerUrl);
  } else {
    console.log('프로덕션 모드: 빌드된 파일 로드 중...');
    const appPath = app.getAppPath();
    const indexPath = path.join(appPath, 'build', 'index.html');
    
    console.log('프로덕션 모드 디버깅:');
    console.log('- 앱 경로:', appPath);
    console.log('- index.html 경로:', indexPath);
    console.log('- 파일 존재 여부:', fs.existsSync(indexPath));
    
    // 렌더러 프로세스 콘솔에도 로그 출력
    win.webContents.once('dom-ready', () => {
      win.webContents.executeJavaScript(`
        console.log('렌더러 프로세스: DOM 준비 완료');
        console.log('렌더러 프로세스: 현재 위치:', window.location.href);
        console.log('렌더러 프로세스: document.body:', document.body);
        console.log('렌더러 프로세스: root 엘리먼트:', document.getElementById('root'));
      `);
    });
    
    const fileUrl = url.format({
      pathname: indexPath,
      protocol: 'file:',
      slashes: true
    });
    
    console.log('- 로드할 URL:', fileUrl);
    
    win.loadURL(fileUrl)
      .then(() => {
        console.log('프로덕션 모드: index.html 로드 성공!');
      })
      .catch((err) => {
        console.error('프로덕션 모드: index.html 로드 실패:', err);
      });
    win.webContents.openDevTools();

    win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
      console.error('페이지 로드 실패:', { errorCode, errorDescription, validatedURL, isMainFrame });
      win.webContents.executeJavaScript(`console.error('렌더러: 페이지 로드 실패', ${JSON.stringify({ errorCode, errorDescription, validatedURL, isMainFrame })})`);
    });
    win.webContents.on('did-finish-load', () => {
      console.log('페이지 로드 완료!');
      win.webContents.executeJavaScript(`console.log('렌더러: 페이지 로드 완료!')`);
    });
    win.webContents.on('dom-ready', () => {
      console.log('DOM 준비 완료!');
    });
  }
}

app.whenReady().then(async () => {
  if (!isDev) {
    startServer();
    try {
      await waitOn({ resources: ['http://localhost:8000'], timeout: 15000 });
      console.log('FastAPI 서버 준비 완료');
    } catch (e) {
      console.error('FastAPI 서버가 준비되지 않았습니다:', e);
    }
  }
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    stopServer();
    app.quit();
  }
});

app.on('before-quit', () => {
  stopServer(); // Mac에서도 명시적 종료
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}); 

// const { app, BrowserWindow } = require('electron');
// const path = require('path');
// const url = require('url');
// const { spawn } = require('child_process');
// const waitOn = require('wait-on');

// const isDev = process.env.NODE_ENV !== 'production';
// const devServerUrl = 'http://localhost:9879';

// let backendProcess = null;

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: false,
//       enableRemoteModule: true,
//     },
//   });

//   if (isDev) {
//     win.loadURL(devServerUrl);
//     win.webContents.openDevTools();
//   } else {
//     win.loadURL(
//       url.format({
//         pathname: path.join(__dirname, './build/index.html'),
//         protocol: 'file:',
//         slashes: true,
//       })
//     );
//   }
// }

// async function startBackendAndCreateWindow() {
//   // 1. 백엔드 EXE 실행
//   const exePath = path.join(__dirname, '..', 'soy-api', 'dist', 'soy_AI_System', 'soy_AI_System.exe');
//   backendProcess = spawn(exePath, [], {
//     detached: true,
//     stdio: 'ignore',
//   });

//   console.log('백엔드 EXE 실행됨:', exePath);

//   // 2. 서버 준비될 때까지 대기
//   try {
//     await waitOn({
//       resources: ['http://localhost:8000'],
//       timeout: 15000,
//     });
//     console.log('FastAPI 서버 준비 완료');
//   } catch (e) {
//     console.error('FastAPI 서버가 준비되지 않았습니다:', e);
//   }

//   // 3. Electron 창 생성
//   createWindow();
// }

// app.whenReady().then(() => {
//   startBackendAndCreateWindow();
// });

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
//   if (backendProcess) {
//     try {
//       process.kill(-backendProcess.pid);
//     } catch (e) {
//       console.error('백엔드 종료 실패:', e);
//     }
//   }
// });

// app.on('activate', () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });
