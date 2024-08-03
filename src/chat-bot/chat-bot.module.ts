import { Module } from '@nestjs/common';
import { ChatBotService } from './chat-bot.service';
import { ChatBotController } from './chat-bot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatData } from './entities/chat-bot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatData]),
   ],
  controllers: [ChatBotController],
  providers: [ChatBotService],
})
export class ChatBotModule {}
