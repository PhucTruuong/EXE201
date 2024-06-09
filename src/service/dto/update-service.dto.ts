import { ApiProperty } from "@nestjs/swagger";
import { 
    IsNotEmpty, 
    IsNumber, 
    IsString, 
    IsUUID, 
    IsOptional
} from "class-validator";

export class UpdateServiceDto {
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        default: "uuid",
        example: "dfb35e40-2749-451d-8ffd-204b8100f351",
        description: "id of brand",
        required: true
    })
    brand_id: string;

    @IsString()
    @IsOptional()
    @IsUUID()
    @ApiProperty({
        default: "uuid",
        example: "728035dd-e8e4-4494-aa6f-43d8b3775d26",
        description: "id of category",
        required: false
    })
    category_id: string;

    @IsString()
    @IsOptional()
    @IsUUID()
    @ApiProperty({
        default: "uuid",
        example: "70f7c050-e927-4c92-837d-54fedfd3e503",
        description: "id of location",
        required: false
    })
    location_id: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        default: "service_name",
        example: "service_name",
        description: "Service namemust be string",
        required: false
    })
    service_name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        default: "service_description",
        example: "service_description",
        description: "Service namemust be string",
        required: false
    })
    service_description: string;

    @IsOptional()
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @ApiProperty({
        default: 245000,
        description: "Service price",
        required: false
    })
    service_price: number;

    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({
        default: "10:00:00",
        example: "10:00:00",
        description: "Start time of the service in ISO 8601 format with time zone",
        required: false
    })
    startTime: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        default: "14:00:00",
        example: "12:00:00",
        description: "Start time of the service in ISO 8601 format with time zone",
        required: false
    })
    endTime: string;

    @IsOptional()
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Image file of the pet',
        required: false
    })
    image: Express.Multer.File;
}
