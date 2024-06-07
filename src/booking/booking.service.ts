import { 
  ConflictException, 
  HttpException, 
  Injectable, 
  InternalServerErrorException, 
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingRepository } from './booking.repository';
import { BookingPagination } from './dto/pagination-booking.dto';
import { RequestWithUser } from 'src/interface/request-interface';

@Injectable()
export class BookingService {
  constructor(private readonly bookingRepository: BookingRepository) {

  }
  public async find(pagination: BookingPagination): Promise<{
    data: object[],
    totalCount: number
  } | InternalServerErrorException | NotFoundException | BadRequestException> {
    return this.bookingRepository.find(pagination)
  };

  public async create(createBookingDto: CreateBookingDto, req: RequestWithUser): Promise<
    object | InternalServerErrorException | HttpException | ConflictException | NotFoundException
  > {
    return this.bookingRepository.create(createBookingDto, req)
  };

  public async findOne(id: string): Promise<
    object | InternalServerErrorException | HttpException | NotFoundException
  > {
    return this.bookingRepository.findOne(id)
  };

  public async update(id: string, updateBookingDto: UpdateBookingDto): Promise<
    object | InternalServerErrorException | NotFoundException | HttpException
  > {
    return this.bookingRepository.update(id, updateBookingDto)
  };

  public async delete(id: string): Promise<
    object | InternalServerErrorException | HttpException | NotFoundException
  > {
    return this.bookingRepository.delete(id)
  };

  public async findByUser(req: RequestWithUser, pagination: BookingPagination): Promise<{
    data: object[],
    totalCount: number
  } | InternalServerErrorException | NotFoundException> {
    return this.bookingRepository.findByUser(req, pagination)
  };
};
