import type { Materia, Nivel, Pregunta } from './types';

export const materiasIniciales: Materia[] = [
  {
    id: 'mat-matematicas',
    nombre: 'Matemáticas',
    icono: 'calculator',
    color: '#22c55e',
    descripcion: 'Aritmética, álgebra, cálculo y razonamiento numérico.'
  },
  {
    id: 'mat-ciencias',
    nombre: 'Ciencias Naturales',
    icono: 'dna',
    color: '#38bdf8',
    descripcion: 'Biología, física, ecosistemas y leyes naturales.'
  },
  {
    id: 'mat-programacion',
    nombre: 'Programación y Algoritmos',
    icono: 'code',
    color: '#a855f7',
    descripcion: 'Lógica computacional, desarrollo y estructuras de datos.'
  },
  {
    id: 'mat-historia',
    nombre: 'Historia Universal',
    icono: 'book',
    color: '#f59e0b',
    descripcion: 'Grandes civilizaciones, eventos históricos y geografía.'
  }
];

export const nivelesIniciales: Nivel[] = [
  {
    id: 'niv-inf-01',
    materia_id: 'mat-matematicas',
    etapa_academica: 'INFANTIL',
    numero_nivel: 1,
    titulo: 'Sumas y Restas Básicas',
    recompensa_experiencia: 50
  },
  {
    id: 'niv-sec-01',
    materia_id: 'mat-ciencias',
    etapa_academica: 'SECUNDARIA',
    numero_nivel: 1,
    titulo: 'Leyes de Newton y Movimiento',
    recompensa_experiencia: 60
  },
  {
    id: 'niv-av-01',
    materia_id: 'mat-programacion',
    etapa_academica: 'AVANZADO',
    numero_nivel: 1,
    titulo: 'Complejidad Algorítmica y Big O',
    recompensa_experiencia: 80
  }
];

export const preguntasIniciales: Pregunta[] = [
  {
    id: 'prg-inf-01',
    nivel_id: 'niv-inf-01',
    materia_id: 'mat-matematicas',
    etapa_academica: 'INFANTIL',
    enunciado: '¿Cuánto es 7 + 8?',
    explicacion_formativa: '¡Excelente! Si a 7 le sumas 3 obtienes 10, y al agregar los 5 restantes da 15.',
    pista: 'Recuerda completar decenas primero.',
    puntos: 10,
    orden: 1,
    opciones: [
      { id: 'opc-inf-01', texto: '14', es_correcta: false, orden: 1 },
      { id: 'opc-inf-02', texto: '15', es_correcta: true, orden: 2 },
      { id: 'opc-inf-03', texto: '16', es_correcta: false, orden: 3 },
      { id: 'opc-inf-04', texto: '13', es_correcta: false, orden: 4 }
    ]
  },
  {
    id: 'prg-sec-01',
    nivel_id: 'niv-sec-01',
    materia_id: 'mat-ciencias',
    etapa_academica: 'SECUNDARIA',
    enunciado: '¿Cuál ley establece que toda acción genera una reacción de igual magnitud pero en sentido opuesto?',
    explicacion_formativa: 'La Tercera Ley de Newton (Principio de Acción y Reacción) explica que las fuerzas siempre actúan en pares sobre cuerpos diferentes.',
    pista: 'Piensa en el empuje al saltar desde una barca.',
    puntos: 15,
    orden: 1,
    opciones: [
      { id: 'opc-sec-01', texto: 'Primera Ley (Inercia)', es_correcta: false, orden: 1 },
      { id: 'opc-sec-02', texto: 'Segunda Ley (Fuerza = Masa × Aceleración)', es_correcta: false, orden: 2 },
      { id: 'opc-sec-03', texto: 'Tercera Ley (Acción y Reacción)', es_correcta: true, orden: 3 },
      { id: 'opc-sec-04', texto: 'Ley de Gravitación Universal', es_correcta: false, orden: 4 }
    ]
  },
  {
    id: 'prg-av-01',
    nivel_id: 'niv-av-01',
    materia_id: 'mat-programacion',
    etapa_academica: 'AVANZADO',
    enunciado: '¿Cuál es la complejidad temporal en el peor caso de la búsqueda binaria sobre un arreglo ordenado de tamaño N?',
    explicacion_formativa: 'La búsqueda binaria descarta la mitad de los elementos en cada paso, por lo que su crecimiento es logarítmico O(log N).',
    pista: 'En cada iteración divides el espacio de búsqueda entre 2.',
    puntos: 20,
    orden: 1,
    opciones: [
      { id: 'opc-av-01', texto: 'O(1)', es_correcta: false, orden: 1 },
      { id: 'opc-av-02', texto: 'O(N)', es_correcta: false, orden: 2 },
      { id: 'opc-av-03', texto: 'O(log N)', es_correcta: true, orden: 3 },
      { id: 'opc-av-04', texto: 'O(N log N)', es_correcta: false, orden: 4 }
    ]
  }
];
