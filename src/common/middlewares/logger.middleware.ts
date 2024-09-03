import { Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger();
    use(req: Request, res: Response, next: (error?: Error | any) => void) {
        this.logger.log(`Request - method: ${req.method} url: ${req.originalUrl}`);
        next();
    }
    
}