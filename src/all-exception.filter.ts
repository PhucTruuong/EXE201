import {
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from "@nestjs/core";
import { LoggerService } from './my-logger/service/logger.service';
import { Request, Response } from 'express';

type MyResponseObject = {
    statusCode: number;
    timestamp: string;
    path: string;
    response: string | object;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    private readonly logger = new LoggerService(AllExceptionsFilter.name)

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const myResponseObj: MyResponseObject = {
            statusCode: 500,
            timestamp: new Date().toISOString(),
            path: request.url,
            response: '' || {},
        }

        if (exception instanceof HttpException) {
            myResponseObj.statusCode = exception.getStatus()
            myResponseObj.response = exception.getResponse()
        } else {
            myResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR
            myResponseObj.response = 'Internal Server Error'
        }

        response 
            .status(myResponseObj.statusCode) 
            .json(myResponseObj)

        this.logger.error(myResponseObj.response, AllExceptionsFilter.name)

        super.catch(exception, host)
    };
};
