import { ApiProperty } from "@nestjs/swagger";
import {
    //IsNotEmpty, 
    IsOptional,
} from "class-validator";

export class PaymentPagination {
    // @IsNotEmpty()
    // @IsInt()
    @IsOptional()
    // @IsNotEmpty()
    @ApiProperty({
        default: 1,
        required: false
    })
    readonly page?: number;

    // @IsNotEmpty()
    // @IsInt()
    @IsOptional()
    // @IsNotEmpty()
    @ApiProperty({ 
        default: 10, 
        required: false
    })
    readonly limit?: number;
};