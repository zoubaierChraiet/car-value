import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUserDto';
import { UsersService } from './users.service';
import { SerializeInterceptor } from 'src/interceptors/serializeInterceptor';
import { UserDto } from './dtos/userDto';
import { AuthService } from './auth.service';

@Controller('auth')
export class UsersController {

    constructor(private usersService: UsersService, private authService: AuthService) { }

    @Post('/signin')
    @UseInterceptors(new SerializeInterceptor(UserDto))
    signin(@Body() body: CreateUserDto) {
        return this.authService.signin(body.email, body.password)
    }

    @Post('/signup')
    @UseInterceptors(new SerializeInterceptor(UserDto))
    createUser(@Body() body: CreateUserDto) {
        return this.authService.signup(body.email, body.password)
    }

    @Get('/:id')
    @UseInterceptors(new SerializeInterceptor(UserDto))
    findUser(@Param("id") id: string) {
        return this.usersService.findOne(id)
    }

    @Get('')
    @UseInterceptors(new SerializeInterceptor(UserDto))
    findAllUsers(@Query("email") email: string) {
        return this.usersService.find(email)
    }

    @Patch('/:id')
    @UseInterceptors(new SerializeInterceptor(UserDto))
    updateUser(@Param("id") id: string, @Body() body: Partial<CreateUserDto>) {
        return this.usersService.update(id, body)
    }

    @Delete('/:id')
    @UseInterceptors(new SerializeInterceptor(UserDto))
    deleteUser(@Param("id") id: string) {
        this.usersService.remove(id)
    }
}
