import React, { useEffect, useState, useRef } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import OfflinePinIcon from "@mui/icons-material/OfflinePin";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  Button,
  List,
  ListItem,
  ListItemIcon,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";
import lessonApi from "../../api/lessonApi";
import localforage from "localforage";
import JSZip from "jszip"; 
import { toast } from "../../ui/toast"; 

const API_URL = process.env.REACT_APP_API_URL;


localforage.config({
  name: "TeacherPortalApp",
  storeName: "lesson_files_offline",
});


const isElectron = () => {
  return window && window.process && window.process.type;
};

export default function InstructorLessonDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [lesson, setLesson] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // State cho Web (Lưu status đã tải hay chưa)
  const [offlineStatus, setOfflineStatus] = useState({});
  const [downloading, setDownloading] = useState({});

  const previewRef = useRef(null);


  useEffect(() => {
    lessonApi
      .getLessonDetail(id)
      .then((res) => {
        setLesson(res.data.data);
        if (!isElectron()) {
          // Chỉ check offline DB nếu đang ở trên Web
          checkOfflineFilesWeb(res.data.data.files);
        }
      })
      .catch(() => {
        toast.error("Không tải được thông tin bài giảng");
        setLesson(null);
      });
  }, [id]);


  const checkOfflineFilesWeb = async (files) => {
    if (!files) return;
    const statusMap = {};
    for (const file of files) {
      const blob = await localforage.getItem(`file_${file.id}`);
      if (blob) statusMap[file.id] = true;
    }
    setOfflineStatus(statusMap);
  };

  const handleSaveOfflineWeb = async (file) => {
    try {
      setDownloading((prev) => ({ ...prev, [file.id]: true }));
      let fileUrl = `${API_URL}${file.filePath}`;

      // Fix lỗi đuôi file nếu server trả về thiếu
      if (file.fileType === 'ZIP' || file.fileType === 'RAR') {
        if (!fileUrl.toLowerCase().endsWith('.zip') && !fileUrl.toLowerCase().endsWith('.rar')) {
          fileUrl += '.zip';
        }
      }

      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Lỗi tải file từ server");

      const blob = await response.blob();
      await localforage.setItem(`file_${file.id}`, blob);

      setOfflineStatus((prev) => ({ ...prev, [file.id]: true }));
      toast.success(`Đã lưu "${file.fileName}" vào bộ nhớ trình duyệt!`);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi lưu file offline.");
    } finally {
      setDownloading((prev) => ({ ...prev, [file.id]: false }));
    }
  };

  const handleDeleteOfflineWeb = async (file) => {
    await localforage.removeItem(`file_${file.id}`);
    setOfflineStatus((prev) => {
      const newState = { ...prev };
      delete newState[file.id];
      return newState;
    });
    toast.info("Đã xóa bản offline.");
  };

  const handleViewZipWeb = async (blob) => {
    try {
      const zip = await JSZip.loadAsync(blob);
      // Tìm file html
      let htmlFile = zip.file("index.html");
      if (!htmlFile) {
        const htmlFileName = Object.keys(zip.files).find(name => name.endsWith('.html'));
        if (htmlFileName) htmlFile = zip.file(htmlFileName);
      }
      if (!htmlFile) {
        toast.warning("Không tìm thấy file index.html trong file nén.");
        return;
      }
      const htmlContent = await htmlFile.async("string");
      const htmlBlob = new Blob([htmlContent], { type: "text/html" });
      const objectUrl = URL.createObjectURL(htmlBlob);

      setPreview({ type: "HTML", url: objectUrl, isOffline: true });
    } catch (err) {
      toast.error("Lỗi giải nén trên trình duyệt.");
    }
  };


  const handleViewOfflineElectron = async (file) => {
    try {
      // 0. Khởi tạo IPC để gọi xuống Electron
      const { ipcRenderer } = window.require('electron');

      // 1. KIỂM TRA TRƯỚC: File này đã tải về máy chưa?
    
      const existingPath = await ipcRenderer.invoke('check-file-exists', { lessonId: file.id });

      if (existingPath) {
     
        console.log("File đã có sẵn, mở Offline:", existingPath);
        
        setPreview({
          type: "HTML",
          url: existingPath,
          isOffline: true
        });
        
        toast.success("Đang xem chế độ Offline (Từ máy tính)");
        return; 
      }

      // Kiểm tra mạng trước khi tải
      if (!navigator.onLine) {
         toast.warning("Bài giảng này chưa được tải về máy! Vui lòng kết nối mạng để tải lần đầu tiên.");
         return;
      }

      const API_BASE = process.env.REACT_APP_API_URL || "https://lms.bkapai.vn";
      let fileUrl = file.filePath; // Lấy đường dẫn gốc từ DB

      // Nếu là file ZIP mà đường dẫn trong DB không có đuôi .zip -> Tự động thêm vào
      if (file.fileType === 'ZIP' || file.fileType === 'RAR') {
          const lowerUrl = fileUrl.toLowerCase();
          if (!lowerUrl.endsWith('.zip') && !lowerUrl.endsWith('.rar')) {
              fileUrl += '.zip'; 
          }
      }

  
      const fullUrl = fileUrl.startsWith("http") ? fileUrl : `${API_BASE}${fileUrl}`;

 
      console.log("Link tải gửi xuống Electron:", fullUrl);

      toast.info("Đang tải tài liệu về máy (Lần đầu)...");
      setDownloading((prev) => ({ ...prev, [file.id]: true }));

      // Gọi xuống main process
      const localFilePath = await ipcRenderer.invoke('download-and-unzip', {
        url: fullUrl,
        lessonId: file.id
      });

      setPreview({
        type: "HTML",
        url: localFilePath,
        isOffline: true
      });
      
      toast.success("Tải xong! Từ giờ bạn có thể xem Offline.");

    } catch (error) {
      console.error("Lỗi tải file:", error);
      toast.error("Không tải được file. Mã lỗi: " + (error.message || "Unknown"));
    } finally {

      setDownloading((prev) => ({ ...prev, [file.id]: false }));
    }
  };


  const handleViewFile = async (file) => {
 
    if (isElectron()) {
      if (file.fileType === "ZIP" || file.fileType === "RAR") {
        await handleViewOfflineElectron(file);
      } else if (file.fileType === "PDF") {
        setPreview({ type: "PDF", url: `${API_URL}${file.filePath}`, isOffline: false });
      } else {
        toast.warning("Định dạng chưa hỗ trợ trên App Desktop");
      }
      return;
    }

  

    // A. PDF 
    if (file.fileType === "PDF") {
      const offlineBlob = await localforage.getItem(`file_${file.id}`);
      if (offlineBlob) {
        setPreview({ type: "PDF", url: URL.createObjectURL(offlineBlob), isOffline: true });
      } else {
        setPreview({ type: "PDF", url: `${API_URL}${file.filePath}`, isOffline: false });
      }
      return;
    }

    // B. ZIP/RAR 
    if (file.fileType === "ZIP" || file.fileType === "RAR") {
      const offlineBlob = await localforage.getItem(`file_${file.id}`);

      if (offlineBlob) {
        toast.error("Trình duyệt không hỗ trợ xem Offline file này vui lòng xóa đi và xem Online!", {
          position: "bottom", 
          autoClose: 5000,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Xem Online bình thường
        setPreview({
          type: "HTML",
          url: `${API_URL}${file.filePath}/index.html`,
          isOffline: false
        });
      }
      return;
    }

    toast.warning("Định dạng file chưa được hỗ trợ.");
  };

  // Fullscreen toggle
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await previewRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (!lesson) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, pb: 3 }}>

      {!isFullscreen && (
        <>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/teacher/lessons")}
            sx={{ mb: 2, textTransform: 'none' }}
          >
            Quay lại danh sách
          </Button>

          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 2,
              mb: 3,
              boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
              border: "1px solid #eee"
            }}
          >
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ xs: "center", sm: "flex-start" }}>
              <Box
                component="img"
                src={lesson.coverImage ? `${API_URL}${lesson.coverImage}` : "https://via.placeholder.com/180"}
                sx={{
                  width: { xs: "100%", sm: 180 },
                  maxWidth: { xs: 300, sm: 180 },
                  height: { xs: 200, sm: 180 },
                  objectFit: "cover",
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
              />
              <Box flex={1} sx={{ width: "100%", textAlign: { xs: "center", sm: "left" } }}>
                <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, mb: 1 }}>
                  {lesson.name}
                </Typography>
                <ChipLabel label={`Mã: ${lesson.code}`} color="primary" />
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                  {lesson.description || "Chưa có mô tả cho bài giảng này."}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </>
      )}

      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>

        <Paper
          ref={previewRef}
          elevation={isFullscreen || (preview && preview.type === 'HTML') ? 0 : 2}
          sx={{
            ...(isFullscreen ? {
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              width: '100vw', height: '100vh', zIndex: 99999,
              m: '0 !important', p: '0 !important',
              borderRadius: 0, border: 'none', background: '#000', overflow: 'hidden'
            } : {
              flex: 1,

              minHeight: { xs: "500px", md: "720px" },
              height: "auto",
              display: "flex",
              flexDirection: "column",
              background: "#fff",
              position: "relative",
              borderRadius: 2,
              overflow: 'hidden'
            })
          }}
        >

          {!isFullscreen && (
            <Box sx={{ p: 2, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}>
                Khu vực trình chiếu
              </Typography>
              {preview && preview.type !== 'HTML' && (
                <Tooltip title="Toàn màn hình">
                  <IconButton onClick={toggleFullscreen} size="small">
                    <FullscreenIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}

          {isFullscreen && (
            <Tooltip title="Thoát (Esc)">
              <IconButton
                onClick={toggleFullscreen}
                sx={{
                  position: 'absolute', top: 10, right: 10, zIndex: 999999,
                  color: '#fff', backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
                }}
              >
                <FullscreenExitIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          )}


          <Box sx={{
            width: '100%',
            flex: 1,
            display: 'flex', flexDirection: 'column',
            bgcolor: isFullscreen ? '#000' : '#f9f9f9',
            position: 'relative'
          }}>
            {preview ? (
              <>
                {!isFullscreen && preview.isOffline && (
                  <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, p: 0.5, bgcolor: '#e8f5e9', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                    <OfflinePinIcon color="success" fontSize="small" />
                    <Typography variant="caption" color="success.main" fontWeight="bold">
                      Đang xem chế độ Offline
                    </Typography>
                  </Box>
                )}
                <iframe
                  src={preview.url}
                  title="lesson-preview"
                  style={{
                    border: "none", width: "100%", height: "100%",
                    display: "block", background: "#fff"
                  }}
                  allowFullScreen
                />
              </>
            ) : (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: "text.secondary", p: 3, textAlign: 'center' }}>
                <img src="https://cdn-icons-png.flaticon.com/512/748/748600.png" alt="select" style={{ width: 80, marginBottom: 16, opacity: 0.5 }} />
                <Typography>Vui lòng chọn tài liệu bên phải để bắt đầu học</Typography>
              </Box>
            )}
          </Box>
        </Paper>


        {!isFullscreen && (
          <Paper sx={{
            borderRadius: 2,
            width: { xs: "100%", md: "350px" },
            border: "1px solid #eee",
            background: "#fff",
            height: "fit-content",
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #eee', bgcolor: '#fafafa', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
              <Typography variant="subtitle1" fontWeight={700}>Tài nguyên bài giảng</Typography>
            </Box>

            <List sx={{ p: 2 }}>
              {lesson.files?.length === 0 && <Typography variant="body2" sx={{ textAlign: 'center', py: 2 }}>Chưa có file nào.</Typography>}

              {lesson.files?.map((file) => {
                const isOffline = offlineStatus[file.id];
                const isDownloading = downloading[file.id];

                return (
                  <ListItem
                    key={file.id}
                    sx={{
                      mb: 1.5,
                      p: 1.5,
                      bgcolor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 1.5,
                      transition: 'all 0.2s',
                      '&:hover': { boxShadow: '0 4px 10px rgba(0,0,0,0.05)', borderColor: '#bdbdbd' }
                    }}
                  >
      
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1.5 }}>
                      <Box sx={{
                        width: 40, height: 40,
                        borderRadius: 1,
                        bgcolor: file.fileType === "PDF" ? '#ffebee' : '#fff3e0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {file.fileType === "PDF" ? <DescriptionIcon color="error" /> : <FolderZipIcon color="warning" />}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600} noWrap title={file.fileName}>{file.fileName}</Typography>
                        <Typography variant="caption" color="text.secondary">{file.fileType}</Typography>
                      </Box>
                    </Box>

                    <Divider flexItem />

               
                    <Stack direction="row" spacing={1} sx={{ width: '100%', justifyContent: 'flex-end' }}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewFile(file)}
                        sx={{ flex: 1, textTransform: 'none', boxShadow: 'none' }}
                      >
                        Xem
                      </Button>

                      {/* Chỉ hiện nút Lưu/Xóa trên WEB. Trên Electron thì tự động lưu khi Xem */}
                      {!isElectron() && (
                        <>
                          {!isOffline ? (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={isDownloading ? <CircularProgress size={16} /> : <CloudDownloadIcon />}
                              onClick={() => handleSaveOfflineWeb(file)}
                              disabled={isDownloading}
                              sx={{ textTransform: 'none' }}
                            >
                              {isDownloading ? "Đang tải..." : "Lưu"}
                            </Button>
                          ) : (
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteOfflineWeb(file)}
                              sx={{ textTransform: 'none' }}
                            >
                              Xóa
                            </Button>
                          )}
                        </>
                      )}
                    </Stack>
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}

function ChipLabel({ label, color }) {
  return (
    <Box sx={{
      display: 'inline-block',
      px: 1.5, py: 0.5,
      borderRadius: 1,
      bgcolor: color === 'primary' ? 'rgba(25, 118, 210, 0.1)' : '#eee',
      color: color === 'primary' ? '#1976d2' : '#333',
      fontSize: '0.75rem', fontWeight: 700
    }}>
      {label}
    </Box>
  )
}