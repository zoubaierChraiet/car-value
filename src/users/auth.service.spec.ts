import { Test } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { UsersService } from "./users.service"
import { User } from "./user.entity"
import { BadRequestException, NotAcceptableException } from "@nestjs/common"

describe('AuthService', () => {
    let service: AuthService
    let fakeUsersService: Partial<UsersService>

    beforeEach(async () => {
        const users: User[] = []
        fakeUsersService = {
            find: (email: string) => Promise.resolve(users.filter(u => u.email === email)),
            create: (email: string, password: string) => {
                const user = { email, password, id: users.pop()?.id + 1 || 1 }
                users.push(user)
                return Promise.resolve(user)
            }
        }

        const module = await Test.createTestingModule({
            providers: [AuthService, { provide: UsersService, useValue: fakeUsersService }],
        }).compile()

        service = module.get(AuthService)
    })

    it("can create an instance of a service", async () => {
        expect(service).toBeDefined()
    })

    it("creates a new user hashed password", async () => {
        const userToAdd = await service.signup("zouba.chraiet@yahoo.com", "1234");
        expect(userToAdd.password).toBeDefined()
    })

    it("throws an error when trynig to sign up wih email that is in use", async () => {
        fakeUsersService.find = () => Promise.resolve([{ email: "areh", id: 4, password: "dqsdqs" } as User]);
        await expect(service.signup("qdsqdsqdqs", "1234")).rejects.toThrow(new BadRequestException("email already exists!!"))
    })

    it("throws if an invalid pass doesn't match", async () => {
        fakeUsersService.find = () => Promise.resolve([{ email: "areh@yahoo.com", id: 4, password: "123" } as User]);
        await expect(service.signin("areh@yahoo.com", "1234")).rejects.toThrow(new NotAcceptableException("Wrong password!!"))
    })

    it("signup a user when provided values are correct", async () => {
        const user = await service.signup("areh@yahoo.com", "123")
        fakeUsersService.find = () => Promise.resolve([{ email: "areh@yahoo.com", id: 4, password: user.password } as User]);
        const signedUser = await service.signin("areh@yahoo.com", "123")
        expect(signedUser).toBeDefined()
        expect(signedUser.password).toEqual(user.password)
    })

})