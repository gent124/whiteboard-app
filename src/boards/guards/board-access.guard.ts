import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { BoardService } from '../board.service';

@Injectable()
export class BoardAccessGuard implements CanActivate {
  constructor(private boardService: BoardService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() ;
    const user = request.user;
    const boardId = request.params.id;

    if (!boardId) {
      return true; // No board ID means we're creating a new board
    }

    const board = await this.boardService.getBoard(boardId);

    // Check if user is the owner or a collaborator
    if (
      board.ownerId === user.id ||
      board.collaborators.some((collab) => collab.id === user.id)
    ) {
      return true;
    }

    throw new ForbiddenException('You do not have access to this board');
  }
}
