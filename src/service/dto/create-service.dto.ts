import { ApiProperty } from "@nestjs/swagger";
import { 
    IsNotEmpty, 
    IsNumber, 
    IsString, 
    IsUUID, 
} from "class-validator";

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        default: "uuid",
        example: "dfb35e40-2749-451d-8ffd-204b8100f351",
        description: "id of brand"
    })
    brand_id: string;

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        default: "uuid",
        example: "728035dd-e8e4-4494-aa6f-43d8b3775d26",
        description: "id of category"
    })
    category_id: string;

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        default: "uuid",
        example: "70f7c050-e927-4c92-837d-54fedfd3e503",
        description: "id of location"
    })
    location_id: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "service_name",
        example: "service_name",
        description: "Service namemust be string"
    })
    service_name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "service_description",
        example: "service_description",
        description: "Service namemust be string"
    })
    service_description: string;

    @IsNotEmpty()
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @ApiProperty({
        default: 245000,
        description: "Service price"
    })
    service_price: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "10:00:00",
        example: "10:00:00",
        description: "Start time of the service in ISO 8601 format with time zone"
    })
    startTime: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "14:00:00",
        example: "12:00:00",
        description: "Start time of the service in ISO 8601 format with time zone"
    })
    endTime: string;

    @IsNotEmpty()
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Image file of the pet'
    })
    image: Express.Multer.File;
}
