import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePetTypeDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default:"string",
        example:"dog",
        description:"name of pet type"
    })
    type_name:string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default:"string",
        example:"dog is a dog always dog>>>>",
        description:"description of pet type"
    })
    type_description:string;
}
