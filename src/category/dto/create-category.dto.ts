import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default:"string"
    })
    category_name:string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default:"string"
    })
    category_description:string;
    @IsNotEmpty()
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Image file of the pet'
    })
    image: Express.Multer.File;
}
