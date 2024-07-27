import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './interceptors/currentUser.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthService, CurrentUserInterceptor, {
    provide: APP_INTERCEPTOR,
    useClass: CurrentUserInterceptor
  }],
  imports: [TypeOrmModule.forFeature([User])]
})
export class UsersModule { }
