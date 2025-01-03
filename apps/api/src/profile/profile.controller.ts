import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { CreateProfileDto, UpdateProfileDto } from './dto';
import { ProfileService } from './profile.service';

@UseGuards(JwtGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  getMyProfile(@GetUser('id') userId: string) {
    return this.profileService.getMyProfile(userId);
  }

  @Get(':id')
  getProfile(@Param('id', ParseUUIDPipe) profileId: string) {
    return this.profileService.getProfile(profileId);
  }

  @Post()
  createProfile(@GetUser('id') userId: string, @Body() dto: CreateProfileDto) {
    return this.profileService.createProfile(userId, dto);
  }

  @Patch(':id')
  editProfileById(
    @GetUser('id') userId: string,
    @Param('id', ParseUUIDPipe) profileId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.editProfileById(userId, profileId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteProfileById(
    @GetUser('id') userId: string,
    @Param('id', ParseUUIDPipe) profileId: string,
  ) {
    return this.profileService.deleteProfileById(userId, profileId);
  }
}
