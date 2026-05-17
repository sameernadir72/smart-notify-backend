import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiBody({ type: AuthDto }) // <-- 2. This tells Swagger to show the JSON placeholder!
  async signup(@Body() body: AuthDto) {
    // <-- 3. Change "any" to "AuthDto"
    return this.authService.signup(body.email, body.password);
  }

  // --- NEW LOGIN ROUTE ---
  @Post('login')
  @ApiOperation({ summary: 'Log in to get your JWT access token' })
  @ApiBody({ description: 'User login data', type: AuthDto })
  async login(@Body() body: AuthDto) {
    return this.authService.login(body.email, body.password);
  }
}
