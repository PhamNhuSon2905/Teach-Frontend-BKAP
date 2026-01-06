import axiosClient from '../api/axiosClient';
import { Lesson, LessonFile } from '../types';

const lessonApi = {
  // Get all lessons from backend
  getAllLessons: () => axiosClient.get('/api/v1/lesson'),
  
  // Get lesson by ID
  getLessonById: (id: number) => axiosClient.get(`/api/v1/lesson/${id}`),
  
  // Create a new lesson
  createLesson: (data: Omit<Lesson, 'id'>) => axiosClient.post('/api/v1/lesson', data),
  
  // Update lesson
  updateLesson: (id: number, data: Partial<Lesson>) => axiosClient.put(`/api/v1/lesson/${id}`, data),
  
  // Delete lesson
  deleteLesson: (id: number) => axiosClient.delete(`/api/v1/lesson/${id}`),

  // Lesson files (if your backend supports this)
  getLessonFiles: (lessonId: number) => axiosClient.get(`/api/v1/lesson/${lessonId}/files`),
  
  uploadFile: (lessonId: number, formData: FormData) => 
    axiosClient.post(`/api/v1/lesson/${lessonId}/files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  deleteFile: (lessonId: number, fileId: number) => 
    axiosClient.delete(`/api/v1/lesson/${lessonId}/files/${fileId}`),
  
  // Download file
  downloadFile: (lessonId: number, fileId: number) => 
    axiosClient.get(`/api/v1/lesson/${lessonId}/files/${fileId}/download`, {
      responseType: 'blob'
    }),
};

export default lessonApi;