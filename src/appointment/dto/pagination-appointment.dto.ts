import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class AppointmentPagination {
    @IsNotEmpty()
    // @IsInt()
    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({
        default: 1,
    })
    readonly page?: number;

    @IsNotEmpty()
    // @IsInt()
    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({ 
        default: 10 
    })
    readonly limit?: number;
};