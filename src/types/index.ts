export interface User {
  id: number;
  username: string;
  password?: string; // optional khi trả về từ API
  role_id: number;
  email: string;
  phone: string;
  img_url: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
}

export interface Lesson {
  id: number;
  course_id: number;
  title: string;
  file_url: string;
  image_url: string;
}

export interface Activity {
  id: number;
  user_id: number;
  action: string;
  timestamp: string;
}

export interface Permission {
  id: number;
  role_id: number;
  can_upload: boolean;
  can_download: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  category_id: number | null; // Cho phép null nếu là category gốc
}

export interface LessonFile {
  id: number;
  lesson_id: number;
  file_path: string;
  file_type: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface View {
  id: number;
  user_id: number;
  lesson_id: number;
  timestamp: string;
}