import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateBrandDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "string",
        example: "pet care for dog",
        description: "brand name for service"
    })
    brand_name: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "string",
        example: "pet care for dog , it support a lot of services for caring your dog,....",
        description: "brand description about brand name for service"
    })
    brand_description: string;

    @IsNotEmpty()
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Image file of the pet'
    })
    image: Express.Multer.File;

}
