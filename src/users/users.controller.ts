import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUserDto';
import { UsersService } from './users.service';
import { SerializeInterceptor } from 'src/interceptors/serializeInterceptor';
import { UserDto } from './dtos/userDto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/currentUser.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@UseInterceptors(new SerializeInterceptor(UserDto))
export class UsersController {

    constructor(private usersService: UsersService, private authService: AuthService) { }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session) {
        const user = await this.authService.signin(body.email, body.password)
        session.userId = user.id
        return user
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session) {
        const user = await this.authService.signup(body.email, body.password)
        session.userId = user.id
        return user
    }

    @Get("/whoAmI")
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() currentUser: User) {
        return currentUser
    }

    @Post('/signout')
    async SignOut(@Session() session) {
        session.userId = null
    }

    @Get('/:id')
    findUser(@Param("id") id: string) {
        return this.usersService.findOne(+id)
    }

    @Get('')
    findAllUsers(@Query("email") email: string) {
        return this.usersService.find(email)
    }

    @Patch('/:id')
    updateUser(@Param("id") id: string, @Body() body: Partial<CreateUserDto>) {
        return this.usersService.update(+id, body)
    }

    @Delete('/:id')
    deleteUser(@Param("id") id: string) {
        this.usersService.remove(+id)
    }
}
