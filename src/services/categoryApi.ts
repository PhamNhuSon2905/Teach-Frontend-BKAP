import axiosClient from '../api/axiosClient';
import { Category } from '../types';

const categoryApi = {
  getAll: () => axiosClient.get('/categories'),
  getById: (id: number) => axiosClient.get(`/categories/${id}`),
  create: (data: Omit<Category, 'id'>) => axiosClient.post('/categories', data),
  update: (id: number, data: Partial<Category>) => axiosClient.put(`/categories/${id}`, data),
  delete: (id: number) => axiosClient.delete(`/categories/${id}`),
  // Get subcategories
  getSubcategories: (parentId: number) => axiosClient.get(`/categories/${parentId}/subcategories`),
};

export default categoryApi;