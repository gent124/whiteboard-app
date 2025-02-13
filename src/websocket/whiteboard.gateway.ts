import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  JoinBoardData,
  DrawElementData,
  UpdateElementData,
  DeleteElementData,
  JoinBoardResponse,
  DrawElementResponse,
  UpdateElementResponse,
  DeleteElementResponse,
} from './websocket.types';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WhiteboardGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private activeBoards: Map<string, Set<string>> = new Map();

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
    this.activeBoards.forEach((clients, boardId) => {
      if (clients.has(client.id)) {
        clients.delete(client.id);
        if (clients.size === 0) {
          this.activeBoards.delete(boardId);
        }
      }
    });
  }

  @SubscribeMessage('joinBoard')
  handleJoinBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinBoardData,
  ): JoinBoardResponse {
    const { boardId } = data;
    if (!this.activeBoards.has(boardId)) {
      this.activeBoards.set(boardId, new Set());
    }
    const clients = this.activeBoards.get(boardId);
    if (clients) {
      clients.add(client.id);
    }
    client.join(boardId);
    return { event: 'joinedBoard', data: { boardId } };
  }

  @SubscribeMessage('leaveBoard')
  handleLeaveBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinBoardData,
  ): JoinBoardResponse {
    const { boardId } = data;
    const clients = this.activeBoards.get(boardId);
    if (clients) {
      clients.delete(client.id);
      if (clients.size === 0) {
        this.activeBoards.delete(boardId);
      }
    }
    client.leave(boardId);
    return { event: 'leftBoard', data: { boardId } };
  }

  @SubscribeMessage('drawElement')
  handleDrawElement(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: DrawElementData,
  ): DrawElementResponse {
    const { boardId, element } = data;
    client.to(boardId).emit('elementDrawn', element);
    return { event: 'elementDrawn', data: element };
  }

  @SubscribeMessage('updateElement')
  handleUpdateElement(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: UpdateElementData,
  ): UpdateElementResponse {
    const { boardId, elementId, updates } = data;
    client.to(boardId).emit('elementUpdated', { elementId, updates });
    return { event: 'elementUpdated', data: { boardId, elementId, updates } };
  }

  @SubscribeMessage('deleteElement')
  handleDeleteElement(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: DeleteElementData,
  ): DeleteElementResponse {
    const { boardId, elementId } = data;
    client.to(boardId).emit('elementDeleted', { elementId });
    return { event: 'elementDeleted', data: { boardId, elementId } };
  }
}
