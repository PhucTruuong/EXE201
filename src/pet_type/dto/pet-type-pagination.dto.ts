import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class PetTypePagination {
    //@IsNotEmpty()
    // @IsInt()
    @IsOptional()
    //@IsNotEmpty()
    @ApiProperty({
        default: 1,
        required: false
    })
    readonly page?: number;

    //@IsNotEmpty()
    // @IsInt()
    @IsOptional()
    //@IsNotEmpty()
    @ApiProperty({ 
        default: 10, 
        required: false
    })
    readonly limit?: number;
};