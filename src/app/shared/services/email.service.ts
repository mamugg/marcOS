import { Injectable } from '@angular/core';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { environment } from '../../../environments/environment';

export interface EmailPayload {
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class EmailService {
  /**
   * Send an email via EmailJS to Marc-Antoine.
   * Template must expose variables: from_name, from_email, subject, message.
   */
  send(payload: EmailPayload): Promise<EmailJSResponseStatus> {
    return emailjs.send(
      environment.emailJs.serviceId,
      environment.emailJs.templateId,
      {
        from_name: payload.from_name,
        from_email: payload.from_email,
        subject: payload.subject,
        message: payload.message,
      },
      { publicKey: environment.emailJs.publicKey },
    );
  }
}
