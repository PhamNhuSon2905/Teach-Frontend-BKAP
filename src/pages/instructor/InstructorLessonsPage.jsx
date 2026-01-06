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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import lessonApi from "../../api/lessonApi";

const PAGE_SIZE = 3;

export default function InstructorLessonsPage() {
  const [lessons, setLessons] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [grade, setGrade] = useState("");
  const [month, setMonth] = useState("");
  const [page, setPage] = useState(1);
  const API_URL = process.env.REACT_APP_DEV_API_URL;

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
    <Box sx={{ px: 2 }}>
      {/* ===== TITLE ===== */}
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Danh sách bài giảng
      </Typography>


      {/* ===== FILTER BAR ===== */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="center"
        sx={{ mb: 3 }}
      >
        {/* SEARCH */}
        <TextField
          placeholder="Tìm theo tên hoặc mã bài giảng..."
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(1);
          }}
          sx={{width : 1000}}
        />

        {/* GRADE */}
        <FormControl sx={{ minWidth: 200 }}>
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

        {/* MONTH */}
        <FormControl sx={{ minWidth: 200 }}>
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

        {/* Refresh */}
        <Button
          startIcon={<RefreshIcon />}
          onClick={handleReload}
          sx={{
            height: 56,
            width : 100,
            borderRadius: 2,
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          Tải lại
        </Button>
      </Stack>

      {/* ===== EMPTY ===== */}
      {filteredLessons.length === 0 && (
        <Typography color="text.secondary">
          Không tìm kiếm thấy bài giảng phù hợp
        </Typography>
      )}

      {/* ===== TABLE ===== */}
      {pagedLessons.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f7fa" }}>
                <TableCell><b>Ảnh bìa</b></TableCell>
                <TableCell><b>Tên bài giảng</b></TableCell>
                <TableCell><b>Mã bài giảng</b></TableCell>
                <TableCell><b>Khối giảng dạy</b></TableCell>
                <TableCell><b>Tháng giảng dạy</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {pagedLessons.map((lesson) => (
                <TableRow
                  key={lesson.id}
                  hover
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "rgba(46, 125, 50, 0.06)",
                    },
                  }}
                  onClick={() =>
                    navigate(`/teacher/lessons/${lesson.id}`)
                  }
                >
                  <TableCell>
                    <Box
                      component="img"
                      src={`${API_URL}${lesson.coverImage}`}
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

                  <TableCell sx={{ fontWeight: 600 }}>
                    {lesson.name}
                  </TableCell>

                  <TableCell>{lesson.code}</TableCell>
                  <TableCell>Lớp {lesson.grade}</TableCell>
                  <TableCell>Tháng {lesson.teachingMonth}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <Stack alignItems="center" sx={{ mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="success"
          />
        </Stack>
      )}
    </Box>
  );
}
