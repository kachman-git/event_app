import { Controller } from '@nestjs/common';
import { RsvpService } from './rsvp.service';

@Controller('rsvp')
export class RsvpController {
  constructor(private readonly rsvpService: RsvpService) {}
}
