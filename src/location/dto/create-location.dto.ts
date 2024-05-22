import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateLocationDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "string",
        example: "Le Quang Dinh Street, Binh Thanh District",
        description: "name of the location"
    })
    location_name: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "string",
        example: "Le Quang Dinh Street, Binh Thanh District",
        description: "address of the location"
    })
    location_address: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "city id",
        example: "uuidv4 44fgwev-gjdwffe3-nmrk",
        description: "location of city"
    })
    city_id: string;

}
