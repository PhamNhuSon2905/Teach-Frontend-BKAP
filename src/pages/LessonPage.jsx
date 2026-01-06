import React, { useEffect, useState } from "react";
import { Typography, List, ListItem, ListItemText } from "@mui/material";
import lessonApi from "../api/lessonApi";
import { useParams } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";

export default function LessonPage() {
  useScrollToTop();
  const { id } = useParams();
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    lessonApi.getByCourse(id).then(res => setLessons(res.data)).catch(() => setLessons([]));
  }, [id]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>Bài giảng</Typography>
      <List>
        {lessons.map(l => (
          <ListItem key={l.id}>
            <ListItemText primary={l.title} secondary={l.description} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
