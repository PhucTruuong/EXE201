import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { feedbackRepository } from './feedback.repository';
import { FeedBackPagination } from './dto/pagination-feedback.dto';
import { RequestWithUser } from 'src/interface/request-interface';


@Injectable()
export class FeedbackService {
  constructor(private readonly feedBackRRepository: feedbackRepository) { }
  public async find(pagination: FeedBackPagination): Promise<{
    data: object[],
    totalCount: number
  } | InternalServerErrorException | NotFoundException> {
    return this.feedBackRRepository.find(pagination);
  }
  public async  create(createFeedbackDto: CreateFeedbackDto , req: RequestWithUser): Promise<
    object | InternalServerErrorException | HttpException | ConflictException | NotFoundException
  >{
    return this.feedBackRRepository.create(createFeedbackDto,req)
  }
  public async findOne(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException>{
    return this.feedBackRRepository.findOne(id)
  }
  public async update(id: string, updateFeedbackDto: UpdateFeedbackDto): Promise<object | InternalServerErrorException | NotFoundException | HttpException>{
    return this.feedBackRRepository.update(id, updateFeedbackDto);
  }
  public async delete(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException>{
    return this.feedBackRRepository.delete(id)
  }

}
