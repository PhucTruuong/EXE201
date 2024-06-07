import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Req
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register-auth.dto';
import { TokenDto } from './dto/token-auth.dto';
import { JwtCustomerGuard } from './guard/jwt-customer.guard';
import { RequestWithUser } from 'src/interface/request-interface';
import { JwtAuthGuard } from './guard/jwt.guard';
//import { sendSuccessResponse } from 'src/constants/sendSucessResponse';
//import { Response } from 'express';
//import HttpStatusCodes from 'src/constants/HttpStatusCodes';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 403, description: 'Bad Request or the account is banned!' })
  @ApiResponse({
    status: 200,
    description: 'It will give you the access_token in the response',
  })
  @ApiBody({
    type: LoginDto,
  })
  async create(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);
    console.log('Data: ', data);
    if (
      data instanceof InternalServerErrorException ||
      NotFoundException || ForbiddenException
    ) {
      return data as InternalServerErrorException | NotFoundException | ForbiddenException;
    };
    return data;
  };





  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }
  @Post('register')
  @ApiBody({
    type: RegisterDto,
  })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    if (
      user instanceof InternalServerErrorException ||
      user instanceof NotFoundException
    ) {
      return user as InternalServerErrorException | NotFoundException;
    } else {
      return user;
    };
  };

  @Post('login-google')
  @ApiOperation({ summary: ' Login with Google for Web FIREBASE' })
  @ApiResponse({ status: 201, description: 'Successfully create accessToken.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({
    type: TokenDto,
  })
  async loginWitGoogle(@Body() tokenDto: TokenDto) {
    if (!tokenDto.idToken) {
      throw new BadRequestException('idToken is required');
    };
    return this.authService.loginWithGoogle(tokenDto);
  };

  @Post('login-google-mobile')
  @ApiOperation({
    summary: ' Login with Google for React Native using Google Auth',
  })
  @ApiResponse({ status: 201, description: 'Successfully create accessToken.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async loginWitGoogleWithMobile(@Body() userInfo: any) {
    return this.authService.loginWithGoogleMobile(userInfo);
  };
};
