import { Controller, Get, Post, Body, UseGuards, Request, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guard/jwt.guard';
import { RegisterDto } from './dto/register-auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'It will give you the access_token in the response',
  })
  @ApiBody({
    type: LoginDto
  })
  async create(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto)
  }
  @Get('profile')
  // @UseGuards(JwtAuthGuard)
  @UseGuards(JwtAuthGuard)
  getProfile(
    @Request() req,
  ) {
    return req.user;
  }
  @Post('register')
  @ApiBody({
    type: RegisterDto
  })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    if (user instanceof InternalServerErrorException
      || user instanceof NotFoundException) {
      return user as InternalServerErrorException | NotFoundException;
    } else {
      return user;
    }
  }

}
