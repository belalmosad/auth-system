import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      database: 'auth',
      type:'postgres',
      username: 'postgres',
      password: 'mysecretpassword',
      port: 5432,
      host: 'localhost'
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
