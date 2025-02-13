import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../shared/interfaces/user.interface';
import { LocalAuthGuard } from 'src/shared/guards/local-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns JWT token and user info',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string,
  ) {
    return this.authService.register(email, password, name);
  }
}
