import type { EnrollmentStatus, ExperienceLevel } from '../types/types';

export const ETIQUETAS_NIVEL: Record<ExperienceLevel, string> = {
  BEGINNER: 'Principiante',
  INTERMEDIATE: 'Intermedio',
  ADVANCED: 'Avanzado',
};

export const ETIQUETAS_ESTADO: Record<EnrollmentStatus, string> = {
  ACTIVE: 'Activa',
  WITHDRAWN: 'Retirada',
};

export const OPCIONES_NIVEL: ExperienceLevel[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
