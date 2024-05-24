import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateBookingDto {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        example:"uuid",
        default:"uuid",
        description:"uuid of appointment"
    })
    appointment_id: string;
    @ApiProperty({
        example:"2023-01-01T12:00:00.000Z",
        default:"2023-01-01T12:00:00.000Z",
        description:"date which book a appointment"
    })
    booking_date: Date;
}
