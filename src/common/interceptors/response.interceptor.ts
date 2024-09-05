import { CallHandler, ExecutionContext, HttpException, HttpStatus, NestInterceptor } from "@nestjs/common";
import { Response } from "express";
import { catchError, map, Observable, throwError } from "rxjs";

export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const respose: Response = context.switchToHttp().getResponse();
        let statusCode = respose.statusCode;
        return next.handle().pipe(
            map(data => ({
                success: true,
                statusCode,
                data
            })),
            catchError(error => {
                statusCode = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
                return throwError(() => new HttpException({
                    success: false,
                    statusCode,
                    message: error.message,
                    originalResponse: error.response?.message ?? 'No response'
                }, statusCode))
            })
        )
    }
    
}