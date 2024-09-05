import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { UserEntity } from './modules/users/entities/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { RolesManagementModule } from './roles-management/roles-management.module';
import { RoleEntity } from './roles-management/entities/role.entity';
import { AssignRoleEntity } from './roles-management/entities/assign-role.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env'
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [UserEntity, RoleEntity, AssignRoleEntity], 
        synchronize: true, // Set to false in production
      })
    }),
    UsersModule,
    AuthModule,
    RolesManagementModule
  ],
  controllers: [],
  providers: [
    JwtAuthGuard,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true
      })
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
     LoggerMiddleware
    ).forRoutes('*')
  }
  
}
