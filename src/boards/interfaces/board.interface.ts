import { User } from '../../shared/interfaces/user.interface';
import { ElementType as PrismaElementType } from '@prisma/client';

export type ElementType = PrismaElementType;

export interface Position {
  x: number;
  y: number;
}

export interface Style {
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  [key: string]: any;
}

export interface ElementContent {
  text?: string;
  url?: string;
  points?: Position[];
  shape?: string;
  [key: string]: any;
}

export interface BoardElement {
  id: string;
  type: ElementType;
  content: ElementContent;
  position: Position;
  style?: Style;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  owner: User;
  collaborators: User[];
  elements: BoardElement[];
  createdAt: Date;
  updatedAt: Date;
}
