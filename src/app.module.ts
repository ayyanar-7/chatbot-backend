import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatBotModule } from './chat-bot/chat-bot.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatData } from './chat-bot/entities/chat-bot.entity';

@Module({
  imports: [ChatBotModule,
   ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [ChatData],
      synchronize: true, // Set to false in production
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
