import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { Inquiry, InquiryDocument, InquiryType } from './schemas/inquiry.schema.js';
import { CreateInquiryDto } from './dto/create-inquiry.dto.js';

@Injectable()
export class InquiriesService {
  private readonly logger = new Logger(InquiriesService.name);

  constructor(
    @InjectModel(Inquiry.name) private inquiryModel: Model<InquiryDocument>,
    private configService: ConfigService,
  ) {}

  private getResend(): Resend | null {
    const apiKey = this.configService.get<string>('resend.apiKey');
    if (!apiKey) return null;
    return new Resend(apiKey);
  }

  async create(dto: CreateInquiryDto, ipAddress: string) {
    const inquiry = await this.inquiryModel.create({ ...dto, ipAddress });

    const resend = this.getResend();
    if (resend) {
      const emailFrom = this.configService.get<string>('resend.emailFrom') ?? 'noreply@nlspeaker.com';
      const emailNotify = this.configService.get<string>('resend.emailNotify') ?? 'admin@nlspeaker.com';
      const isBooking = dto.type === 'booking';

      await resend.emails
        .send({
          from: emailFrom,
          to: emailNotify,
          subject: `New ${isBooking ? 'Booking Request' : 'Contact Message'} from ${dto.name}`,
          html: `
            <h2>New ${isBooking ? 'Booking Request' : 'Contact Message'}</h2>
            <p><strong>Name:</strong> ${dto.name}</p>
            <p><strong>Email:</strong> ${dto.email}</p>
            <p><strong>Phone:</strong> ${dto.phone || 'Not provided'}</p>
            <p><strong>Organization:</strong> ${dto.organization || 'Not provided'}</p>
            ${isBooking ? `
            <p><strong>Event Date:</strong> ${dto.eventDate || 'Not provided'}</p>
            <p><strong>Event Type:</strong> ${dto.eventType || 'Not provided'}</p>
            <p><strong>Event Location:</strong> ${dto.eventLocation || 'Not provided'}</p>
            <p><strong>Audience Size:</strong> ${dto.audienceSize || 'Not provided'}</p>
            <p><strong>Budget:</strong> ${dto.budget || 'Not provided'}</p>
            <p><strong>Topics:</strong> ${dto.topics?.join(', ') || 'Not provided'}</p>
            ` : ''}
            <p><strong>Message:</strong></p>
            <p>${dto.message}</p>
          `,
        })
        .catch((err: Error) => {
          this.logger.warn(`Email notification failed: ${err.message}`);
        });
    } else {
      this.logger.warn('RESEND_API_KEY not set — email notification skipped');
    }

    return { submitted: true, id: inquiry._id };
  }

  findAll(type?: string) {
    const filter: Record<string, unknown> = {};
    if (type) filter['type'] = type as InquiryType;
    return this.inquiryModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  updateStatus(id: string, status: string) {
    return this.inquiryModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
  }
}
