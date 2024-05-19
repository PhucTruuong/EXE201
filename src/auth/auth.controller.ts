import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guard/jwt.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @ApiBody({
    type: LoginDto
  })
  async create(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto)
  }
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(
    @Request() req,
  ) {
    return req.user;
  }

}
