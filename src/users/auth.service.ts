import { BadRequestException, Injectable, NotFoundException, NotAcceptableException } from '@nestjs/common';
import { UsersService } from './users.service';
import { genSaltSync, hashSync, compare } from "bcryptjs"

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async signup(email: string, password: string) {
        const users = await this.usersService.find(email)

        if (users.length) {
            throw new BadRequestException("email already exists!!")
        }

        const salt = genSaltSync()
        const encrypted = hashSync(password, salt)

        return this.usersService.create(email, encrypted)
    }

    async signin(email: string, password: string) {
        const users = await this.usersService.find(email)
        if (!users.length) {
            throw new NotFoundException("email not found!!")
        }
        const existingUser = users[0]
        const isEqual = await compare(password, existingUser.password)
        console.log(isEqual)
        if (!isEqual) {
            throw new NotAcceptableException("Wrong password!!")
        }
        return existingUser
    }
}
