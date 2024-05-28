import { Module } from '@nestjs/common';
import { LoggerService } from './service/logger.service';

@Module({
    providers: [LoggerService]
})
export class MyLoggerModule { }
