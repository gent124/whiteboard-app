import { io, Socket } from 'socket.io-client';
import { ElementType } from '../../boards/interfaces/board.interface';

export interface Position {
  x: number;
  y: number;
}

export interface Style {
  [key: string]: any;
}

export interface WhiteboardElement {
  id: string;
  type: ElementType;
  content: any;
  position: Position;
  style?: Style;
}

export class WhiteboardSocketService {
  private socket: Socket;
  private currentBoardId: string | null = null;

  constructor(
    private baseUrl: string,
    private token: string,
  ) {
    this.socket = io(baseUrl, {
      auth: {
        token,
      },
    });

    this.socket.on('connect', () => {
      console.log('Connected to whiteboard server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from whiteboard server');
    });
  }

  joinBoard(boardId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.emit(
        'joinBoard',
        { boardId },
        (response: { error?: string }) => {
          if (response.error) {
            reject(new Error(response.error));
          } else {
            this.currentBoardId = boardId;
            resolve();
          }
        },
      );
    });
  }

  leaveBoard(): Promise<void> {
    if (!this.currentBoardId) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.socket.emit(
        'leaveBoard',
        { boardId: this.currentBoardId },
        (response: { error?: string }) => {
          if (response.error) {
            reject(new Error(response.error));
          } else {
            this.currentBoardId = null;
            resolve();
          }
        },
      );
    });
  }

  drawElement(element: WhiteboardElement): void {
    if (!this.currentBoardId) {
      throw new Error('Not connected to any board');
    }

    this.socket.emit('drawElement', {
      boardId: this.currentBoardId,
      element,
    });
  }

  updateElement(elementId: string, updates: Partial<WhiteboardElement>): void {
    if (!this.currentBoardId) {
      throw new Error('Not connected to any board');
    }

    this.socket.emit('updateElement', {
      boardId: this.currentBoardId,
      elementId,
      updates,
    });
  }

  deleteElement(elementId: string): void {
    if (!this.currentBoardId) {
      throw new Error('Not connected to any board');
    }

    this.socket.emit('deleteElement', {
      boardId: this.currentBoardId,
      elementId,
    });
  }

  onElementDrawn(callback: (element: WhiteboardElement) => void): void {
    this.socket.on('elementDrawn', callback);
  }

  onElementUpdated(
    callback: (data: {
      elementId: string;
      updates: Partial<WhiteboardElement>;
    }) => void,
  ): void {
    this.socket.on('elementUpdated', callback);
  }

  onElementDeleted(callback: (data: { elementId: string }) => void): void {
    this.socket.on('elementDeleted', callback);
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
