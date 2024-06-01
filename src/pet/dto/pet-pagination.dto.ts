import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class PetPagination {
    // @IsNotEmpty()
    // @IsInt()
    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({
        default: 1,
    })
    readonly page?: number;

    // @IsNotEmpty()
    // @IsInt()
    @IsOptional()
    // @IsNotEmpty()
    @ApiProperty({
        default: 10
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