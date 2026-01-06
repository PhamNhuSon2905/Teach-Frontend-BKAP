import axiosClient from '../api/axiosClient';
import { Role, Permission } from '../types';

const roleApi = {
  // Roles
  getAllRoles: () => axiosClient.get('/roles'),
  getRoleById: (id: number) => axiosClient.get(`/roles/${id}`),
  createRole: (data: Omit<Role, 'id'>) => axiosClient.post('/roles', data),
  updateRole: (id: number, data: Partial<Role>) => axiosClient.put(`/roles/${id}`, data),
  deleteRole: (id: number) => axiosClient.delete(`/roles/${id}`),

  // Permissions
  getRolePermissions: (roleId: number) => axiosClient.get(`/roles/${roleId}/permissions`),
  updateRolePermissions: (roleId: number, data: Omit<Permission, 'id' | 'role_id'>) => 
    axiosClient.put(`/roles/${roleId}/permissions`, data),
};

export default roleApi;