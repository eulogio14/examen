import { http } from './client';
import type {
  LoginResponse, RegisterResponse, Paginated, Activity,
  Enrollment, ExperienceLevel,
} from '../types/types';

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> =>
    (await http.post<LoginResponse>('/api/auth/login', { email, password })).data,

  // ⚠️ orden: name, email, password (coincide con el contrato)
  register: async (name: string, email: string, password: string): Promise<RegisterResponse> =>
    (await http.post<RegisterResponse>('/api/auth/register', { name, email, password })).data,
};

export const activitiesApi = {
  listar: async (page: number, size: number): Promise<Paginated<Activity>> =>
    (await http.get<Paginated<Activity>>('/api/activities', { params: { page, size } })).data,

  detalle: async (id: number): Promise<Activity> =>
    (await http.get<Activity>(`/api/activities/${id}`)).data,

  inscribirse: async (id: number, experienceLevel: ExperienceLevel): Promise<Enrollment> =>
    (await http.post<Enrollment>(`/api/activities/${id}/enrollments`, { experienceLevel })).data,
};

export const enrollmentsApi = {
  misInscripciones: async (): Promise<Enrollment[]> =>
    (await http.get<Enrollment[]>('/api/me/enrollments')).data,

  retirar: async (id: number): Promise<Enrollment> =>
    (await http.patch<Enrollment>(`/api/enrollments/${id}/withdraw`)).data,
};