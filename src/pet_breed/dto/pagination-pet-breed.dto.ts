import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class PetBreedPagination {
    //@IsNotEmpty()
    // @IsInt()
    @IsOptional()
    @ApiProperty({
        default: 1,
        required: false
    })
    readonly page?: number;

    //@IsNotEmpty()
    // @IsInt()
    @IsOptional()
    @ApiProperty({ 
        default: 10, 
        required: false
    })
    readonly limit?: number;
};