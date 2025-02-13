import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { BoardAccessGuard } from './guards/board-access.guard';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateElementDto } from './dto/create-element.dto';
import { User } from '../shared/interfaces/user.interface';

@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Post()
  createBoard(
    @CurrentUser() user: User,
    @Body(ValidationPipe) createBoardDto: CreateBoardDto,
  ) {
    return this.boardService.createBoard(
      user.id,
      createBoardDto.name,
      createBoardDto.description,
    );
  }

  @Get()
  getUserBoards(@CurrentUser() user: User) {
    return this.boardService.getUserBoards(user.id);
  }

  @Get(':id')
  @UseGuards(BoardAccessGuard)
  getBoard(@Param('id') id: string) {
    return this.boardService.getBoard(id);
  }

  @Put(':id/collaborators')
  @UseGuards(BoardAccessGuard)
  addCollaborator(
    @Param('id') boardId: string,
    @Body('userId') userId: string,
  ) {
    return this.boardService.addCollaborator(boardId, userId);
  }

  @Delete(':id/collaborators/:userId')
  @UseGuards(BoardAccessGuard)
  removeCollaborator(
    @Param('id') boardId: string,
    @Param('userId') userId: string,
  ) {
    return this.boardService.removeCollaborator(boardId, userId);
  }

  @Delete(':id')
  @UseGuards(BoardAccessGuard)
  deleteBoard(@Param('id') id: string) {
    return this.boardService.deleteBoard(id);
  }

  @Post(':id/elements')
  @UseGuards(BoardAccessGuard)
  addElement(
    @Param('id') boardId: string,
    @Body(ValidationPipe) createElementDto: CreateElementDto,
  ) {
    return this.boardService.addElement(boardId, createElementDto);
  }

  @Put(':id/elements/:elementId')
  @UseGuards(BoardAccessGuard)
  updateElement(
    @Param('elementId') elementId: string,
    @Body(ValidationPipe) updates: CreateElementDto,
  ) {
    return this.boardService.updateElement(elementId, updates);
  }

  @Delete(':id/elements/:elementId')
  @UseGuards(BoardAccessGuard)
  deleteElement(@Param('elementId') elementId: string) {
    return this.boardService.deleteElement(elementId);
  }

  @Get(':id/export/pdf')
  @UseGuards(BoardAccessGuard)
  async exportPDF(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.boardService.exportAsPDF(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="board-${id}.pdf"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get(':id/export/image')
  @UseGuards(BoardAccessGuard)
  async exportImage(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.boardService.exportAsImage(id);
    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="board-${id}.png"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
