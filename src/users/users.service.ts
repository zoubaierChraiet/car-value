import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repository: Repository<User>) { }

    async create(email: string, password: string) {
        const newUser = this.repository.create({ email, password })
        return await this.repository.save(newUser)
    }

    async find(email: string) {
        const user = await this.repository.find({ where: { email } })
        return user
    }

    async findOne(id: number) {
        if (!id) return null
        const user = await this.repository.findOne({ where: { id } })
        return user
    }

    async update(id: number, attrs: Partial<User>) {
        const userToUpdate = await this.repository.findOne({ where: { id } })

        if (!userToUpdate) {
            throw new Error('User not extist')
        }

        return this.repository.save({ ...userToUpdate, ...attrs })
    }

    async remove(id: number) {
        const userToDelete = await this.repository.findOne({ where: { id } })

        if (!userToDelete) {
            throw new Error('User not extist')
        }

        this.repository.remove(userToDelete)
    }
}
