import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { UsersService } from "../users.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private usersService: UsersService) { }
    intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // Run before request is handled
        // By the request handler
        const request = context.switchToHttp().getRequest()
        const userId = request.session.userId
        if (userId) {
            const user = this.usersService.findOne(userId)
            request.currentUser = user
        }
        return handler.handle()
    }
}