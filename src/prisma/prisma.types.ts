import { Prisma } from '@prisma/client';
import {
  Board,
  BoardElement,
  ElementContent,
  Position,
  Style,
} from '../boards/interfaces/board.interface';

export type PrismaBoardWithRelations = Prisma.BoardGetPayload<{
  include: typeof boardInclude;
}>;

export type PrismaElementWithRelations = Prisma.ElementGetPayload<{
  include: typeof elementInclude;
}>;

export const boardInclude = {
  owner: true,
  collaborators: true,
  elements: true,
} as const;

export const elementInclude = {
  board: true,
} as const;

export function mapPrismaBoardToBoard(
  prismaBoard: PrismaBoardWithRelations,
): Board {
  return {
    id: prismaBoard.id,
    name: prismaBoard.name,
    description: prismaBoard.description || undefined,
    ownerId: prismaBoard.ownerId,
    owner: {
      id: prismaBoard.owner.id,
      email: prismaBoard.owner.email,
      name: prismaBoard.owner.name,
    },
    collaborators: prismaBoard.collaborators.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
    })),
    elements: prismaBoard.elements.map(mapPrismaBoardElementToBoardElement),
    createdAt: prismaBoard.createdAt,
    updatedAt: prismaBoard.updatedAt,
  };
}

export function mapPrismaBoardElementToBoardElement(
  prismaElement: PrismaElementWithRelations,
): BoardElement {
  const content = prismaElement.content as unknown as ElementContent;
  const position = prismaElement.position as unknown as Position;
  const style = prismaElement.style as unknown as Style | undefined;

  return {
    id: prismaElement.id,
    type: prismaElement.type,
    content,
    position,
    style,
    boardId: prismaElement.boardId,
    createdAt: prismaElement.createdAt,
    updatedAt: prismaElement.updatedAt,
  };
}
