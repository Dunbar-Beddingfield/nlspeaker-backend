import { PartialType } from '@nestjs/mapped-types';
import { CreateSpeakerDto } from './create-speaker.dto.js';

export class UpdateSpeakerDto extends PartialType(CreateSpeakerDto) {}
