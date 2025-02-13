import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BoardController],
  providers: [BoardService, PrismaService],
  exports: [BoardService],
})
export class BoardModule {}
