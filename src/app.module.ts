import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { WebsocketModule } from './websocket/websocket.module';
import { BoardModule } from './boards/board.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    WebsocketModule,
    BoardModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
