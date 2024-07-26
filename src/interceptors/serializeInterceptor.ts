import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { map, Observable } from "rxjs";
import { UserDto } from "src/users/dtos/userDto";


export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any) { }
    intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // Run before request is handled
        // By the request handler
        console.log(context)

        return handler.handle().pipe(map((data) => {
            // Run something before data is sent out
            return plainToClass(this.dto, data, { excludeExtraneousValues: true })
        }))
    }
}