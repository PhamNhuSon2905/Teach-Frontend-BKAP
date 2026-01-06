import axiosClient from '../api/axiosClient';
import { Activity, View } from '../types';

const activityApi = {
  // Activity logs
  getAllActivities: () => axiosClient.get('/activities'),
  getUserActivities: (userId: number) => axiosClient.get(`/users/${userId}/activities`),
  logActivity: (data: Omit<Activity, 'id' | 'timestamp'>) => axiosClient.post('/activities', data),

  // View tracking
  getAllViews: () => axiosClient.get('/views'),
  getLessonViews: (lessonId: number) => axiosClient.get(`/lessons/${lessonId}/views`),
  getUserViews: (userId: number) => axiosClient.get(`/users/${userId}/views`),
  trackView: (data: Omit<View, 'id' | 'timestamp'>) => axiosClient.post('/views', data),
};

export default activityApi;