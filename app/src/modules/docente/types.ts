export type EtapaAcademica = 'INFANTIL' | 'SECUNDARIA' | 'AVANZADO';

export interface Materia {
  id: string;
  nombre: string;
  icono: string;
  color: string;
  descripcion: string;
}

export interface Nivel {
  id: string;
  materia_id: string;
  etapa_academica: EtapaAcademica;
  numero_nivel: number;
  titulo: string;
  recompensa_experiencia: number;
}

export interface Opcion {
  id: string;
  texto: string;
  es_correcta: boolean;
  orden: number;
}

export interface Pregunta {
  id: string;
  nivel_id: string;
  materia_id: string;
  etapa_academica: EtapaAcademica;
  enunciado: string;
  explicacion_formativa: string;
  pista: string;
  puntos: number;
  orden: number;
  opciones: Opcion[];
}
