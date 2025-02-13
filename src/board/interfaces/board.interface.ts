export interface Point {
  x: number;
  y: number;
}

export interface Style {
  strokeColor: string;
  strokeWidth: number;
  fillColor?: string;
  opacity?: number;
  fontSize?: number;
  fontFamily?: string;
}

export type ElementType = 'line' | 'rectangle' | 'circle' | 'text' | 'freehand';

export interface BoardElement {
  id: string;
  type: ElementType;
  points: Point[];
  style: Style;
  text?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  collaborators: string[];
  elements: BoardElement[];
  createdAt: Date;
  updatedAt: Date;
}
