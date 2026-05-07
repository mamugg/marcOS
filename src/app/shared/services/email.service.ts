import { Injectable } from '@angular/core';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';

/** EmailJS credentials — configure at https://dashboard.emailjs.com */
const EMAILJS_SERVICE_ID = 'EMAILJS_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'EMAILJS_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'EMAILJS_PUBLIC_KEY';

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
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        from_name: payload.from_name,
        from_email: payload.from_email,
        subject: payload.subject,
        message: payload.message,
      },
      { publicKey: EMAILJS_PUBLIC_KEY },
    );
  }
}
