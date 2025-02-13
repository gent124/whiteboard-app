import {
  WhiteboardSocketService,
  Position,
  WhiteboardElement,
} from '../services/whiteboard-socket.service';

export class DrawingCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isDrawing = false;
  private currentPath: Position[] = [];

  constructor(
    private container: HTMLElement,
    private socketService: WhiteboardSocketService,
    private boardId: string,
  ) {
    console.log('Initializing DrawingCanvas...');
    this.initializeCanvas();
    this.setupEventListeners();
    this.setupSocketListeners();
  }

  private initializeCanvas() {
    console.log('Setting up canvas...');
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.container.clientWidth || 800;
    this.canvas.height = this.container.clientHeight || 600;
    this.canvas.style.border = '1px solid #ccc';
    this.container.appendChild(this.canvas);

    const context = this.canvas.getContext('2d');
    if (!context) throw new Error('Could not get canvas context');
    this.ctx = context;
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    console.log('Canvas setup complete');
  }

  private setupEventListeners() {
    console.log('Setting up event listeners...');
    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.stopDrawing());
    this.canvas.addEventListener('mouseout', () => this.stopDrawing());

    // Touch events
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.startDrawing(touch);
    });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.draw(touch);
    });

    this.canvas.addEventListener('touchend', () => {
      this.stopDrawing();
    });
    console.log('Event listeners setup complete');
  }

  private setupSocketListeners() {
    console.log('Setting up socket listeners...');
    this.socketService.onElementDrawn((element: WhiteboardElement) => {
      console.log('Received drawn element:', element);
      if (element.type === 'DRAWING') {
        this.drawPath(
          element.content.points,
          element.style?.color || '#000',
          element.style?.strokeWidth || 2,
        );
      }
    });
  }

  private startDrawing(e: MouseEvent | Touch) {
    console.log('Starting to draw...');
    this.isDrawing = true;
    const pos = this.getPosition(e);
    this.currentPath = [pos];
    this.ctx.beginPath();
    this.ctx.moveTo(pos.x, pos.y);
  }

  private draw(e: MouseEvent | Touch) {
    if (!this.isDrawing) return;
    console.log('Drawing...');

    const pos = this.getPosition(e);
    this.currentPath.push(pos);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
  }

  private stopDrawing() {
    if (!this.isDrawing) return;
    console.log('Stopping drawing...');
    this.isDrawing = false;

    if (this.currentPath.length > 1) {
      const element: WhiteboardElement = {
        id: crypto.randomUUID(),
        type: 'DRAWING',
        content: {
          points: this.currentPath,
        },
        position: { x: 0, y: 0 }, // For drawings, we use points array instead
        style: {
          color: this.ctx.strokeStyle,
          strokeWidth: this.ctx.lineWidth,
        },
      };

      console.log('Sending drawn element:', element);
      this.socketService.drawElement(element);
    }

    this.currentPath = [];
  }

  private drawPath(points: Position[], color: string, strokeWidth: number) {
    const originalStyle = this.ctx.strokeStyle;
    const originalWidth = this.ctx.lineWidth;

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = strokeWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }

    this.ctx.stroke();
    this.ctx.strokeStyle = originalStyle;
    this.ctx.lineWidth = originalWidth;
  }

  private getPosition(e: MouseEvent | Touch): Position {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  public setColor(color: string) {
    console.log('Setting color:', color);
    this.ctx.strokeStyle = color;
  }

  public setLineWidth(width: number) {
    console.log('Setting line width:', width);
    this.ctx.lineWidth = width;
  }

  public clear() {
    console.log('Clearing canvas');
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
