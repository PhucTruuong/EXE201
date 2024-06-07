import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateBookingDto {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        example: "uuid",
        default: "uuid",
        description: "uuid of appointment"
    })
    appointment_id: string;
    @ApiProperty({
        default: new Date(),
        description: "date which book a appointment"
    })
    booking_date: Date;
}
