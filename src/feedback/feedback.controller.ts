import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, InternalServerErrorException, NotFoundException, ConflictException, HttpException, Query, BadRequestException, Req } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAdminServiceGuard } from 'src/auth/guard/jwt-admin_customer.guard';
import { StandardParam, StandardParams, StandardResponse } from 'nest-standard-response';
import { FeedBackPagination } from './dto/pagination-feedback.dto';
import { RequestWithUser } from 'src/interface/request-interface';
@ApiTags('Feedback')
@Controller('api/v1/feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) { };

  @Post('')
  @UseGuards(JwtAdminServiceGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new FeedBack' })
  @ApiResponse({
    status: 201,
    description: 'It will create a new feedback in the response',
  })
  @ApiBody({
    type: CreateFeedbackDto
  })
  async create(@Body() createFeedbackDto: CreateFeedbackDto,
    @Req() req: RequestWithUser) {
    const item = await this.feedbackService.create(createFeedbackDto, req)
    if (item instanceof InternalServerErrorException
      || item instanceof NotFoundException
      || item instanceof ConflictException
      || item instanceof HttpException
    ) {
      return item as InternalServerErrorException || NotFoundException || ConflictException || HttpException;
    } else {
      return item;
    };
  };

  @Get('')
  @UseGuards(JwtAdminServiceGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List all  feedback' })
  @ApiResponse({
    status: 200,
    description: 'It will list all feedback in the response',
  })
  @StandardResponse({
    isPaginated: true,
  })
  async findAll(
    @Query() pagination: FeedBackPagination,
    @StandardParam() standardParam: StandardParams
  ) {
    const item = await this.feedbackService.find(pagination)
    if (item instanceof InternalServerErrorException ||
      item instanceof HttpException ||
      item instanceof BadRequestException
    ) {
      return item as HttpException | InternalServerErrorException;
    } else {
      const { data, totalCount } = item;
      standardParam.setPaginationInfo({
        count: totalCount,
        limit: data.length,
      });
      return data;
    }
  };

  @Get(':id')
  @UseGuards(JwtAdminServiceGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'detail feedback' })
  @ApiResponse({
    status: 200,
    description: 'It will update  feedback in the response',
  })
  async findOne(@Param('id') id: string) {
    const item = await this.feedbackService.findOne(id)
    if (item instanceof InternalServerErrorException
      || item instanceof NotFoundException
      || item instanceof HttpException
    ) {
      return item as InternalServerErrorException || NotFoundException || HttpException;
    } else {
      return item;
    }
  }

  @Patch(':id')
  @UseGuards(JwtAdminServiceGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update  feedback ' })
  @ApiResponse({
    status: 200,
    description: 'It will update Feeedback in the response',
  })
  async update(@Param('id') id: string, @Body() updateFeedbackDto: UpdateFeedbackDto) {
    const item = await this.feedbackService.update(id, updateFeedbackDto)

    if (item instanceof InternalServerErrorException
      || item instanceof NotFoundException
      || item instanceof HttpException

    ) {
      return item as InternalServerErrorException || HttpException || NotFoundException;
    } else {
      return item;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAdminServiceGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'delete  Service' })
  @ApiResponse({
    status: 200,
    description: 'It will delete Service in the response',
  })
  async remove(@Param('id') id: string) {
    const item = await this.feedbackService.delete(id)

    if (item instanceof InternalServerErrorException
      || item instanceof NotFoundException
      || item instanceof HttpException

    ) {
      return item as InternalServerErrorException || HttpException || NotFoundException;
    } else {
      return item;
    }
  }
}
