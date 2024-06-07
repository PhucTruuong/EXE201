import { ApiProperty } from "@nestjs/swagger";
import {
    //IsNotEmpty,
    IsOptional
} from "class-validator";

export class PetPagination {
    // @IsNotEmpty()
    // @IsInt()
    @IsOptional()
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
    // @IsOptional()
    // @ApiProperty({
    //     default: 0,
    // })
    // readonly offset?: number;
    // @IsOptional()
    // @IsString()
    // @ApiProperty({
    //     default:"none"
    // })
    // readonly sort?: string;
};