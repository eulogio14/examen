import { http } from './client';
import type {
  Activity,
  Enrollment,
  ExperienceLevel,
  LoginResponse,
  Paginated,
  RegisterResponse,
} from '../types/types';

export const authApi = {
  login: (email: string, password: string): Promise<LoginResponse> =>
    http.post<LoginResponse>('/auth/login', { email, password }).then((response) => response.data),

  register: (name: string, email: string, password: string): Promise<RegisterResponse> =>
    http.post<RegisterResponse>('/auth/register', { name, email, password }).then((response) => response.data),
};

export const activitiesApi = {
  list: (page: number, size: number): Promise<Paginated<Activity>> =>
    http.get<Paginated<Activity>>('/activities', { params: { page, size } }).then((response) => response.data),

  detail: (id: number): Promise<Activity> =>
    http.get<Activity>(`/activities/${id}`).then((response) => response.data),

  enroll: (id: number, experienceLevel: ExperienceLevel): Promise<Enrollment> =>
    http.post<Enrollment>(`/activities/${id}/enrollments`, { experienceLevel }).then((response) => response.data),
};

export const enrollmentsApi = {
  mine: (): Promise<Enrollment[]> =>
    http.get<Enrollment[]>('/me/enrollments').then((response) => response.data),

  withdraw: (id: number): Promise<Enrollment> =>
    http.patch<Enrollment>(`/enrollments/${id}/withdraw`).then((response) => response.data),
};
