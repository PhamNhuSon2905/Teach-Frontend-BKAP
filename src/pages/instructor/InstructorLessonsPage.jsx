import { useEffect, useMemo, useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Pagination,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import lessonApi from "../../api/lessonApi";

const PAGE_SIZE = 5; 

export default function InstructorLessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [grade, setGrade] = useState("");
  const [month, setMonth] = useState("");
  const [page, setPage] = useState(1);
  const API_URL = process.env.REACT_APP_API_URL; 

  const navigate = useNavigate();

  const loadLessons = () => {
    lessonApi
      .getMyLessons()
      .then((res) => {
        setLessons(res.data.data || []);
      })
      .catch(() => setLessons([]));
  };

  useEffect(() => {
    loadLessons();
  }, []);

  const availableGrades = useMemo(() => {
    return [...new Set(lessons.map((l) => l.grade))].sort((a, b) => a - b);
  }, [lessons]);

  const availableMonths = useMemo(() => {
    return [...new Set(lessons.map((l) => l.teachingMonth))].sort(
      (a, b) => a - b
    );
  }, [lessons]);

  const filteredLessons = useMemo(() => {
    return lessons.filter((l) => {
      const matchKeyword = `${l.name} ${l.code}`
        .toLowerCase()
        .includes(keyword.toLowerCase());

      const matchGrade = grade ? l.grade === grade : true;
      const matchMonth = month ? l.teachingMonth === month : true;

      return matchKeyword && matchGrade && matchMonth;
    });
  }, [lessons, keyword, grade, month]);

  const totalPages = Math.ceil(filteredLessons.length / PAGE_SIZE);

  const pagedLessons = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredLessons.slice(start, start + PAGE_SIZE);
  }, [filteredLessons, page]);

  const handleReload = () => {
    setKeyword("");
    setGrade("");
    setMonth("");
    setPage(1);
    loadLessons();
  };

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>

      <Typography 
        variant="h4" 
        fontWeight={700} 
        gutterBottom
        sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }} 
      >
        Danh sách bài giảng
      </Typography>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="stretch" 
        sx={{ mb: 3 }}
      >

        <TextField
          placeholder="Tìm theo tên hoặc mã bài giảng..."
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(1);
          }}
          fullWidth
          sx={{ flex: { md: 1 } }} 
        />

  
        <FormControl sx={{ minWidth: { xs: '100%', md: 180 } }}>
          <InputLabel>Khối dạy</InputLabel>
          <Select
            value={grade}
            label="Khối dạy"
            onChange={(e) => {
              setGrade(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {availableGrades.map((g) => (
              <MenuItem key={g} value={g}>
                Khối {g}
              </MenuItem>
            ))}
          </Select>
        </FormControl>


        <FormControl sx={{ minWidth: { xs: '100%', md: 180 } }}>
          <InputLabel>Tháng giảng dạy</InputLabel>
          <Select
            value={month}
            label="Tháng giảng dạy"
            onChange={(e) => {
              setMonth(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {availableMonths.map((m) => (
              <MenuItem key={m} value={m}>
                Tháng {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

 
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleReload}
          sx={{
            height: 56,
            minWidth: { xs: '100%', md: 120 }, 
            borderRadius: 2,
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          Tải lại
        </Button>
      </Stack>


      {filteredLessons.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4, bgcolor: '#f9f9f9', borderRadius: 2 }}>
            <Typography color="text.secondary">
            Không tìm thấy bài giảng nào phù hợp.
            </Typography>
        </Box>
      )}

      {pagedLessons.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            overflowX: "auto", 
          }}
        >
          <Table sx={{ minWidth: 650 }}> 
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f7fa" }}>
                <TableCell width={100}><b>Ảnh bìa</b></TableCell>
                <TableCell><b>Tên bài giảng</b></TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}><b>Mã bài giảng</b></TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}><b>Khối</b></TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}><b>Tháng</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {pagedLessons.map((lesson) => (
                <TableRow
                  key={lesson.id}
                  hover
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "rgba(46, 125, 50, 0.06)" },
                  }}
                  onClick={() => navigate(`/teacher/lessons/${lesson.id}`)}
                >
                  <TableCell>
                    <Box
                      component="img"
                      src={lesson.coverImage ? `${API_URL}${lesson.coverImage}` : "https://via.placeholder.com/150"}
                      alt={lesson.name}
                      sx={{
                        width: 72,
                        height: 72,
                        objectFit: "cover",
                        borderRadius: 2,
                        border: "1px solid #e0e0e0",
                        backgroundColor: "#fafafa",
                      }}
                    />
                  </TableCell>

                  <TableCell sx={{ fontWeight: 600, minWidth: 200 }}>
                    {lesson.name}
                  </TableCell>

                  <TableCell>{lesson.code}</TableCell>
                  <TableCell>{lesson.grade}</TableCell>
                  <TableCell>{lesson.teachingMonth}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}


      {totalPages > 1 && (
        <Stack alignItems="center" sx={{ mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary" 
            size="medium"
            sx={{
                '& .MuiPaginationItem-root': {
                    fontSize: { xs: '0.8rem', md: '1rem' }
                }
            }}
          />
        </Stack>
      )}
    </Box>
  );
}