const { app, BrowserWindow, ipcMain, protocol, net } = require('electron');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const AdmZip = require('adm-zip');
const { pathToFileURL } = require('url');

// Bỏ qua lỗi SSL
app.commandLine.appendSwitch('ignore-certificate-errors');

// Đăng ký giao thức "lesson://" có quyền hạn giống như HTTP để load được tài nguyên (ảnh, css, js)
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
      
      // 🔥 FIX LỖI QUAN TRỌNG: Cắt bỏ các tham số query (?v=...) và hash (#...)
      // Vì Windows không hiểu file tên là "player.js?v=123"
      const queryIndex = url.indexOf('?');
      if (queryIndex !== -1) url = url.substring(0, queryIndex);

      const hashIndex = url.indexOf('#');
      if (hashIndex !== -1) url = url.substring(0, hashIndex);

      // 2. Xử lý trường hợp trình duyệt tự thêm dấu "/" ở đầu
      // Ví dụ: lesson:///lesson_49/... -> Cần bỏ dấu / đầu tiên đi
      if (url.startsWith('/') || url.startsWith('\\')) {
        url = url.substring(1);
      }

      // 3. Giải mã ký tự đặc biệt
      const decodedUrl = decodeURIComponent(url);

      // 4. Tạo đường dẫn tuyệt đối
      // Dùng path.normalize để xử lý các dấu gạch chéo thừa
      const filePath = path.normalize(path.join(OFFLINE_DIR, decodedUrl));

      // DEBUG: In ra console xem nó đang load file nào (bạn bật console lên sẽ thấy)
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

// Input: C:\Users\Admin\...\offline_lessons\lesson_49\sub\index.html
// Output: lesson://lesson_49/sub/index.html
function convertToCustomUrl(fullPath) {
  // 1. Lấy phần đường dẫn tương đối tính từ OFFLINE_DIR
  const relativePath = path.relative(OFFLINE_DIR, fullPath);
  
  // 2. Chuyển đổi dấu "\" (Windows) thành "/" (URL)
  const normalizedPath = relativePath.split(path.sep).join('/');
  
  // 3. Ghép vào scheme
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
    // 🔥 THAY ĐỔI: Trả về URL ảo
    return convertToCustomUrl(finalEntryFile);

  } catch (error) {
    console.error('Lỗi tải file:', error);
    throw error;
  }
});