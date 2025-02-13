import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as PDFDocument from 'pdfkit';
import * as sharp from 'sharp';
import { Board, BoardElement } from './interfaces/board.interface';
import { CreateElementDto } from './dto/create-element.dto';
import {
  boardInclude,
  elementInclude,
  mapPrismaBoardToBoard,
  mapPrismaBoardElementToBoardElement,
} from '../prisma/prisma.types';
import { Prisma } from '@prisma/client';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}

  async createBoard(
    userId: string,
    name: string,
    description?: string,
  ): Promise<Board> {
    const prismaBoard = await this.prisma.board.create({
      data: {
        name,
        description,
        owner: {
          connect: { id: userId },
        },
      },
      include: boardInclude,
    });
    return mapPrismaBoardToBoard(prismaBoard);
  }

  async getBoard(boardId: string): Promise<Board> {
    const prismaBoard = await this.prisma.board.findUnique({
      where: { id: boardId },
      include: boardInclude,
    });

    if (!prismaBoard) {
      throw new NotFoundException('Board not found');
    }

    return mapPrismaBoardToBoard(prismaBoard);
  }

  async getUserBoards(userId: string): Promise<Board[]> {
    const prismaBoards = await this.prisma.board.findMany({
      where: {
        OR: [{ ownerId: userId }, { collaborators: { some: { id: userId } } }],
      },
      include: boardInclude,
    });
    return prismaBoards.map(mapPrismaBoardToBoard);
  }

  async addCollaborator(boardId: string, userId: string): Promise<Board> {
    const prismaBoard = await this.prisma.board.update({
      where: { id: boardId },
      data: {
        collaborators: {
          connect: { id: userId },
        },
      },
      include: boardInclude,
    });
    return mapPrismaBoardToBoard(prismaBoard);
  }

  async removeCollaborator(boardId: string, userId: string): Promise<Board> {
    const prismaBoard = await this.prisma.board.update({
      where: { id: boardId },
      data: {
        collaborators: {
          disconnect: { id: userId },
        },
      },
      include: boardInclude,
    });
    return mapPrismaBoardToBoard(prismaBoard);
  }

  async deleteBoard(boardId: string): Promise<Board> {
    const prismaBoard = await this.prisma.board.delete({
      where: { id: boardId },
      include: boardInclude,
    });
    return mapPrismaBoardToBoard(prismaBoard);
  }

  async addElement(
    boardId: string,
    elementData: CreateElementDto,
  ): Promise<BoardElement> {
    const content = JSON.parse(JSON.stringify(elementData.content)) ;
    const position = JSON.parse(JSON.stringify(elementData.position));
    const style = elementData.style
      ? JSON.parse(JSON.stringify(elementData.style))
      : undefined;

    const prismaElement = await this.prisma.element.create({
      data: {
        type: elementData.type,
        content,
        position,
        style,
        board: {
          connect: { id: boardId },
        },
      },
      include: elementInclude,
    });
    return mapPrismaBoardElementToBoardElement(prismaElement);
  }

  async updateElement(
    elementId: string,
    updates: Partial<CreateElementDto>,
  ): Promise<BoardElement> {
    const data: Prisma.ElementUpdateInput = {};
    if (updates.type) data.type = updates.type;
    if (updates.content)
      data.content = JSON.parse(JSON.stringify(updates.content));
    if (updates.position)
      data.position = JSON.parse(JSON.stringify(updates.position));
    if (updates.style) data.style = JSON.parse(JSON.stringify(updates.style));

    const prismaElement = await this.prisma.element.update({
      where: { id: elementId },
      data,
      include: elementInclude,
    });
    return mapPrismaBoardElementToBoardElement(prismaElement);
  }

  async deleteElement(elementId: string): Promise<BoardElement> {
    const prismaElement = await this.prisma.element.delete({
      where: { id: elementId },
      include: elementInclude,
    });
    return mapPrismaBoardElementToBoardElement(prismaElement);
  }

  async exportAsPDF(boardId: string): Promise<Buffer> {
    const board = await this.getBoard(boardId);
    const doc = new PDFDocument({ size: 'A4' });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));

    // Add board title
    doc.fontSize(24).text(board.name, { align: 'center' });
    if (board.description) {
      doc.fontSize(12).text(board.description, { align: 'center' });
    }

    doc.moveDown();

    // Add elements
    for (const element of board.elements) {
      doc.fontSize(10);
      if (element.type === 'TEXT') {
        doc.text(
          element.content.text || '',
          element.position.x,
          element.position.y,
        );
      } else if (element.type === 'STICKY_NOTE') {
        doc
          .rect(element.position.x, element.position.y, 150, 150)
          .fill(element.style?.backgroundColor || '#fff9c4')
          .stroke();
        doc.text(
          element.content.text || '',
          element.position.x + 10,
          element.position.y + 10,
        );
      }
    }

    doc.end();

    return new Promise((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
    });
  }

  async exportAsImage(boardId: string): Promise<Buffer> {
    const board = await this.getBoard(boardId);

    const width = 1920;
    const height = 1080;

    const canvas = sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    });

    const composites = board.elements
      .map((element) => {
        if (element.type === 'TEXT') {
          return {
            input: Buffer.from(''), // Replace with actual text-to-image conversion
            top: element.position.y,
            left: element.position.x,
          };
        } else if (element.type === 'IMAGE' && element.content.url) {
          return {
            input: element.content.url,
            top: element.position.y,
            left: element.position.x,
          };
        }
        return null;
      })
      .filter(
        (composite): composite is NonNullable<typeof composite> =>
          composite !== null,
      );

    return canvas.composite(composites).png().toBuffer();
  }
}
