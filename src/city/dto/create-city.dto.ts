import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCityDto {
    @ApiProperty({
        default: 'string',
        example: "City name",
        description: "Create a city with name"
    })
    @IsString()
    @IsNotEmpty()
    city_name: string;
}
