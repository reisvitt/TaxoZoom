import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GamesModule } from './app/games/games.module';
import { DatabaseModule } from './databases/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    GamesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
