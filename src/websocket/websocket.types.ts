import { BoardElement } from '../board/interfaces/board.interface';

export interface JoinBoardData {
  boardId: string;
}

export interface DrawElementData {
  boardId: string;
  element: BoardElement;
}

export interface UpdateElementData {
  boardId: string;
  elementId: string;
  updates: Partial<BoardElement>;
}

export interface DeleteElementData {
  boardId: string;
  elementId: string;
}

export interface JoinBoardResponse {
  event: 'joinedBoard' | 'leftBoard';
  data: {
    boardId: string;
  };
}

export interface DrawElementResponse {
  event: 'elementDrawn';
  data: BoardElement;
}

export interface UpdateElementResponse {
  event: 'elementUpdated';
  data: {
    boardId: string;
    elementId: string;
    updates: Partial<BoardElement>;
  };
}

export interface DeleteElementResponse {
  event: 'elementDeleted';
  data: {
    boardId: string;
    elementId: string;
  };
}

export type WebSocketEvent =
  | 'joinBoard'
  | 'leaveBoard'
  | 'drawElement'
  | 'updateElement'
  | 'deleteElement'
  | 'joinedBoard'
  | 'leftBoard'
  | 'elementDrawn'
  | 'elementUpdated'
  | 'elementDeleted';
