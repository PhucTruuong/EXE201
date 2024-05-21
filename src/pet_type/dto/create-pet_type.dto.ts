import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePetTypeDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default:"string"
    })
    type_name:string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default:"string"
    })
    type_description:string;
}