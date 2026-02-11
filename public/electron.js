const { app, BrowserWindow, ipcMain, protocol, net } = require('electron');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const AdmZip = require('adm-zip');
const { pathToFileURL } = require('url');

// Bỏ qua lỗi SSL
app.commandLine.appendSwitch('ignore-certificate-errors');

// Đăng ký giao thức "lesson://"
protocol.registerSchemesAsPrivileged([
  { scheme: 'lesson', privileges: { bypassCSP: true, stream: true, supportFetchAPI: true, secure: true, standard: true } }
]);

// Đường dẫn lưu file offline
const OFFLINE_DIR = path.join(app.getPath('userData'), 'offline_lessons');
if (!fs.existsSync(OFFLINE_DIR)) {
  fs.mkdirSync(OFFLINE_DIR, { recursive: true });
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'favicon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false, 
    },
  });

  // 🔥 SỬA ĐỔI Ở ĐÂY: Dòng này sẽ xóa thanh menu (File, Edit,...)
  mainWindow.setMenu(null); 

  if (app.isPackaged) {
    mainWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`);
  } else {
    mainWindow.loadURL('http://localhost:3000');
  }
}

app.whenReady().then(() => {
    
    protocol.handle('lesson', (request) => {
      // 1. Lấy phần đường dẫn sau chữ "lesson://"
      let url = request.url.replace('lesson://', '');
      
      // Fix lỗi query và hash
      const queryIndex = url.indexOf('?');
      if (queryIndex !== -1) url = url.substring(0, queryIndex);

      const hashIndex = url.indexOf('#');
      if (hashIndex !== -1) url = url.substring(0, hashIndex);

      // 2. Xử lý dấu "/" ở đầu
      if (url.startsWith('/') || url.startsWith('\\')) {
        url = url.substring(1);
      }

      // 3. Giải mã ký tự đặc biệt
      const decodedUrl = decodeURIComponent(url);

      // 4. Tạo đường dẫn tuyệt đối
      const filePath = path.normalize(path.join(OFFLINE_DIR, decodedUrl));

      console.log('>> Loading file:', filePath);

      // 5. Trả về file thật
      return net.fetch(pathToFileURL(filePath).toString());
    });

    createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// --- Các hàm hỗ trợ và IPC ---

function findEntryFile(folderPath) {
  if (fs.existsSync(path.join(folderPath, 'index.html'))) return path.join(folderPath, 'index.html');
  if (fs.existsSync(path.join(folderPath, 'story.html'))) return path.join(folderPath, 'story.html');
  if (fs.existsSync(path.join(folderPath, 'main.html'))) return path.join(folderPath, 'main.html'); 

  try {
    const items = fs.readdirSync(folderPath);
    for (const item of items) {
      const itemPath = path.join(folderPath, item);
      if (fs.statSync(itemPath).isDirectory()) {
        if (fs.existsSync(path.join(itemPath, 'index.html'))) return path.join(itemPath, 'index.html');
        if (fs.existsSync(path.join(itemPath, 'story.html'))) return path.join(itemPath, 'story.html');
        if (fs.existsSync(path.join(itemPath, 'main.html'))) return path.join(itemPath, 'main.html');
      }
    }
  } catch (e) {
    console.error("Lỗi khi tìm file trong subfolder:", e);
  }
  return null;
}

function convertToCustomUrl(fullPath) {
  const relativePath = path.relative(OFFLINE_DIR, fullPath);
  const normalizedPath = relativePath.split(path.sep).join('/');
  return `lesson://${normalizedPath}`;
}

ipcMain.handle('check-file-exists', async (event, { lessonId }) => {
  try {
    const folderPath = path.join(OFFLINE_DIR, `lesson_${lessonId}`);
    if (!fs.existsSync(folderPath)) return null;

    const entryFile = findEntryFile(folderPath);
    
    if (entryFile) {
      return convertToCustomUrl(entryFile);
    }
    return null;
  } catch (error) {
    return null;
  }
});

ipcMain.handle('download-and-unzip', async (event, { url, lessonId }) => {
  try {
    const folderPath = path.join(OFFLINE_DIR, `lesson_${lessonId}`);
    const zipPath = path.join(OFFLINE_DIR, `temp_${lessonId}.zip`);

    if (fs.existsSync(folderPath)) {
      const existingEntry = findEntryFile(folderPath);
      if (existingEntry) {
        console.log('File đã tồn tại, trả về URL ảo');
        return convertToCustomUrl(existingEntry);
      }
    }

    console.log('Bắt đầu tải:', url);
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer'
    });
    fs.writeFileSync(zipPath, response.data);

    console.log('Đang giải nén...');
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(folderPath, true);

    fs.unlinkSync(zipPath);

    const finalEntryFile = findEntryFile(folderPath);
    if (!finalEntryFile) {
      throw new Error("Không tìm thấy file chạy!");
    }

    console.log('Hoàn tất, tạo đường dẫn ảo...');
    return convertToCustomUrl(finalEntryFile);

  } catch (error) {
    console.error('Lỗi tải file:', error);
    throw error;
  }
});