export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  id: number;
  name: string;
  email: string;
}

export interface ApiErrorBody {
  code: string;
  message: string;
}

export type ExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type EnrollmentStatus = 'ACTIVE' | 'WITHDRAWN';

export interface Activity {
  id: number;
  name: string;
  discipline: string;
  date: string;
  vacancies: number;
  description: string;
  location: string;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface Enrollment {
  id: number;
  resourceId: number;
  resourceName: string;
  experienceLevel: ExperienceLevel;
  status: EnrollmentStatus;
}
