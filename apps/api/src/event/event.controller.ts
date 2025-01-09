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
import { EventService } from './event.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { CreateEventDto, UpdateEventDto } from './dto';
import { CreateTagsDto } from 'src/tags/dto';

@UseGuards(JwtGuard)
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('all')
  getEventsAll(@GetUser('id') organizerId: string) {
    return this.eventService.getEvents(organizerId);
  }

  @Get('me')
  getEvents(@GetUser('id') organizerId: string) {
    return this.eventService.getEvents(organizerId);
  }

  @Get(':id')
  getEventById(@Param('id', ParseUUIDPipe) eventId: string) {
    return this.eventService.getEventById(eventId);
  }

  @Post()
  createEvent(@GetUser('id') organizerId: string, @Body() dto: CreateEventDto) {
    return this.eventService.createEvent(organizerId, dto);
  }

  @Post(':id/tags')
  addTagToEvent(
    @Param('id', ParseUUIDPipe) eventId: string,
    @Body() createTagDto: CreateTagsDto,
  ) {
    return this.eventService.addTagToEvent(eventId, createTagDto);
  }

  @Patch(':id')
  editEventById(
    @GetUser('id') organizerId: string,
    @Param('id', ParseUUIDPipe) eventId: string,
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventService.editEventById(organizerId, eventId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteEventById(
    @GetUser('id') organizerId: string,
    @Param('id', ParseUUIDPipe) eventId: string,
  ) {
    return this.eventService.deleteEventById(organizerId, eventId);
  }

  @Delete(':id/tags/:tagId')
  removeTagFromEvent(
    @Param('id', ParseUUIDPipe) eventId: string,
    @Param('tagId', ParseUUIDPipe) tagId: string,
  ) {
    return this.eventService.removeTagFromEvent(eventId, tagId);
  }
}
