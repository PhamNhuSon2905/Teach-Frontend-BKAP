import { useEffect, useState, useRef } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { useNavigate, useParams } from "react-router-dom";
import lessonApi from "../../api/lessonApi";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  IconButton,
  Tooltip,
} from "@mui/material";



const API_URL = process.env.REACT_APP_DEV_API_URL;

export default function InstructorLessonDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const previewRef = useRef(null);

  useEffect(() => {
    lessonApi
      .getLessonDetail(id)
      .then((res) => setLesson(res.data.data))
      .catch(() => setLesson(null));
  }, [id]);

  if (!lesson) {
    return <Typography sx={{ p: 3 }}>Đang tải dữ liệu bài giảng...</Typography>;
  }

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await previewRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleViewFile = (file) => {
    if (file.fileType === "PDF") {
      setPreview({
        type: "PDF",
        url: `${API_URL}${file.filePath}`,
      });
      return;
    }

    if (file.fileType === "ZIP" || file.fileType === "RAR") {
      setPreview({
        type: "HTML",
        url: `${API_URL}${file.filePath}/index.html`,
      });
      return;
    }

    alert("Định dạng này chưa hỗ trợ xem trực tiếp");
  };

  const renderPreview = () => {
    if (!preview) {
      return (
        <Box sx={{ py: 8, textAlign: "center", color: "text.secondary" }}>
          <Typography>Chọn tài liệu bài giảng bên phải để xem !</Typography>
          <Typography variant="body2">
            (PDF & bài học HTML đều hiển thị tại đây)
          </Typography>
        </Box>
      );
    }

    return (
      <iframe
        src={preview.url}
        title="lesson-preview"
        width="100%"
        height="100%"
        style={{
          border: "none",
        }}
      />
    );
  };

  return (
    <Box sx={{ px: 2, pb: 3 }}>
      {!isFullscreen && (
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/teacher/lessons")}
          sx={{ mb: 2 }}
        >
          Quay lại danh sách
        </Button>
      )}

      {!isFullscreen && (
        <Paper
          sx={{
            p: 3,
            borderRadius: 0,
            mb: 3,
            boxShadow: "0px 10px 30px rgba(0,0,0,0.06)",
            border: "1px solid #eee",
          }}
        >
          <Stack direction="row" spacing={3}>
            <Box
              component="img"
              src={`${API_URL}${lesson.coverImage}`}
              sx={{
                width: 180,
                height: 180,
                objectFit: "cover",
                borderRadius: 0,
                border: "1px solid #e0e0e0",
              }}
            />

            <Box flex={1}>
              <Typography variant="h4" fontWeight="bold">
                {lesson.name}
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Mã bài giảng: <b>{lesson.code}</b>
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Chip label={`Khối ${lesson.grade}`} color="success" />
                <Chip label={`Tháng ${lesson.teachingMonth}`} color="primary" />
              </Stack>

              {lesson.description && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography>{lesson.description}</Typography>
                </>
              )}
            </Box>
          </Stack>
        </Paper>
      )}

      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        
        {/* ========= PREVIEW PANEL ========= */}
        <Paper
          ref={previewRef}
          sx={{
            p: 2,
            borderRadius: 0,
            flex: 1,
            height: isFullscreen ? "100vh" : 720,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0px 10px 30px rgba(0,0,0,0.08)",
            border: "1px solid #eee",
            background: "#fff",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight={600}>
              Trình chiếu bài học
            </Typography>

            <Tooltip title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}>
              <IconButton onClick={toggleFullscreen}>
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Tooltip>
          </Stack>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ flex: 1 }}>{renderPreview()}</Box>
        </Paper>

        {/* ========= RESOURCE PANEL ========= */}
        {!isFullscreen && (
          <Paper
            sx={{
              p: 3,
              borderRadius: 0,
              width: { md: "32%" },
              boxShadow: "0px 10px 30px rgba(0,0,0,0.06)",
              border: "1px solid #eee",
              background: "#fafafa",
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Tài nguyên bài giảng
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <List>
              {lesson.files?.map((file) => (
                <ListItem
                  key={file.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 1.5,
                    py: 1,
                    "&:hover": {
                      background: "#f2f4f7",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {file.fileType === "PDF" ? (
                      <DescriptionIcon color="error" />
                    ) : (
                      <FolderZipIcon color="warning" />
                    )}
                  </ListItemIcon>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontWeight: 500,
                      }}
                      title={file.fileName}
                    >
                      {file.fileName}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block" }}
                    >
                      {file.fileType}
                    </Typography>
                  </Box>

                  <Stack spacing={0.5} sx={{ flexShrink: 0 }}>
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => handleViewFile(file)}
                    >
                      Xem
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      href={`${API_URL}${file.filePath}`}
                      target="_blank"
                    >
                      Tải xuống
                    </Button>
                  </Stack>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}
