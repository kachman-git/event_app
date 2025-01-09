import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto, UpdateEventDto } from './dto';
import { CreateTagsDto } from 'src/tags/dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  getEventsAll() {
    return this.prisma.event.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        tags: true,
        rsvps: true,
      },
    });
  }

  getEvents(organizerId: string) {
    return this.prisma.event.findMany({
      where: {
        organizerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  getEventById(eventId: string) {
    return this.prisma.event.findFirst({
      where: {
        id: eventId,
      },
    });
  }

  addTagToEvent(eventId: string, dto: CreateTagsDto) {
    return this.prisma.tag.create({
      data: {
        ...dto,
        eventId,
      },
    });
  }

  removeTagFromEvent(eventId: string, tagId: string) {
    return this.prisma.tag.delete({
      where: {
        id: tagId,
        eventId,
      },
    });
  }

  async createEvent(organizerId: string, dto: CreateEventDto) {
    const event = await this.prisma.event.create({
      data: {
        organizerId,
        ...dto,
      },
    });
    return event;
  }

  async editEventById(
    organizerId: string,
    eventId: string,
    dto: UpdateEventDto,
  ) {
    // get the event by id
    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    // check if user owns the event
    if (!event || event.organizerId !== organizerId)
      throw new ForbiddenException('Access to resources denied');

    return this.prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteEventById(organizerId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    // check if user owns the event
    if (!event || event.organizerId !== organizerId)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.event.delete({
      where: {
        id: eventId,
      },
    });
  }
}
